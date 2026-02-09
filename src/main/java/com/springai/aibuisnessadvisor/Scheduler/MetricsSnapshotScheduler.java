package com.springai.aibuisnessadvisor.Scheduler;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Service.Metrics.MetricsOrchestratorService;
import jakarta.persistence.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Component
public class MetricsSnapshotScheduler {


    private final BusinessRepository businessRepository;
    private final MetricsOrchestratorService metricsOrchestratorService;

    public MetricsSnapshotScheduler(
            BusinessRepository businessRepository,
            MetricsOrchestratorService metricsOrchestratorService
    ) {
        this.businessRepository = businessRepository;
        this.metricsOrchestratorService = metricsOrchestratorService;
    }

    @Scheduled(cron = "0 * * * * *", zone = "UTC")


    public void saveDailyMetrics(){

        List<Business> businesses = businessRepository.findAllByisActiveTrue();

        LocalDate targetDay = LocalDate.now(ZoneOffset.UTC).minusDays(1);
        System.out.println("SCHEDULER RAN AT " + Instant.now());

        Instant start = targetDay
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        Instant end = targetDay
                .plusDays(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        for (Business business : businesses) {
            Long businessId=business.getId();
            metricsOrchestratorService.calculateAndSaveAllMetrics(
                    businessId, start, end, PlatformType.STRIPE
            );

        }

    }
}
