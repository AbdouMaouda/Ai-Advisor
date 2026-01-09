package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
public class RefundMetrics {
    @Column(name = "total_refunds")
    private Long totalRefunds = 0L;

    @Column(name = "total_refund_amount", precision = 19, scale = 2)
    private BigDecimal totalRefundAmount = BigDecimal.ZERO;

    @Column(name = "partial_refunds")
    private Long partialRefunds = 0L;

    @Column(name = "full_refunds")
    private Long fullRefunds = 0L;

    @Column(name = "average_refund_amount", precision = 19, scale = 2)
    private BigDecimal averageRefundAmount = BigDecimal.ZERO;

    @Column(name = "refund_rate", precision = 10, scale = 4)
    private BigDecimal refundRate = BigDecimal.ZERO;


}
