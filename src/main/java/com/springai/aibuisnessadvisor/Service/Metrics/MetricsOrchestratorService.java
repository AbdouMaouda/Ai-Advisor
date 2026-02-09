package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.Repositories.BusinessMetricsRepository;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Repositories.ProductPerformanceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
         * Calculate all metrics and save as a snapshot
         */
        @Transactional
        public BusinessMetrics calculateAndSaveAllMetrics(
                Long businessId,
                Instant start,
                Instant end,
                PlatformType platformType) {

            System.out.println("=== Calculating Metrics Snapshot ===");
            System.out.println("Business ID: " + businessId);
            System.out.println("Period: " + start + " to " + end);

            Business business = businessRepository.findById(businessId)
                    .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

            LocalDate startDate=LocalDate.ofInstant(start, ZoneId.systemDefault());
            LocalDate endDate=LocalDate.ofInstant(end, ZoneId.systemDefault());

            Optional<BusinessMetrics> existing =businessMetricsRepository.findByBusinessAndStartDateAndEndDateAndPlatformType(
                    business, startDate, endDate, platformType
            );
            if (existing.isPresent()) {
                return existing.get();
            }

            // Calculate current period metrics
try{
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

            List<ProductPerformance> productPerformances = productPerformanceService.getProductPerformanceService(
                    businessId, start, end, platformType
            );

            // Get previous period metrics for growth calculation
            BusinessMetrics previousSnapshot = getPreviousSnapshot(business, start, end,platformType);

            RevenueMetrics previousRevenue = previousSnapshot != null
                    ? previousSnapshot.getRevenueMetrics()
                    : null;

            SubscriptionMetrics previousSubscription = previousSnapshot != null
                    ? previousSnapshot.getSubscriptionMetrics()
                    : null;

            // Calculate growth metrics
            GrowthMetrics growthMetrics = growthMetricsService.computeGrowthMetrics(
                    revenueMetrics,
                    previousRevenue,
                    subscriptionMetrics,
                    previousSubscription
            );

            HealthMetrics healthMetrics=healthMetricsService.computeHealthMetrics(customerMetrics,revenueMetrics,refundMetrics,subscriptionMetrics,growthMetrics);

            // Create BusinessMetrics snapshot
            BusinessMetrics businessMetrics = new BusinessMetrics();
            businessMetrics.setBusiness(business);
            businessMetrics.setPlatformType(platformType);
            businessMetrics.setStartDate(LocalDate.ofInstant(start, ZoneId.systemDefault()));
            businessMetrics.setEndDate(LocalDate.ofInstant(end, ZoneId.systemDefault()));
            businessMetrics.setCollectedAt(Instant.now());

            businessMetrics.setCustomerMetrics(customerMetrics);
            businessMetrics.setRevenueMetrics(revenueMetrics);
            businessMetrics.setRefundMetrics(refundMetrics);
            businessMetrics.setSubscriptionMetrics(subscriptionMetrics);
            businessMetrics.setInvoiceMetrics(invoiceMetrics);
            businessMetrics.setGrowthMetrics(growthMetrics);
            businessMetrics.setHealthMetrics(healthMetrics);

            // Save BusinessMetrics first
            businessMetrics = businessMetricsRepository.save(businessMetrics);

            // Link and save ProductPerformances
            for (ProductPerformance perf : productPerformances) {
                perf.setBusinessMetrics(businessMetrics);
            }
            productPerformanceRepository.saveAll(productPerformances);

            System.out.println("=== Snapshot Saved Successfully ===");
            System.out.println("Snapshot ID: " + businessMetrics.getId());
            System.out.println("Growth Trend: " + growthMetrics.getGrowthTrend());

            return businessMetrics;
        }catch (DataIntegrityViolationException e){
    System.out.println("SnapShot already exists");

    return businessMetricsRepository
            .findByBusinessAndStartDateAndEndDateAndPlatformType(
                    business, startDate, endDate, platformType
            )
            .orElseThrow(() -> new RuntimeException("Failed to create or retrieve snapshot", e));

}
        }

        /**
         * Get the previous snapshot for comparison
         * Looks for a snapshot that ended just before the current period starts
         */
        private BusinessMetrics getPreviousSnapshot(Business business, Instant currentStart, Instant currentEnd,PlatformType platformType) {
            // Calculate period length

            // Look for snapshot that ended around when current period started
            LocalDate currentStartDate = LocalDate.ofInstant(currentStart, ZoneId.systemDefault());

            // Find snapshot that ended close to this date
            List<BusinessMetrics> snapshots = businessMetricsRepository
                    .findByBusinessOrderByEndDateDesc(business);

            return snapshots.stream()
                    .filter(s -> s.getPlatformType() == platformType)
                    .filter(s -> s.getEndDate().isBefore(currentStartDate))
                    .findFirst()
                    .orElse(null);
//


//            // Return the most recent snapshot before current period
//            return snapshots.stream()
//                    .filter(s -> s.getEndDate().isBefore(currentStartDate) || s.getEndDate().isEqual(previousEndDate))
//                    .findFirst()
//                    .orElse(null);
        }

        /**
         * Get the latest saved snapshot for a business
         */
        public BusinessMetrics getLatestSnapshot(Long businessId) {

            return businessMetricsRepository
                    .findFirstByBusiness_IdOrderByEndDateDesc(businessId)
                    .orElse(null);
        }

        /**
         * Get the latest snapshot by platform
         */
        public BusinessMetrics getLatestSnapshot(Long businessId, PlatformType platformType) {
            Business business = businessRepository.findById(businessId)
                    .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

            return businessMetricsRepository
                    .findFirstByBusinessAndPlatformTypeOrderByEndDateDesc(business, platformType)
                    .orElse(null);
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