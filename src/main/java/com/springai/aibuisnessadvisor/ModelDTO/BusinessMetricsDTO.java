package com.springai.aibuisnessadvisor.ModelDTO;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class BusinessMetricsDTO {

    private Long id;
    private Long businessId;
    private PlatformType platformType;

    private LocalDate startDate;
    private LocalDate endDate;
    private Instant collectedAt;

    private CustomerMetricsDTO customer;
    private RevenueMetricsDTO revenue;
    private RefundMetricsDTO refunds;
    private SubscriptionMetricsDTO subscriptions;
    private InvoiceMetricsDTO invoices;
    private GrowthMetricsDTO growth;
    private HealthMetricsDTO health;

    }
