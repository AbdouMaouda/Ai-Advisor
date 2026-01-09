package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;



//Class that has all the BusinessData


@Entity
@Table(name = "business_metrics")
@Getter
@Setter
@NoArgsConstructor
public class BusinessMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // snapshot ID

    /**
     * Business this snapshot belongs to
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;
    /**
     * Metrics time window
     */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /**
     * When metrics were calculated
     */
    @Column(name = "collected_at", nullable = false)
    private Instant collectedAt;

    /**
     * Embedded metrics (value objects)
     */
    @Embedded
    private CustomerMetrics customerMetrics;

    @Embedded
    private RevenueMetrics revenueMetrics;

    @Embedded
    private SubscriptionMetrics subscriptionMetrics;

    @Embedded
    private InvoiceMetrics invoiceMetrics;

    @Embedded
    private RefundMetrics refundMetrics;

    /*
   @Embedded
    private GrowthMetrics growthMetrics;
*/
    @Embedded
    private HealthMetrics healthMetrics;

    /**
     * Product performance is the only real child entity
     */
    @OneToMany(
            mappedBy = "businessMetrics",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductPerformance> productPerformance = new ArrayList<>();
}
