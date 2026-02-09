package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.ProductPerformance;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public interface ProductPerformanceService {
    List<ProductPerformance> getProductPerformanceService(Long productId, Instant startDate, Instant endDate, PlatformType platformType);
}
