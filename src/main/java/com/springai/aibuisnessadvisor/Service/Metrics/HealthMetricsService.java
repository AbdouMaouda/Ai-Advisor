package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.*;

public interface HealthMetricsService {

    HealthMetrics computeHealthMetrics(
            CustomerMetrics customerMetrics,
            RevenueMetrics revenueMetrics,
            RefundMetrics refundMetrics,
            SubscriptionMetrics subscriptionMetrics,
            GrowthMetrics growthMetrics);
}
