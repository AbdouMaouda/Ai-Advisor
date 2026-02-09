package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.GrowthMetrics;
import com.springai.aibuisnessadvisor.Model.GrowthTrend;
import com.springai.aibuisnessadvisor.Model.RevenueMetrics;
import com.springai.aibuisnessadvisor.Model.SubscriptionMetrics;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;

public interface GrowthMetricsService {

    GrowthMetrics computeGrowthMetrics(
            RevenueMetrics currentRevenue,
            RevenueMetrics previousRevenue,
            SubscriptionMetrics currentSubscription,
            SubscriptionMetrics previousSubscription
    );

}