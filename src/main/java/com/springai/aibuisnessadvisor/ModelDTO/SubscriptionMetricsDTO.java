package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubscriptionMetricsDTO {

    // Snapshot counts (current state of the business)
    private Long totalSubscriptions;
    private Long activeSubscriptions;
    private Long trialingSubscriptions;
    private Long pausedSubscriptions;

    // Movement during the period (VERY important for AI insights)
    private Long newSubscriptions;
    private Long canceledSubscriptions;
    private Long upgrades;
    private Long downgrades;

    // Core SaaS KPIs (critical for dashboards & AI analysis)
    private BigDecimal mrr;
    private BigDecimal arr;

    // Monetization efficiency
    private BigDecimal averageRevenuePerSubscription;
}
