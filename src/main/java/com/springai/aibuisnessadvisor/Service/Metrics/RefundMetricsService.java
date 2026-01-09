package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.RefundMetrics;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.net.RequestOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.Instant;

public interface RefundMetricsService {
    RefundMetrics computeRefundMetrics(Long businessId,
                                Instant start,
                                Instant end,
                                PlatformType platformType);

}