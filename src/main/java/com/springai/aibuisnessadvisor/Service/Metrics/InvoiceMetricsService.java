package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.InvoiceMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import org.springframework.stereotype.Service;

import java.time.Instant;
@Service
public interface InvoiceMetricsService {
    InvoiceMetrics computeInvoiceMetrics(Long businessId,
                                         Instant start,
                                         Instant end,
                                         PlatformType platformType);











}
