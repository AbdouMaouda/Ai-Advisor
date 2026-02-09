package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.GrowthMetrics;
import com.springai.aibuisnessadvisor.Model.GrowthTrend;
import com.springai.aibuisnessadvisor.Model.RevenueMetrics;
import com.springai.aibuisnessadvisor.Model.SubscriptionMetrics;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class GrowthMetricsServiceImpl implements GrowthMetricsService {

    // Threshold for considering growth as "stable" (within ±5%)
    private static final BigDecimal STABLE_THRESHOLD = BigDecimal.valueOf(5.0);

    @Override
    public GrowthMetrics computeGrowthMetrics(
            RevenueMetrics currentRevenue,
            RevenueMetrics previousRevenue,
            SubscriptionMetrics currentSubscription,
            SubscriptionMetrics previousSubscription) {

        GrowthMetrics growthMetrics = new GrowthMetrics();

        // If no previous data, return empty growth metrics
        if (previousRevenue == null && previousSubscription == null) {
            return growthMetrics;
        }

        // Calculate revenue growth
        if (previousRevenue != null && currentRevenue != null) {
            calculateRevenueGrowth(growthMetrics, currentRevenue, previousRevenue);
        }

        // Calculate subscription growth (MRR/ARR)
        if (previousSubscription != null && currentSubscription != null) {
            calculateSubscriptionGrowth(growthMetrics, currentSubscription, previousSubscription);
        }

        // Determine overall growth trend
        growthMetrics.setGrowthTrend(determineGrowthTrend(growthMetrics));

        return growthMetrics;
    }

    /**
     * Calculate revenue growth metrics
     */
    private void calculateRevenueGrowth(
            GrowthMetrics growthMetrics,
            RevenueMetrics current,
            RevenueMetrics previous) {

        // Store previous values
        growthMetrics.setPreviousGrossRevenue(previous.getGrossRevenue());
        growthMetrics.setPreviousNetRevenue(previous.getNetRevenue());

        // Calculate gross revenue difference and growth rate
        BigDecimal grossDifference = current.getGrossRevenue().subtract(previous.getGrossRevenue());
        growthMetrics.setGrossRevenueDifference(grossDifference);

        BigDecimal grossGrowthRate = calculateGrowthRate(
                previous.getGrossRevenue(),
                current.getGrossRevenue()
        );
        growthMetrics.setGrossRevenueGrowthRate(grossGrowthRate);

        // Calculate net revenue difference and growth rate
        BigDecimal netDifference = current.getNetRevenue().subtract(previous.getNetRevenue());
        growthMetrics.setNetRevenueDifference(netDifference);

        BigDecimal netGrowthRate = calculateGrowthRate(
                previous.getNetRevenue(),
                current.getNetRevenue()
        );
        growthMetrics.setNetRevenueGrowthRate(netGrowthRate);
    }

    /**
     * Calculate subscription growth metrics (MRR/ARR)
     */
    private void calculateSubscriptionGrowth(
            GrowthMetrics growthMetrics,
            SubscriptionMetrics current,
            SubscriptionMetrics previous) {

        // Store previous MRR
        growthMetrics.setPreviousMrr(previous.getMrr());

        // Calculate MRR difference and growth rate
        BigDecimal mrrDifference = current.getMrr().subtract(previous.getMrr());
        growthMetrics.setMrrDifference(mrrDifference);

        BigDecimal mrrGrowthRate = calculateGrowthRate(previous.getMrr(), current.getMrr());
        growthMetrics.setMrrGrowthRate(mrrGrowthRate);

        // Store previous ARR
        growthMetrics.setPreviousArr(previous.getArr());

        // Calculate ARR difference and growth rate
        BigDecimal arrDifference = current.getArr().subtract(previous.getArr());
        growthMetrics.setArrDifference(arrDifference);

        BigDecimal arrGrowthRate = calculateGrowthRate(previous.getArr(), current.getArr());
        growthMetrics.setArrGrowthRate(arrGrowthRate);
    }

    /**
     * Calculate growth rate as a percentage
     * Formula: ((current - previous) / previous) * 100
     */
    private BigDecimal calculateGrowthRate(BigDecimal previous, BigDecimal current) {
        // If previous is zero, handle specially
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            // If current is also zero, no growth
            if (current.compareTo(BigDecimal.ZERO) == 0) {
                return BigDecimal.ZERO;
            }
            // If went from 0 to positive, that's 100% growth
            // If went from 0 to negative, that's -100% growth (shouldn't happen in practice)
            return current.compareTo(BigDecimal.ZERO) > 0
                    ? BigDecimal.valueOf(100.0)
                    : BigDecimal.valueOf(-100.0);
        }

        // Normal calculation: ((current - previous) / previous) * 100
        BigDecimal difference = current.subtract(previous);
        return difference.divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Determine overall growth trend based on key metrics
     */
    private GrowthTrend determineGrowthTrend(GrowthMetrics growthMetrics) {
        // Use average of all growth rates to determine trend
        BigDecimal totalGrowthRate = BigDecimal.ZERO;
        int count = 0;

        // Consider gross revenue growth
        if (growthMetrics.getGrossRevenueGrowthRate() != null) {
            totalGrowthRate = totalGrowthRate.add(growthMetrics.getGrossRevenueGrowthRate());
            count++;
        }

        // Consider net revenue growth
        if (growthMetrics.getNetRevenueGrowthRate() != null) {
            totalGrowthRate = totalGrowthRate.add(growthMetrics.getNetRevenueGrowthRate());
            count++;
        }

        // Consider MRR growth
        if (growthMetrics.getMrrGrowthRate() != null) {
            totalGrowthRate = totalGrowthRate.add(growthMetrics.getMrrGrowthRate());
            count++;
        }

        // If no growth rates available, return STABLE
        if (count == 0) {
            return GrowthTrend.STABLE;
        }

        // Calculate average growth rate
        BigDecimal averageGrowthRate = totalGrowthRate.divide(
                BigDecimal.valueOf(count),
                2,
                RoundingMode.HALF_UP
        );

        // Determine trend based on average
        if (averageGrowthRate.compareTo(STABLE_THRESHOLD) > 0) {
            return GrowthTrend.GROWING;  // More than +5% growth
        } else if (averageGrowthRate.compareTo(STABLE_THRESHOLD.negate()) < 0) {
            return GrowthTrend.DECLINING;  // More than -5% decline
        } else {
            return GrowthTrend.STABLE;  // Between -5% and +5%
        }
    }
}