package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

@Service
public class HealthMetricsServiceImpl implements HealthMetricsService {

    @Override
    public HealthMetrics computeHealthMetrics(
            CustomerMetrics customerMetrics,
            RevenueMetrics revenueMetrics,
            RefundMetrics refundMetrics,
            SubscriptionMetrics subscriptionMetrics,
            GrowthMetrics growthMetrics) {

        HealthMetrics health = new HealthMetrics();

        // Calculate individual component scores (0-100 each)
        BigDecimal customerScore = calculateCustomerScore(customerMetrics);
        BigDecimal revenueScore = calculateRevenueScore(revenueMetrics);
        BigDecimal refundScore = calculateRefundScore(refundMetrics);
        BigDecimal subscriptionScore = calculateSubscriptionScore(subscriptionMetrics);
        BigDecimal growthScore = calculateGrowthScore(growthMetrics);

        // Calculate weighted overall health score
        // Weights: Customer(20%), Revenue(25%), Refund(15%), Subscription(25%), Growth(15%)
        BigDecimal overallScore = customerScore.multiply(BigDecimal.valueOf(0.20))
                .add(revenueScore.multiply(BigDecimal.valueOf(0.25)))
                .add(refundScore.multiply(BigDecimal.valueOf(0.15)))
                .add(subscriptionScore.multiply(BigDecimal.valueOf(0.25)))
                .add(growthScore.multiply(BigDecimal.valueOf(0.15)));

        // Set score and status
        health.setHealthScore(overallScore.setScale(2, RoundingMode.HALF_UP));
        health.setHealthStatus(determineHealthStatus(overallScore));

        // Leave empty for AI to populate later
        health.setStrengths(new ArrayList<>());
        health.setWarnings(new ArrayList<>());
        health.setRecommendations(new ArrayList<>());

        return health;
    }

    /**
     * Calculate customer health score (0-100)
     * Based on: active ratio, churn rate, customer growth
     */
    private BigDecimal calculateCustomerScore(CustomerMetrics metrics) {
        if (metrics.getTotalCustomers() == null || metrics.getTotalCustomers() == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal score = BigDecimal.valueOf(50); // Start at middle

        long total = metrics.getTotalCustomers();
        long active = metrics.getActiveCustomers() != null ? metrics.getActiveCustomers() : 0;
        long churned = metrics.getChurnedCustomers() != null ? metrics.getChurnedCustomers() : 0;

        // Active customer ratio (worth up to 30 points)
        double activeRatio = (double) active / total;
        if (activeRatio >= 0.9) {
            score = score.add(BigDecimal.valueOf(30));
        } else if (activeRatio >= 0.8) {
            score = score.add(BigDecimal.valueOf(25));
        } else if (activeRatio >= 0.7) {
            score = score.add(BigDecimal.valueOf(20));
        } else if (activeRatio >= 0.6) {
            score = score.add(BigDecimal.valueOf(15));
        } else if (activeRatio >= 0.5) {
            score = score.add(BigDecimal.valueOf(10));
        } else {
            score = score.subtract(BigDecimal.valueOf(20)); // Below 50% is bad
        }

        // Churn rate (worth up to 20 points)
        double churnRate = (double) churned / total;
        if (churnRate <= 0.05) {
            score = score.add(BigDecimal.valueOf(20)); // Excellent churn
        } else if (churnRate <= 0.10) {
            score = score.add(BigDecimal.valueOf(15)); // Good churn
        } else if (churnRate <= 0.15) {
            score = score.add(BigDecimal.valueOf(10)); // Acceptable churn
        } else if (churnRate <= 0.20) {
            score = score.add(BigDecimal.valueOf(5)); // Concerning churn
        } else {
            score = score.subtract(BigDecimal.valueOf(20)); // High churn
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100));
    }

    /**
     * Calculate revenue health score (0-100)
     * Based on: net vs gross ratio, revenue generation
     */
    private BigDecimal calculateRevenueScore(RevenueMetrics metrics) {
        if (metrics.getGrossRevenue() == null ||
                metrics.getGrossRevenue().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal score = BigDecimal.valueOf(50);

        // Net revenue ratio (worth up to 40 points)
        BigDecimal netRatio = metrics.getNetRevenue()
                .divide(metrics.getGrossRevenue(), 4, RoundingMode.HALF_UP);

        if (netRatio.compareTo(BigDecimal.valueOf(0.95)) >= 0) {
            score = score.add(BigDecimal.valueOf(40)); // Excellent retention
        } else if (netRatio.compareTo(BigDecimal.valueOf(0.90)) >= 0) {
            score = score.add(BigDecimal.valueOf(30));
        } else if (netRatio.compareTo(BigDecimal.valueOf(0.85)) >= 0) {
            score = score.add(BigDecimal.valueOf(20));
        } else if (netRatio.compareTo(BigDecimal.valueOf(0.75)) >= 0) {
            score = score.add(BigDecimal.valueOf(10));
        } else if (netRatio.compareTo(BigDecimal.valueOf(0.50)) >= 0) {
            score = score.add(BigDecimal.valueOf(5));
        } else {
            score = score.subtract(BigDecimal.valueOf(30)); // More than 50% lost
        }

        // Positive revenue generation (worth 10 points)
        if (metrics.getGrossRevenue().compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(BigDecimal.valueOf(10));
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100));
    }

