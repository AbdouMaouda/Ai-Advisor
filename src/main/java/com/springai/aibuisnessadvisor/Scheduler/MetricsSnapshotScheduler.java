package com.springai.aibuisnessadvisor.Scheduler;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Service.Metrics.MetricsOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MetricsSnapshotScheduler {

    private final BusinessRepository businessRepository;
    private final MetricsOrchestratorService metricsOrchestratorService;

    /**
     * Run daily at 2 AM UTC
     */
    @Scheduled(cron = "0 0 2 * * *", zone = "UTC")
    public void createDailySnapshots() {

        System.out.println("=== SCHEDULER STARTED AT " + Instant.now() + " ===");

        List<Business> businesses = businessRepository.findAllByisActiveTrue();
        System.out.println("Found " + businesses.size() + " active businesses");

        for (Business business : businesses) {
            try {
                Instant end = Instant.now();
                Instant start = end.minus(30, ChronoUnit.DAYS);

                System.out.println("Creating snapshot for business " + business.getId());

                metricsOrchestratorService.calculateAndSaveAllMetrics(
                        business.getId(),
                        start,
                        end,
                        PlatformType.STRIPE
                );

                System.out.println(" Snapshot created successfully");

            } catch (Exception e) {
                System.err.println(" Failed for business " + business.getId() + ": " + e.getMessage());
            }
        }

        System.out.println("=== SCHEDULER COMPLETE ===");
    }
}