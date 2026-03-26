package com.springai.aibuisnessadvisor.Auth;
import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
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
    @PostMapping("/create-account-link")
    public Map<String, String> createAccountLink(@RequestParam Long businessId)
            throws StripeException {

        String onboardingUrl = stripeConnectService.createOnboardingLink(businessId);

        Map<String, String> response = new HashMap<>();
        response.put("url", onboardingUrl);

        return response;
    }

    /**
     * User returns after completing onboarding
     */
    @GetMapping("/return")
    public RedirectView handleReturn(@RequestParam Long businessId) {
        return new RedirectView("/dashboard?stripe_connected=true");
    }

    /**
     * Refreshes expired onboarding link
     */
    @GetMapping("/refresh")
    public RedirectView handleRefresh(@RequestParam Long businessId)
            throws StripeException {

        String freshUrl = stripeConnectService.refreshOnboardingLink(businessId);
        return new RedirectView(freshUrl);
    }

    @GetMapping("/status/{businessId}")
    public Map<String, Object> getConnectionStatus(@PathVariable Long businessId) {

        boolean connected = stripeConnectService.isStripeConnected(businessId);

        // Get account ID directly from DB
        String accountId = null;
        if (connected) {
            Business business = businessRepository.findById(businessId).orElseThrow();
            accountId = business.getPlatformAccounts().get(PlatformType.STRIPE);
        }

        return Map.of(
                "connected", connected,
                "accountId", accountId != null ? accountId : ""
        );
    }
}