    /**
     * Calculate refund health score (0-100)
     * Based on: refund rate
     */
    private BigDecimal calculateRefundScore(RefundMetrics metrics) {
        BigDecimal score = BigDecimal.valueOf(100); // Start at perfect

        if (metrics.getRefundRate() == null) {
            return score; // No refunds = perfect score
        }

        BigDecimal refundRate = metrics.getRefundRate();

        // Deduct points based on refund rate
        if (refundRate.compareTo(BigDecimal.valueOf(2)) <= 0) {
            // Excellent: 0-2% refund rate (keep 100 points)
        } else if (refundRate.compareTo(BigDecimal.valueOf(5)) <= 0) {
            score = score.subtract(BigDecimal.valueOf(10)); // Good: 2-5%
        } else if (refundRate.compareTo(BigDecimal.valueOf(10)) <= 0) {
            score = score.subtract(BigDecimal.valueOf(25)); // Acceptable: 5-10%
        } else if (refundRate.compareTo(BigDecimal.valueOf(15)) <= 0) {
            score = score.subtract(BigDecimal.valueOf(40)); // Concerning: 10-15%
        } else if (refundRate.compareTo(BigDecimal.valueOf(25)) <= 0) {
            score = score.subtract(BigDecimal.valueOf(60)); // Bad: 15-25%
        } else {
            score = score.subtract(BigDecimal.valueOf(80)); // Critical: >25%
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100));
    }

    /**
     * Calculate subscription health score (0-100)
     * Based on: active subscription ratio, MRR presence
     */
    private BigDecimal calculateSubscriptionScore(SubscriptionMetrics metrics) {
        if (metrics.getTotalSubscriptions() == null ||
                metrics.getTotalSubscriptions() == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal score = BigDecimal.valueOf(50);

        long total = metrics.getTotalSubscriptions();
        long active = metrics.getActiveSubscriptions() != null ? metrics.getActiveSubscriptions() : 0;

        // Active subscription ratio (worth up to 30 points)
        double activeRatio = (double) active / total;
        if (activeRatio >= 0.9) {
            score = score.add(BigDecimal.valueOf(30));
        } else if (activeRatio >= 0.8) {
            score = score.add(BigDecimal.valueOf(25));
        } else if (activeRatio >= 0.7) {
            score = score.add(BigDecimal.valueOf(20));
        } else if (activeRatio >= 0.6) {
            score = score.add(BigDecimal.valueOf(15));
        } else if (activeRatio >= 0.5) {
            score = score.add(BigDecimal.valueOf(10));
        } else {
            score = score.subtract(BigDecimal.valueOf(20));
        }

        // MRR presence (worth 20 points)
        if (metrics.getMrr() != null && metrics.getMrr().compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(BigDecimal.valueOf(20));
        } else {
            score = score.subtract(BigDecimal.valueOf(20)); // No MRR is concerning
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100));
    }

    /**
     * Calculate growth health score (0-100)
     * Based on: growth trend and growth rate
     */
    private BigDecimal calculateGrowthScore(GrowthMetrics metrics) {
        BigDecimal score = BigDecimal.valueOf(50); // Start neutral

        if (metrics.getGrowthTrend() == null) {
            return score; // No historical data = neutral score
        }

        // Growth trend (worth up to 50 points)
        switch (metrics.getGrowthTrend()) {
            case GROWING:
                // Additional points based on growth rate
                BigDecimal growthRate = metrics.getGrossRevenueGrowthRate();
                if (growthRate != null) {
                    if (growthRate.compareTo(BigDecimal.valueOf(30)) >= 0) {
                        score = score.add(BigDecimal.valueOf(50)); // Exceptional growth
                    } else if (growthRate.compareTo(BigDecimal.valueOf(20)) >= 0) {
                        score = score.add(BigDecimal.valueOf(40)); // Strong growth
                    } else if (growthRate.compareTo(BigDecimal.valueOf(10)) >= 0) {
                        score = score.add(BigDecimal.valueOf(30)); // Good growth
                    } else if (growthRate.compareTo(BigDecimal.valueOf(5)) >= 0) {
                        score = score.add(BigDecimal.valueOf(20)); // Modest growth
                    } else {
                        score = score.add(BigDecimal.valueOf(10)); // Slight growth
                    }
                } else {
                    score = score.add(BigDecimal.valueOf(20)); // Growing, but unknown rate
                }
                break;

            case STABLE:
                // No change to score (stays at 50)
                break;

            case DECLINING:
                // Deduct points based on decline rate
                BigDecimal declineRate = metrics.getGrossRevenueGrowthRate();
                if (declineRate != null) {
                    BigDecimal absDecline = declineRate.abs();
                    if (absDecline.compareTo(BigDecimal.valueOf(20)) >= 0) {
                        score = score.subtract(BigDecimal.valueOf(40)); // Severe decline
                    } else if (absDecline.compareTo(BigDecimal.valueOf(10)) >= 0) {
                        score = score.subtract(BigDecimal.valueOf(30)); // Significant decline
                    } else {
                        score = score.subtract(BigDecimal.valueOf(20)); // Moderate decline
                    }
                } else {
                    score = score.subtract(BigDecimal.valueOf(20)); // Declining, unknown rate
                }
                break;
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100));
    }

    /**
     * Determine health status based on overall score
     */
    private HealthStatus determineHealthStatus(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(80)) >= 0) {
            return HealthStatus.EXCELLENT;
        } else if (score.compareTo(BigDecimal.valueOf(60)) >= 0) {
            return HealthStatus.GOOD;
        } else if (score.compareTo(BigDecimal.valueOf(40)) >= 0) {
            return HealthStatus.FAIR;
        } else if (score.compareTo(BigDecimal.valueOf(20)) >= 0) {
            return HealthStatus.POOR;
        } else {
            return HealthStatus.CRITICAL;
        }
    }
}