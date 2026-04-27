package com.springai.aibuisnessadvisor.Security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwksKeyProvider jwksKeyProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        log.debug("Request to: {} | Authorization header: {}",
                request.getRequestURI(),
                authHeader != null ? authHeader.substring(0, Math.min(20, authHeader.length())) : "null");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            String kid = extractKid(token);
            PublicKey publicKey = jwksKeyProvider.getKey(kid);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String clerkUserId = claims.getSubject();
            log.debug("JWT validated, clerkUserId: {}", clerkUserId);
            request.setAttribute("clerkUserId", clerkUserId);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(clerkUserId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(request, response);
    }

    private String extractKid(String token) throws Exception {
        String encodedHeader = token.split("\\.")[0];
        String headerJson = new String(Base64.getUrlDecoder().decode(encodedHeader));
        return objectMapper.readTree(headerJson).get("kid").asText();
    }
}
