package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetrics {

    /**
     * Overall business health score (0–100)
     */
    @Column(name = "health_score", precision = 5, scale = 2)
    private BigDecimal healthScore = BigDecimal.ZERO;

    /**
     * Categorical health interpretation
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", length = 20)
    private HealthStatus healthStatus;

    /**
     * Positive signals detected in this period
     */
    @ElementCollection
    @CollectionTable(
            name = "health_strengths",
            joinColumns = @JoinColumn(name = "business_metrics_id")
    )
    @Column(name = "strength", columnDefinition = "TEXT")
    private List<String> strengths = new ArrayList<>();

    /**
     * Risks or issues detected
     */
    @ElementCollection
    @CollectionTable(
            name = "health_warnings",
            joinColumns = @JoinColumn(name = "business_metrics_id")
    )
    @Column(name = "warning", columnDefinition = "TEXT")
    private List<String> warnings = new ArrayList<>();

    /**
     * Actionable improvement suggestions
     */
    @ElementCollection
    @CollectionTable(
            name = "health_recommendations",
            joinColumns = @JoinColumn(name = "business_metrics_id")
    )
    @Column(name = "recommendation", columnDefinition = "TEXT")
    private List<String> recommendations = new ArrayList<>();
}
