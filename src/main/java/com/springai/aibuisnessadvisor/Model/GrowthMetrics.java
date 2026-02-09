package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * GrowthMetrics compares the current period with the previous period to
 * show how the business is growing (or declining)
 */
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrowthMetrics {
    @Column(name = "previous_gross_revenue", precision = 19, scale = 2)
    private BigDecimal previousGrossRevenue = BigDecimal.ZERO; //Revenue of last period,last 7 days,last month...

    @Column(name = "previous_net_revenue", precision = 19, scale = 2)
    private BigDecimal previousNetRevenue = BigDecimal.ZERO;

    @Column(name = "gross_revenue_difference", precision = 19, scale = 2)
    private BigDecimal grossRevenueDifference = BigDecimal.ZERO;

    @Column(name = "gross_revenue_growth_rate", precision = 10, scale = 4)
    private BigDecimal grossRevenueGrowthRate = BigDecimal.ZERO;

    @Column(name = "net_revenue_difference", precision = 19, scale = 2)
    private BigDecimal netRevenueDifference = BigDecimal.ZERO;

    @Column(name = "net_revenue_growth_rate", precision = 10, scale = 4)
    private BigDecimal netRevenueGrowthRate = BigDecimal.ZERO;


    @Column(name = "previous_mrr", precision = 19, scale = 2)
    private BigDecimal previousMrr = BigDecimal.ZERO;// What was the MRR last month?


    @Column(name = "mrr_difference", precision = 19, scale = 2)
    private BigDecimal mrrDifference = BigDecimal.ZERO;// How much did MRR change?

    @Column(name = "mrr_growth_rate", precision = 10, scale = 4)
    private BigDecimal mrrGrowthRate = BigDecimal.ZERO;// MRR growth percentage

    @Column(name = "previous_arr", precision = 19, scale = 2)
    private BigDecimal previousArr = BigDecimal.ZERO;
    // What was the ARR last period?

    @Column(name = "arr_difference", precision = 19, scale = 2)
    private BigDecimal arrDifference = BigDecimal.ZERO;
    // How much did ARR change?

    @Column(name = "arr_growth_rate", precision = 10, scale = 4)
    private BigDecimal arrGrowthRate = BigDecimal.ZERO;
    // ARR growth percentage

    @Enumerated(EnumType.STRING)
    @Column(name = "growth_trend")
    private GrowthTrend growthTrend;//Growing,Declining,stable


}
