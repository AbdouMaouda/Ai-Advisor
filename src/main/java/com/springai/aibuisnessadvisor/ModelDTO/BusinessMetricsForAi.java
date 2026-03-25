package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessMetricsForAi {

    // REVENUE METRICS
    private BigDecimal currentGrossRevenue;
    private BigDecimal previousGrossRevenue;
    private BigDecimal grossRevenueGrowthRate;

    private BigDecimal currentNetRevenue;
    private BigDecimal previousNetRevenue;
    private BigDecimal netRevenueGrowthRate;
    private BigDecimal netRevenueRatio;

    // MRR/ARR METRICS
    private BigDecimal currentMrr;
    private BigDecimal previousMrr;
    private BigDecimal mrrGrowthRate;

    private BigDecimal currentArr;
    private BigDecimal previousArr;
    private BigDecimal arrGrowthRate;

    // CUSTOMER METRICS
    private Long totalCustomers;
    private Long activeCustomers;
    private Long previousActiveCustomers;
    private Long newCustomers;
    private Long churnedCustomers;
    private Double churnRate;
    private Double retentionRate;
    private Double activeCustomerRatio;
    private Long customerGrowth;        // ← ADD THIS if needed
    private Double customerGrowthRate;  // ← ADD THIS if needed

    // SUBSCRIPTION METRICS
    private Long totalSubscriptions;
    private Long activeSubscriptions;
    private Long previousActiveSubscriptions;
    private Long newSubscriptions;
    private Long cancelledSubscriptions;
    private Double activeSubscriptionRatio;
    private Double trialConversionRate;  // ← Can be null if you don't have it

    // FINANCIAL HEALTH METRICS
    private BigDecimal averageRevenuePerUser;
    private BigDecimal customerLifetimeValue;
    private BigDecimal customerAcquisitionCost;
    private BigDecimal ltvcacRatio;

    // REFUND METRICS
    private BigDecimal refundRate;
    private BigDecimal totalRefunds;     // ← Optional
    private Long refundCount;            // ← Optional

    // INVOICE/PAYMENT METRICS
    private Long totalInvoices;
    private Long paidInvoices;
    private Long pendingInvoices;
    private Long overdueInvoices;
    private Double paymentSuccessRate;
    private Double averagePaymentTime;

    // GROWTH TREND
    private String growthTrend;

    // HEALTH SCORES
    private BigDecimal overallHealthScore;
    private BigDecimal customerScore;
    private BigDecimal revenueScore;
    private BigDecimal subscriptionScore;
    private BigDecimal growthScore;
    private BigDecimal refundScore;

    // TIME CONTEXT
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String comparisonPeriod;
}