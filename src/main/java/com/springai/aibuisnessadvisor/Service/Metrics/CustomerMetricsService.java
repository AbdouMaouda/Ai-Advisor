package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.CustomerMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public interface CustomerMetricsService {
CustomerMetrics computeCustomerMetrics(Long businessId,Instant start,Instant end,PlatformType platformType);
}

