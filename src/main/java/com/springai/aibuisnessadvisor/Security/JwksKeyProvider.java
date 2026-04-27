package com.springai.aibuisnessadvisor.Security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwksKeyProvider {

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public PublicKey getKey(String kid) throws Exception {
        if (keyCache.containsKey(kid)) {
            return keyCache.get(kid);
        }
        loadKeys();
        PublicKey key = keyCache.get(kid);
        if (key == null) {
            throw new RuntimeException("No JWKS key found for kid: " + kid);
        }
        return key;
    }

    private void loadKeys() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(jwksUrl))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode root = objectMapper.readTree(response.body());
        JsonNode keys = root.get("keys");
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        for (JsonNode key : keys) {
            String keyId = key.get("kid").asText();
            BigInteger modulus  = new BigInteger(1, Base64.getUrlDecoder().decode(key.get("n").asText()));
            BigInteger exponent = new BigInteger(1, Base64.getUrlDecoder().decode(key.get("e").asText()));
            PublicKey publicKey = keyFactory.generatePublic(new RSAPublicKeySpec(modulus, exponent));
            keyCache.put(keyId, publicKey);
        }
    }
}
