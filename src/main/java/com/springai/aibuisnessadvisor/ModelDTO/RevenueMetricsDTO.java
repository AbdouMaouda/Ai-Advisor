package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RevenueMetricsDTO {

    // Core revenue KPIs (VERY important for dashboards & AI)
    private BigDecimal grossRevenue;
    private BigDecimal netRevenue;
    private BigDecimal refundedAmount;

    // Transaction performance
    private Long successfulCharges;
    private Long failedCharges;

    // Business efficiency metrics
    private BigDecimal averageTransactionValue;
    private BigDecimal averageDailyRevenue;
}
