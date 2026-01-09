package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.RevenueMetrics;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public interface RevenueMetricsService {
    RevenueMetrics computeRevenueMetrics(Long businessId,
                                         Instant start,
                                         Instant end,
                                         PlatformType platformType);
}
