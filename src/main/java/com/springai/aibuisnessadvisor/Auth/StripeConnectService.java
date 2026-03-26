package com.springai.aibuisnessadvisor.Auth;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformAuth;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class StripeConnectService {

    private final BusinessRepository businessRepository;

    @Value("${stripe.api.key}")
    private String platformSecretKey;
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;


    public StripeConnectService(BusinessRepository businessRepository) {
        this.businessRepository = businessRepository;
    }

    private String getOrCreateStripeAccount(Business business) throws StripeException {
        //Before creating we must verify in the db if the business do not alredy have an id

        if (business.getPlatformAccounts() != null && business.getPlatformAccounts().containsKey(PlatformType.STRIPE)) {
            String accountId = business.getPlatformAccounts().get(PlatformType.STRIPE);
            return accountId;
        }
        Account account = Account.create(
                AccountCreateParams.builder()
                        .setType(AccountCreateParams.Type.EXPRESS)
                        .build()
        );

        String accountId = account.getId();

        if (business.getPlatformAccounts() == null) {
            business.setPlatformAccounts(new HashMap<>());
        }
        business.getPlatformAccounts().put(PlatformType.STRIPE, accountId);
        businessRepository.save(business);

        return accountId;


    }

    private String generateAccountLink(String accountId, Long businessId) throws StripeException {
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(accountId)
                        .setRefreshUrl(baseUrl + "/api/stripe/refresh?businessId=" + businessId)
                        .setReturnUrl(baseUrl + "/api/stripe/return?businessId=" + businessId)
                        .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                        .build()
        );

        return accountLink.getUrl();
    }

    public String createOnboardingLink(Long businessId) throws StripeException {
        Stripe.apiKey = platformSecretKey;


        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("businessId not found"));

        String accountId = getOrCreateStripeAccount(business);

        return generateAccountLink(accountId, businessId);
    }

    public String refreshOnboardingLink(Long businessId) throws StripeException {

        Stripe.apiKey = platformSecretKey;

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found: " + businessId));

        String accountId = business.getPlatformAccounts().get(PlatformType.STRIPE);

        if (accountId == null) {
            throw new IllegalStateException("No Stripe account for business: " + businessId);
        }

        return generateAccountLink(accountId, businessId);

}
public boolean isStripeConnected(Long businessId){
    Business business = businessRepository.findById(businessId)
            .orElseThrow(() -> new RuntimeException("Business not found: " + businessId));

    return business.getPlatformAccounts() != null &&
            business.getPlatformAccounts().containsKey(PlatformType.STRIPE);
}

}
