package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.Repositories.BusinessMetricsRepository;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Repositories.ProductPerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MetricsOrchestratorService {

    private final BusinessMetricsRepository businessMetricsRepository;
    private final BusinessRepository businessRepository;
    private final ProductPerformanceRepository productPerformanceRepository;

    private final CustomerMetricsService customerMetricsService;
    private final RevenueMetricsService revenueMetricsService;
    private final RefundMetricsService refundMetricsService;
    private final SubscriptionMetricsService subscriptionMetricsService;
    private final InvoiceMetricsService invoiceMetricsService;
    private final ProductPerformanceService productPerformanceService;
    private final GrowthMetricsService growthMetricsService;
    private final HealthMetricsService healthMetricsService;

    /**
     * Calculate all metrics and save as a snapshot (WITH FULL DEBUG LOGGING)
     */
    @Transactional
    public BusinessMetrics calculateAndSaveAllMetrics(
            Long businessId,
            Instant start,
            Instant end,
            PlatformType platformType) {

        System.out.println("\n================ METRICS SNAPSHOT DEBUG ================");
        System.out.println("Business ID: " + businessId);
        System.out.println("Platform: " + platformType);
        System.out.println("Start Instant: " + start);
        System.out.println("End Instant: " + end);

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        LocalDate startDate = LocalDate.ofInstant(start, ZoneId.systemDefault());
        LocalDate endDate = LocalDate.ofInstant(end, ZoneId.systemDefault());

        System.out.println("Start Date (Local): " + startDate);
        System.out.println("End Date (Local): " + endDate);

        // Check if snapshot already exists
        Optional<BusinessMetrics> existing =
                businessMetricsRepository.findByBusinessAndStartDateAndEndDateAndPlatformType(
                        business, startDate, endDate, platformType
                );

        if (existing.isPresent()) {
            System.out.println(" Snapshot already exists. Reusing existing snapshot. ID: "
                    + existing.get().getId());
            return existing.get();
        }



        try {
            System.out.println("\n--- STEP 1: COMPUTING CURRENT METRICS ---");

            CustomerMetrics customerMetrics = customerMetricsService.computeCustomerMetrics(
                    businessId, start, end, platformType
            );

            RevenueMetrics revenueMetrics = revenueMetricsService.computeRevenueMetrics(
                    businessId, start, end, platformType
            );

            RefundMetrics refundMetrics = refundMetricsService.computeRefundMetrics(
                    businessId, start, end, platformType
            );

            SubscriptionMetrics subscriptionMetrics = subscriptionMetricsService.computeSubscriptionMetrics(
                    businessId, start, end, platformType
            );

            InvoiceMetrics invoiceMetrics = invoiceMetricsService.computeInvoiceMetrics(
                    businessId, start, end, platformType
            );

            List<ProductPerformance> productPerformances =
                    productPerformanceService.getProductPerformanceService(
                            businessId, start, end, platformType
                    );

            // ================= DEBUG CURRENT VALUES =================
            System.out.println("\n--- CURRENT METRICS DEBUG ---");

            if (revenueMetrics != null) {
                System.out.println("Current Gross Revenue: " + revenueMetrics.getGrossRevenue());
                System.out.println("Current Net Revenue: " + revenueMetrics.getNetRevenue());
            } else {
                System.out.println("RevenueMetrics = NULL ");
            }

            if (subscriptionMetrics != null) {
                System.out.println("Current MRR: " + subscriptionMetrics.getMrr());
                System.out.println("Current ARR: " + subscriptionMetrics.getArr());
            } else {
                System.out.println("SubscriptionMetrics = NULL ");
            }

            // ================= PREVIOUS SNAPSHOT (USING LATEST - SAFER FOR SAAS) =================
            System.out.println("\n--- STEP 2: FETCHING PREVIOUS SNAPSHOT (LATEST) ---");

            BusinessMetrics previousSnapshot =
                    getLatestSnapshot(businessId, platformType);

            if (previousSnapshot == null) {
                System.out.println(" Previous Snapshot: NULL (FIRST SNAPSHOT OR QUERY ISSUE)");
            } else {
                System.out.println(" Previous Snapshot Found!");
                System.out.println("Previous Snapshot ID: " + previousSnapshot.getId());
                System.out.println("Previous Period: "
                        + previousSnapshot.getStartDate() + " → "
                        + previousSnapshot.getEndDate());
            }

            RevenueMetrics previousRevenue =
                    previousSnapshot != null ? previousSnapshot.getRevenueMetrics() : null;

            SubscriptionMetrics previousSubscription =
                    previousSnapshot != null ? previousSnapshot.getSubscriptionMetrics() : null;

            // ================= DEBUG PREVIOUS VALUES =================
            System.out.println("\n--- PREVIOUS METRICS DEBUG ---");

            if (previousRevenue != null) {
                System.out.println("Previous Gross Revenue: " + previousRevenue.getGrossRevenue());
                System.out.println("Previous Net Revenue: " + previousRevenue.getNetRevenue());
            } else {
                System.out.println("Previous RevenueMetrics = NULL ");
            }

            if (previousSubscription != null) {
                System.out.println("Previous MRR: " + previousSubscription.getMrr());
                System.out.println("Previous ARR: " + previousSubscription.getArr());
            } else {
                System.out.println("Previous SubscriptionMetrics = NULL ️");
            }

            // ================= GROWTH METRICS =================
            System.out.println("\n--- STEP 3: COMPUTING GROWTH METRICS ---");

            GrowthMetrics growthMetrics = growthMetricsService.computeGrowthMetrics(
                    revenueMetrics,
                    previousRevenue,
                    subscriptionMetrics,
                    previousSubscription
            );

            System.out.println("\n--- GROWTH METRICS RESULT ---");
            if (growthMetrics != null) {
                System.out.println("MRR Growth Rate: " + growthMetrics.getMrrGrowthRate());
                System.out.println("ARR Growth Rate: " + growthMetrics.getArrGrowthRate());
                System.out.println("Gross Revenue Growth Rate: " + growthMetrics.getGrossRevenueGrowthRate());
                System.out.println("Net Revenue Growth Rate: " + growthMetrics.getNetRevenueGrowthRate());
                System.out.println("Growth Trend: " + growthMetrics.getGrowthTrend());
            } else {
                System.out.println("GrowthMetrics = NULL ");
            }

            // ================= HEALTH METRICS =================
            System.out.println("\n--- STEP 4: COMPUTING HEALTH METRICS ---");
            HealthMetrics healthMetrics = healthMetricsService.computeHealthMetrics(
                    customerMetrics,
                    revenueMetrics,
                    refundMetrics,
                    subscriptionMetrics,
                    growthMetrics
            );

            // ================= CREATE SNAPSHOT =================
            System.out.println("\n--- STEP 5: CREATING SNAPSHOT ENTITY ---");

            BusinessMetrics businessMetrics = new BusinessMetrics();
            businessMetrics.setBusiness(business);
            businessMetrics.setPlatformType(platformType);
            businessMetrics.setStartDate(startDate);
            businessMetrics.setEndDate(endDate);
            businessMetrics.setCollectedAt(Instant.now());

            businessMetrics.setCustomerMetrics(customerMetrics);
            businessMetrics.setRevenueMetrics(revenueMetrics);
            businessMetrics.setRefundMetrics(refundMetrics);
            businessMetrics.setSubscriptionMetrics(subscriptionMetrics);
            businessMetrics.setInvoiceMetrics(invoiceMetrics);
            businessMetrics.setGrowthMetrics(growthMetrics);
            businessMetrics.setHealthMetrics(healthMetrics);

            System.out.println("Saving BusinessMetrics snapshot to database...");

            businessMetrics = businessMetricsRepository.save(businessMetrics);

            for (ProductPerformance perf : productPerformances) {
                perf.setBusinessMetrics(businessMetrics);
            }
            productPerformanceRepository.saveAll(productPerformances);

            System.out.println("\n================ SNAPSHOT SAVED SUCCESSFULLY ================");
            System.out.println("Snapshot ID: " + businessMetrics.getId());
            System.out.println("Final Growth Trend: " + growthMetrics.getGrowthTrend());
            System.out.println("=============================================================\n");

            return businessMetrics;

        } catch (DataIntegrityViolationException e) {
            System.out.println(" DataIntegrityViolationException: Snapshot likely already exists");

            return businessMetricsRepository
                    .findByBusinessAndStartDateAndEndDateAndPlatformType(
                            business, startDate, endDate, platformType
                    )
                    .orElseThrow(() -> new RuntimeException("Failed to create or retrieve snapshot", e));
        }
    }

    /**
     * Get the latest saved snapshot for a business (CRITICAL FOR GROWTH IN MVP SAAS)
     */
    public BusinessMetrics getLatestSnapshot(Long businessId) {
        System.out.println("Fetching latest snapshot (any platform) for business: " + businessId);

        BusinessMetrics snapshot = businessMetricsRepository
                .findFirstByBusiness_IdOrderByEndDateDesc(businessId)
                .orElse(null);

        if (snapshot == null) {
            System.out.println("Latest Snapshot = NULL");
        } else {
            System.out.println("Latest Snapshot ID: " + snapshot.getId());
        }

        return snapshot;
    }

    /**
     * Get the latest snapshot by platform (USED FOR GROWTH COMPARISON)
     */
    public BusinessMetrics getLatestSnapshot(Long businessId, PlatformType platformType) {
        System.out.println("Fetching latest snapshot for business: " + businessId + " | Platform: " + platformType);

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        BusinessMetrics snapshot = businessMetricsRepository
                .findFirstByBusinessAndPlatformTypeOrderByEndDateDesc(business, platformType)
                .orElse(null);

        if (snapshot == null) {
            System.out.println("Latest Platform Snapshot = NULL ");
        } else {
            System.out.println("Latest Platform Snapshot ID: " + snapshot.getId());
            System.out.println("Latest Snapshot Period: "
                    + snapshot.getStartDate() + " → " + snapshot.getEndDate());
        }

        return snapshot;
    }

    /**
     * Get all historical snapshots for a business
     */
    public List<BusinessMetrics> getAllSnapshots(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        return businessMetricsRepository.findByBusinessOrderByEndDateDesc(business);
    }

    /**
     * Get snapshot for specific period
     */
    public BusinessMetrics getSnapshotByPeriod(Long businessId, LocalDate start, LocalDate end) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        return businessMetricsRepository
                .findByBusinessAndStartDateAndEndDate(business, start, end)
                .orElse(null);
    }
}
