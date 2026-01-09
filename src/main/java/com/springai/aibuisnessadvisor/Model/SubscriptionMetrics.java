package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class SubscriptionMetrics {

    // Snapshot counts
    @Column(name = "total_subscriptions")
    private Long totalSubscriptions = 0L;

    @Column(name = "active_subscriptions")
    private Long activeSubscriptions = 0L;

    @Column(name = "trialing_subscriptions")
    private Long trialingSubscriptions = 0L;

    @Column(name = "paused_subscriptions")
    private Long pausedSubscriptions = 0L;

    // Movement during the period
    @Column(name = "new_subscriptions")
    private Long newSubscriptions = 0L;

    @Column(name = "canceled_subscriptions")
    private Long canceledSubscriptions = 0L;

    @Column(name = "upgrades")
    private Long upgrades = 0L;

    @Column(name = "downgrades")
    private Long downgrades = 0L;

    // Recurring revenue (DERIVED)
    @Column(name = "mrr", precision = 19, scale = 2)
    private BigDecimal mrr = BigDecimal.ZERO;

    @Column(name = "arr", precision = 19, scale = 2)
    private BigDecimal arr = BigDecimal.ZERO;

    // Average value
    @Column(name = "average_revenue_per_subscription", precision = 19, scale = 2)
    private BigDecimal averageRevenuePerSubscription = BigDecimal.ZERO;
}
