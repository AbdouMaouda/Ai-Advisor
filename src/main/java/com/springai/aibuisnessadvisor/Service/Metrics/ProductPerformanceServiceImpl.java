package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.net.RequestOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class ProductPerformanceServiceImpl implements ProductPerformanceService {
    @Autowired
    private BusinessRepository businessRepository;

    @Value("${app.mode}")
    private String appMode;

    @Override
    public List<ProductPerformanceService> getProductPerformanceService(Long productId, Instant startDate, Instant endDate, PlatformType platformType) {

        Map<String, ProductData> productMap = new HashMap<>();


        return null;
    }


    private RequestOptions buildRequestOptions(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        String stripeAccountId = business.getPlatformAccounts().get(PlatformType.STRIPE);

        if (stripeAccountId != null) {
            return RequestOptions.builder()
                    .setStripeAccount(stripeAccountId)
                    .build();
        } else if ("dev".equals(appMode)) {
            return RequestOptions.builder().build();  // Empty options for dev
        } else {
            throw new IllegalStateException("Stripe not connected for this business");
        }
    }

    private static class ProductData {
        String productId;
        String productName;
        String productDescription;
        BigDecimal revenue = BigDecimal.ZERO;
        Long quantity = 0L;
        Set<String> customers = new HashSet<>();  // Unique customers
    }


}
