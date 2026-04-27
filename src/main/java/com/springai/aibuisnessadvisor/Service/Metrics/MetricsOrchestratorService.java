package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.ModelDTO.BusinessMetricsForAi;
import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.ModelDTO.HealthInsights;
import com.springai.aibuisnessadvisor.Repositories.BusinessMetricsRepository;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Repositories.ProductPerformanceRepository;
import com.springai.aibuisnessadvisor.Service.AI.AIInsightsService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    private final AIInsightsService aiInsightsService;
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

            BusinessMetricsForAi metricsForAI = buildMetricsForAI(
                    customerMetrics,
                    revenueMetrics,
                    refundMetrics,
                    subscriptionMetrics,
                    invoiceMetrics,
                    growthMetrics,
                    healthMetrics,
                    previousSnapshot
            );

            try {
                HealthInsights insights = aiInsightsService.AIInsights(metricsForAI, businessId);

                healthMetrics.setStrengths(insights.getStrengths());
                healthMetrics.setWarnings(insights.getWarnings());
                healthMetrics.setRecommendations(insights.getRecommendations());

                System.out.println(" AI Insights:");
                System.out.println("   Strengths: " + insights.getStrengths().size());
                System.out.println("   Warnings: " + insights.getWarnings().size());
                System.out.println("   Recommendations: " + insights.getRecommendations().size());

            } catch (Exception e) {
                System.err.println(" AI insights generation failed: " + e.getMessage());
                e.printStackTrace();
                // Don't fail entire snapshot if AI fails
            }

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
     * Returns the snapshot with the highest health score for this business.
     */
    public BusinessMetrics getLatestSnapshot(Long businessId) {
        System.out.println("Fetching highest-health-score snapshot for business: " + businessId);

        BusinessMetrics snapshot = businessMetricsRepository
                .findTopByHealthScore(businessId, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElse(null);

        if (snapshot == null) {
            System.out.println("No snapshot found for business: " + businessId);
        } else {
            System.out.println("Snapshot ID: " + snapshot.getId()
                    + " | healthScore: " + snapshot.getHealthMetrics().getHealthScore());
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


    /**
     * Extract and calculate metrics for AI analysis
     * This does NOT recalculate - just copies and derives simple values
     */
    private BusinessMetricsForAi buildMetricsForAI(
            CustomerMetrics customerMetrics,
            RevenueMetrics revenueMetrics,
            RefundMetrics refundMetrics,
            SubscriptionMetrics subscriptionMetrics,
            InvoiceMetrics invoiceMetrics,
            GrowthMetrics growthMetrics,
            HealthMetrics healthMetrics,
            BusinessMetrics previousSnapshot) {

        System.out.println("Building BusinessMetricsForAI DTO...");

        // Extract previous period data (if exists)
        SubscriptionMetrics prevSub = previousSnapshot != null
                ? previousSnapshot.getSubscriptionMetrics()
                : null;
        CustomerMetrics prevCust = previousSnapshot != null
                ? previousSnapshot.getCustomerMetrics()
                : null;
        RevenueMetrics prevRev = previousSnapshot != null
                ? previousSnapshot.getRevenueMetrics()
                : null;

        // ========== CALCULATE DERIVED VALUES ==========

        // Net revenue ratio
        BigDecimal netRevenueRatio = BigDecimal.ZERO;
        if (revenueMetrics.getGrossRevenue() != null &&
                revenueMetrics.getGrossRevenue().compareTo(BigDecimal.ZERO) > 0) {
            netRevenueRatio = revenueMetrics.getNetRevenue()
                    .divide(revenueMetrics.getGrossRevenue(), 4, RoundingMode.HALF_UP);
        }

        // Churn rate
        double churnRate = 0.0;
        if (customerMetrics.getTotalCustomers() != null && customerMetrics.getTotalCustomers() > 0) {
            long churned = customerMetrics.getChurnedCustomers() != null
                    ? customerMetrics.getChurnedCustomers()
                    : 0;
            churnRate = (churned / (double) customerMetrics.getTotalCustomers()) * 100.0;
        }

        // Active customer ratio
        double activeCustomerRatio = 0.0;
        if (customerMetrics.getTotalCustomers() != null && customerMetrics.getTotalCustomers() > 0) {
            long active = customerMetrics.getActiveCustomers() != null
                    ? customerMetrics.getActiveCustomers()
                    : 0;
            activeCustomerRatio = (double) active / customerMetrics.getTotalCustomers();
        }

        // Active subscription ratio
        double activeSubscriptionRatio = 0.0;
        if (subscriptionMetrics.getTotalSubscriptions() != null && subscriptionMetrics.getTotalSubscriptions() > 0) {
            long active = subscriptionMetrics.getActiveSubscriptions() != null
                    ? subscriptionMetrics.getActiveSubscriptions()
                    : 0;
            activeSubscriptionRatio = (double) active / subscriptionMetrics.getTotalSubscriptions();
        }

        // Customer growth (absolute count)
        Long customerGrowth = null;
        if (prevCust != null && prevCust.getActiveCustomers() != null &&
                customerMetrics.getActiveCustomers() != null) {
            customerGrowth = customerMetrics.getActiveCustomers() - prevCust.getActiveCustomers();
        }

        // Customer growth rate (percentage)
        Double customerGrowthRate = null;
        if (prevCust != null && prevCust.getActiveCustomers() != null && prevCust.getActiveCustomers() > 0) {
            long current = customerMetrics.getActiveCustomers() != null
                    ? customerMetrics.getActiveCustomers()
                    : 0;
            customerGrowthRate = ((current - prevCust.getActiveCustomers()) / (double) prevCust.getActiveCustomers()) * 100.0;
        }

        // ARPU (Average Revenue Per User)
        BigDecimal arpu = BigDecimal.ZERO;
        if (customerMetrics.getActiveCustomers() != null && customerMetrics.getActiveCustomers() > 0 &&
                subscriptionMetrics.getMrr() != null) {
            arpu = subscriptionMetrics.getMrr().divide(
                    BigDecimal.valueOf(customerMetrics.getActiveCustomers()),
                    2,
                    RoundingMode.HALF_UP
            );
        }

        // LTV (Customer Lifetime Value)
        BigDecimal ltv = BigDecimal.ZERO;
        if (churnRate > 0) {
            double monthlyChurn = churnRate / 100.0;
            ltv = arpu.divide(BigDecimal.valueOf(monthlyChurn), 2, RoundingMode.HALF_UP);
        } else if (arpu.compareTo(BigDecimal.ZERO) > 0) {
            ltv = arpu.multiply(BigDecimal.valueOf(36)); // Assume 3 years if no churn
        }

        // CAC (Customer Acquisition Cost) - placeholder

        BigDecimal cac = BigDecimal.valueOf(100);

        // LTV/CAC Ratio
        BigDecimal ltvcacRatio = BigDecimal.ZERO;
        if (cac.compareTo(BigDecimal.ZERO) > 0 && ltv.compareTo(BigDecimal.ZERO) > 0) {
            ltvcacRatio = ltv.divide(cac, 2, RoundingMode.HALF_UP);
        }

        Double paymentSuccessRate = null;
        if (invoiceMetrics != null &&
                invoiceMetrics.getTotalInvoices() != null &&
                invoiceMetrics.getTotalInvoices() > 0) {

            long paid = invoiceMetrics.getPaidInvoices() != null ? invoiceMetrics.getPaidInvoices() : 0;
            paymentSuccessRate = (paid / (double) invoiceMetrics.getTotalInvoices()) * 100.0;
        }
        //BUILD DTO (JUST COPYING/ASSIGNING)
        return BusinessMetricsForAi.builder()
                // Revenue
                .currentGrossRevenue(revenueMetrics.getGrossRevenue())
                .previousGrossRevenue(prevRev != null ? prevRev.getGrossRevenue() : BigDecimal.ZERO)
                .grossRevenueGrowthRate(growthMetrics != null ? growthMetrics.getGrossRevenueGrowthRate() : BigDecimal.ZERO)

                .currentNetRevenue(revenueMetrics.getNetRevenue())
                .previousNetRevenue(prevRev != null ? prevRev.getNetRevenue() : BigDecimal.ZERO)
                .netRevenueGrowthRate(growthMetrics != null ? growthMetrics.getNetRevenueGrowthRate() : BigDecimal.ZERO)
                .netRevenueRatio(netRevenueRatio)

                // MRR/ARR
                .currentMrr(subscriptionMetrics.getMrr())
                .previousMrr(prevSub != null ? prevSub.getMrr() : BigDecimal.ZERO)
                .mrrGrowthRate(growthMetrics != null ? growthMetrics.getMrrGrowthRate() : BigDecimal.ZERO)

                .currentArr(subscriptionMetrics.getArr())
                .previousArr(prevSub != null ? prevSub.getArr() : BigDecimal.ZERO)
                .arrGrowthRate(growthMetrics != null ? growthMetrics.getArrGrowthRate() : BigDecimal.ZERO)

                // Customers
                .totalCustomers(customerMetrics.getTotalCustomers())
                .activeCustomers(customerMetrics.getActiveCustomers())
                .previousActiveCustomers(prevCust != null ? prevCust.getActiveCustomers() : 0L)
                .newCustomers(customerMetrics.getNewCustomers())
                .churnedCustomers(customerMetrics.getChurnedCustomers())
                .churnRate(churnRate)
                .retentionRate(100.0 - churnRate)
                .activeCustomerRatio(activeCustomerRatio)
                .customerGrowth(customerGrowth)
                .customerGrowthRate(customerGrowthRate)

                // Subscriptions
                .totalSubscriptions(subscriptionMetrics.getTotalSubscriptions())
                .activeSubscriptions(subscriptionMetrics.getActiveSubscriptions())
                .previousActiveSubscriptions(prevSub != null ? prevSub.getActiveSubscriptions() : 0L)
                .newSubscriptions(subscriptionMetrics.getNewSubscriptions())
                .cancelledSubscriptions(subscriptionMetrics.getCanceledSubscriptions())
                .activeSubscriptionRatio(activeSubscriptionRatio)
                .trialConversionRate(null) // OK if you don't have trial data

                // Financial
                .averageRevenuePerUser(arpu)
                .customerLifetimeValue(ltv)
                .customerAcquisitionCost(cac)
                .ltvcacRatio(ltvcacRatio)

                // Refunds
                .refundRate(refundMetrics.getRefundRate())
                .totalRefunds(refundMetrics.getTotalRefundAmount())
                .refundCount(refundMetrics.getTotalRefunds())

                // Invoices/Payments
                .totalInvoices(invoiceMetrics != null ? invoiceMetrics.getTotalInvoices() : null)
                .paidInvoices(invoiceMetrics != null ? invoiceMetrics.getPaidInvoices() : null)
                .pendingInvoices(invoiceMetrics != null ? invoiceMetrics.getUnpaidInvoices() : null)  // ← ADD THIS
                .overdueInvoices(invoiceMetrics != null ? invoiceMetrics.getOverdueInvoices() : null)
                .paymentSuccessRate(paymentSuccessRate)
                .averagePaymentTime(invoiceMetrics != null && invoiceMetrics.getAverageDaysToPayment() != null
                        ? invoiceMetrics.getAverageDaysToPayment().doubleValue()
                        : null)  //

                // Growth
                .growthTrend(growthMetrics != null && growthMetrics.getGrowthTrend() != null
                        ? growthMetrics.getGrowthTrend().toString()
                        : "STABLE")

                // Health Scores
                .overallHealthScore(healthMetrics.getHealthScore())
                .customerScore(null)
                .revenueScore(null)
                .subscriptionScore(null)
                .growthScore(null)
                .refundScore(null)

                // Time
                .periodStart(LocalDate.now().withDayOfMonth(1))
                .periodEnd(LocalDate.now())
                .comparisonPeriod("vs previous month")

                .build();
    }
}



