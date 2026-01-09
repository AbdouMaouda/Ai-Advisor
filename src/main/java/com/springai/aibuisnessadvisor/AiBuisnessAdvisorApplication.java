package com.springai.aibuisnessadvisor;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiBuisnessAdvisorApplication {
    @Value("${stripe.api.key}")
    private String apiKey;

    @PostConstruct  //
    public void init() {
        Stripe.apiKey = apiKey;
    }

    public static void main(String[] args) {
        SpringApplication.run(AiBuisnessAdvisorApplication.class, args);
    }

}
