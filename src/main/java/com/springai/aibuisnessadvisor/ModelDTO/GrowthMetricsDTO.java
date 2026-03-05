package com.springai.aibuisnessadvisor.ModelDTO;

import com.springai.aibuisnessadvisor.Model.GrowthTrend;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GrowthMetricsDTO {

    // Current vs Previous (FOR DASHBOARD & AI)
    private BigDecimal currentMrr;
    private BigDecimal previousMrr;

    private BigDecimal currentArr;
    private BigDecimal previousArr;

    private BigDecimal currentRevenue;
    private BigDecimal previousRevenue;

    // Calculated Growth Rates (from GrowthMetrics entity)
    private BigDecimal mrrGrowthRate;
    private BigDecimal arrGrowthRate;
    private BigDecimal revenueGrowthRate;

    private GrowthTrend growthTrend;

    // AI/Business interpretation layer
    private String growthSummary; // "Strong Growth", "Declining", etc.
}
