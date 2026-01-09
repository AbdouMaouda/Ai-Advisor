package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public interface ProductPerformanceService {
    List<ProductPerformanceService> getProductPerformanceService(Long productId, Instant startDate, Instant endDate, PlatformType platformType);
}
