package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.SubscriptionMetrics;
import org.springframework.stereotype.Service;

import java.time.Instant;
@Service
public interface SubscriptionMetricsService {
    SubscriptionMetrics computeSubscriptionMetrics(Long businessId, Instant start, Instant end, PlatformType platformType);


}
