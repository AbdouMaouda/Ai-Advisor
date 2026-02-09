package com.springai.aibuisnessadvisor.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
        name = "business_metrics",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"business_id", "start_date", "end_date", "platform_type"}
                )
        },
        indexes = {
                @Index(name = "idx_business_end_date", columnList = "business_id, end_date DESC"),
                @Index(name = "idx_business_platform_end_date", columnList = "business_id, platform_type, end_date DESC")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class BusinessMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    @JsonIgnore
    private Business business;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_type", nullable = false)
    private PlatformType platformType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "collected_at", nullable = false)
    private Instant collectedAt;

    @Embedded
    private CustomerMetrics customerMetrics;

    @Embedded
    private RevenueMetrics revenueMetrics;

    @Embedded
    private RefundMetrics refundMetrics;

    @Embedded
    private SubscriptionMetrics subscriptionMetrics;

    @Embedded
    private InvoiceMetrics invoiceMetrics;

    @Embedded
    private GrowthMetrics growthMetrics;

    @Embedded
    private HealthMetrics healthMetrics;
}