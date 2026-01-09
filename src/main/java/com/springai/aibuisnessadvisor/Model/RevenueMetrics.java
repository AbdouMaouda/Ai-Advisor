package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class RevenueMetrics {

    // Money charged before refunds
    @Column(name = "gross_revenue", precision = 19, scale = 2)
    private BigDecimal grossRevenue = BigDecimal.ZERO;

    // Revenue after refunds
    @Column(name = "net_revenue", precision = 19, scale = 2)
    private BigDecimal netRevenue = BigDecimal.ZERO;

    // Money refunded (impact on revenue)
    @Column(name = "refunded_amount", precision = 19, scale = 2)
    private BigDecimal refundedAmount = BigDecimal.ZERO;

    // Transaction quality
    @Column(name = "successful_charges")
    private Long successfulCharges = 0L;

    @Column(name = "failed_charges")
    private Long failedCharges = 0L;

    // Averages
    @Column(name = "average_transaction_value", precision = 19, scale = 2)
    private BigDecimal averageTransactionValue = BigDecimal.ZERO;

    @Column(name = "average_daily_revenue", precision = 19, scale = 2)
    private BigDecimal averageDailyRevenue = BigDecimal.ZERO;
}
