package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RefundMetricsDTO {

    // Counts
    private Long totalRefunds;
    private Long partialRefunds;
    private Long fullRefunds;

    // Money
    private BigDecimal totalRefundAmount;
    private BigDecimal averageRefundAmount;

    // Key KPI (VERY important for AI insights & dashboard)
    private BigDecimal refundRate;
}
