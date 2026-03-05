package com.springai.aibuisnessadvisor.ModelDTO;

import com.springai.aibuisnessadvisor.Model.HealthStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class HealthMetricsDTO {

    /**
     * Overall business health score (0–100)
     */
    private BigDecimal healthScore;

    /**
     * Categorical interpretation (EXCELLENT, GOOD, WARNING, CRITICAL, etc.)
     */
    private HealthStatus healthStatus;

    /**
     * Positive signals detected in this period
     * Example: ["Strong MRR growth", "Low churn rate"]
     */
    private List<String> strengths;

    /**
     * Risks or issues detected
     * Example: ["High churn", "Declining active users"]
     */
    private List<String> warnings;

    /**
     * Actionable recommendations (VERY important for AI product)
     * Example: ["Improve retention strategy", "Introduce annual plans"]
     */
    private List<String> recommendations;
}
