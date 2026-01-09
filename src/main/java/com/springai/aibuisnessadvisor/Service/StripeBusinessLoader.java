package com.springai.aibuisnessadvisor.Service;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StripeBusinessLoader implements CommandLineRunner {

    @Autowired
    private BusinessRepository businessRepository;

    @Override
    public void run(String... args) throws Exception {
        if (businessRepository.count() == 0) {
            try {
                // Get YOUR Stripe account info
                Account account = Account.retrieve();

                Business business = new Business();
                business.setBusinessName(account.getBusinessProfile().getName() != null
                        ? account.getBusinessProfile().getName()
                        : "My Business");
                business.setEmail(account.getEmail());
                business.setCountry(account.getCountry());
                business.setPrimaryCurrency(account.getDefaultCurrency().toUpperCase());
                business.setIsActive(true);

                businessRepository.save(business);

                System.out.println("========================================");
                System.out.println("✅ Business created from Stripe account!");
                System.out.println("Business ID: " + business.getId());
                System.out.println("Name: " + business.getBusinessName());
                System.out.println("Email: " + business.getEmail());
                System.out.println("Country: " + business.getCountry());
                System.out.println("Currency: " + business.getPrimaryCurrency());
                System.out.println("========================================");
                System.out.println("Test with: GET http://localhost:8080/api/v1/customersCount/" + business.getId());
                System.out.println("========================================");

            } catch (StripeException e) {
                System.err.println("Failed to fetch Stripe account info: " + e.getMessage());
                System.err.println("Creating default test business instead...");

                // Fallback to default
                Business business = new Business();
                business.setBusinessName("Test Business");
                business.setEmail("test@example.com");
                business.setCountry("US");
                business.setPrimaryCurrency("USD");
                business.setIsActive(true);

                businessRepository.save(business);
                System.out.println("Created business with ID: " + business.getId());
            }
        }
    }
}
