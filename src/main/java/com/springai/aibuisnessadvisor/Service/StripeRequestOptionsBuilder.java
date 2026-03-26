package com.springai.aibuisnessadvisor.Service;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.Stripe;
import com.stripe.net.RequestOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StripeRequestOptionsBuilder {
    private final BusinessRepository businessRepository;

    @Value("${stripe.api.key}")
    private String platformSecretKey;

    public RequestOptions createRequestOptions(Long businessId) {
        Stripe.apiKey = platformSecretKey;
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found: " + businessId));

        String stripeAccountId = business.getPlatformAccounts().get(PlatformType.STRIPE);
        if (stripeAccountId == null) {
            throw new IllegalStateException("Stripe not connected for business: " + businessId);
        }

        return RequestOptions.builder()
                .setStripeAccount(stripeAccountId)
                .build();

    }

}
