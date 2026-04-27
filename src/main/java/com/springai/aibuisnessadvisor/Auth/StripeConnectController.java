package com.springai.aibuisnessadvisor.Auth;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Service.ClerkUserService;
import com.stripe.exception.StripeException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@RequiredArgsConstructor
public class StripeConnectController {

    @Autowired
    private final StripeConnectService stripeConnectService;
    @Autowired
    private final BusinessRepository businessRepository;
    @Autowired
    private final ClerkUserService clerkUserService;

    @PostMapping("/create-account-link")
    public Map<String, String> createAccountLink(HttpServletRequest request) throws StripeException {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        String onboardingUrl = stripeConnectService.createOnboardingLink(businessId);
        Map<String, String> response = new HashMap<>();
        response.put("url", onboardingUrl);
        return response;
    }

    // These two remain public — Stripe redirects here after onboarding (no Clerk JWT)
    @GetMapping("/return")
    public RedirectView handleReturn(@RequestParam Long businessId) {
        return new RedirectView("http://localhost:5173/dashboard?stripe_connected=true");
    }

    @GetMapping("/refresh")
    public RedirectView handleRefresh(@RequestParam Long businessId) throws StripeException {
        String freshUrl = stripeConnectService.refreshOnboardingLink(businessId);
        return new RedirectView(freshUrl);
    }

    @GetMapping("/status")
    public Map<String, Object> getConnectionStatus(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        boolean connected = stripeConnectService.isStripeConnected(businessId);
        String accountId = null;
        if (connected) {
            Business business = businessRepository.findById(businessId).orElseThrow();
            accountId = business.getPlatformAccounts().get(PlatformType.STRIPE);
        }
        return Map.of("connected", connected, "accountId", accountId != null ? accountId : "");
    }
}
