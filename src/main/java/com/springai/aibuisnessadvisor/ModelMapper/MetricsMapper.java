package com.springai.aibuisnessadvisor.ModelMapper;

import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.ModelDTO.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MetricsMapper {

    // =========================
    // BUSINESS
    // =========================
    public BusinessDTO toBusinessDTO(Business entity) {
        if (entity == null) return null;

        BusinessDTO dto = new BusinessDTO();
        dto.setId(entity.getId());
        dto.setBusinessName(entity.getBusinessName());
        dto.setEmail(entity.getEmail());
        dto.setCountry(entity.getCountry());
        dto.setPrimaryCurrency(entity.getPrimaryCurrency());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setPlatformAccounts(entity.getPlatformAccounts());

        return dto;
    }

    // =========================
    // MAIN SNAPSHOT (CORE OF YOUR APP)
    // =========================
    public BusinessMetricsDTO toBusinessMetricsDTO(BusinessMetrics entity) {
        if (entity == null) return null;

        BusinessMetricsDTO dto = new BusinessMetricsDTO();
        dto.setId(entity.getId());
        dto.setBusinessId(entity.getBusiness().getId());
        dto.setPlatformType(entity.getPlatformType());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setCollectedAt(entity.getCollectedAt());

        // Embedded metrics mapping
        dto.setCustomer(toCustomerMetricsDTO(entity.getCustomerMetrics()));
        dto.setRevenue(toRevenueMetricsDTO(entity.getRevenueMetrics()));
        dto.setRefunds(toRefundMetricsDTO(entity.getRefundMetrics()));
        dto.setSubscriptions(toSubscriptionMetricsDTO(entity.getSubscriptionMetrics()));
        dto.setInvoices(toInvoiceMetricsDTO(entity.getInvoiceMetrics()));
        dto.setGrowth(toGrowthMetricsDTO(entity.getGrowthMetrics()));
        dto.setHealth(toHealthMetricsDTO(entity.getHealthMetrics()));

        return dto;
    }

    public List<BusinessMetricsDTO> toBusinessMetricsDTOList(List<BusinessMetrics> entities) {
        if (entities == null) return List.of();
        return entities.stream()
                .map(this::toBusinessMetricsDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // CUSTOMER METRICS
    // =========================
    public CustomerMetricsDTO toCustomerMetricsDTO(CustomerMetrics entity) {
        if (entity == null) return null;

        CustomerMetricsDTO dto = new CustomerMetricsDTO();
        dto.setTotalCustomers(entity.getTotalCustomers());
        dto.setActiveCustomers(entity.getActiveCustomers());
        dto.setNewCustomers(entity.getNewCustomers());
        dto.setChurnedCustomers(entity.getChurnedCustomers());

        return dto;
    }

    // =========================
    // REVENUE METRICS
    // =========================
    public RevenueMetricsDTO toRevenueMetricsDTO(RevenueMetrics entity) {
        if (entity == null) return null;

        RevenueMetricsDTO dto = new RevenueMetricsDTO();
        dto.setGrossRevenue(entity.getGrossRevenue());
        dto.setNetRevenue(entity.getNetRevenue());
        dto.setRefundedAmount(entity.getRefundedAmount());
        dto.setSuccessfulCharges(entity.getSuccessfulCharges());
        dto.setFailedCharges(entity.getFailedCharges());
        dto.setAverageTransactionValue(entity.getAverageTransactionValue());
        dto.setAverageDailyRevenue(entity.getAverageDailyRevenue());

        return dto;
    }

    // =========================
    // REFUND METRICS
    // =========================
    public RefundMetricsDTO toRefundMetricsDTO(RefundMetrics entity) {
        if (entity == null) return null;

        RefundMetricsDTO dto = new RefundMetricsDTO();
        dto.setTotalRefunds(entity.getTotalRefunds());
        dto.setTotalRefundAmount(entity.getTotalRefundAmount());
        dto.setPartialRefunds(entity.getPartialRefunds());
        dto.setFullRefunds(entity.getFullRefunds());
        dto.setAverageRefundAmount(entity.getAverageRefundAmount());
        dto.setRefundRate(entity.getRefundRate());

        return dto;
    }

    // =========================
    // SUBSCRIPTION METRICS
    // =========================
    public SubscriptionMetricsDTO toSubscriptionMetricsDTO(SubscriptionMetrics entity) {
        if (entity == null) return null;

        SubscriptionMetricsDTO dto = new SubscriptionMetricsDTO();
        dto.setTotalSubscriptions(entity.getTotalSubscriptions());
        dto.setActiveSubscriptions(entity.getActiveSubscriptions());
        dto.setTrialingSubscriptions(entity.getTrialingSubscriptions());
        dto.setPausedSubscriptions(entity.getPausedSubscriptions());
        dto.setNewSubscriptions(entity.getNewSubscriptions());
        dto.setCanceledSubscriptions(entity.getCanceledSubscriptions());
        dto.setUpgrades(entity.getUpgrades());
        dto.setDowngrades(entity.getDowngrades());
        dto.setMrr(entity.getMrr());
        dto.setArr(entity.getArr());
        dto.setAverageRevenuePerSubscription(entity.getAverageRevenuePerSubscription());

        return dto;
    }

    // =========================
    // INVOICE METRICS
    // =========================
    public InvoiceMetricsDTO toInvoiceMetricsDTO(InvoiceMetrics entity) {
        if (entity == null) return null;

        InvoiceMetricsDTO dto = new InvoiceMetricsDTO();
        dto.setTotalInvoices(entity.getTotalInvoices());
        dto.setPaidInvoices(entity.getPaidInvoices());
        dto.setUnpaidInvoices(entity.getUnpaidInvoices());
        dto.setOverdueInvoices(entity.getOverdueInvoices());
        dto.setVoidInvoices(entity.getVoidInvoices());
        dto.setTotalInvoiced(entity.getTotalInvoiced());
        dto.setTotalPaid(entity.getTotalPaid());
        dto.setTotalOutstanding(entity.getTotalOutstanding());
        dto.setAverageInvoiceValue(entity.getAverageInvoiceValue());
        dto.setAverageDaysToPayment(entity.getAverageDaysToPayment());

        return dto;
    }

    // =========================
    // HEALTH METRICS (AI CRITICAL)
    // =========================
    public HealthMetricsDTO toHealthMetricsDTO(HealthMetrics entity) {
        if (entity == null) return null;

        HealthMetricsDTO dto = new HealthMetricsDTO();
        dto.setHealthScore(entity.getHealthScore());
        dto.setHealthStatus(entity.getHealthStatus());
        dto.setStrengths(entity.getStrengths());
        dto.setWarnings(entity.getWarnings());
        dto.setRecommendations(entity.getRecommendations());

        return dto;
    }

    // =========================
    // GROWTH METRICS
    // =========================
    public GrowthMetricsDTO toGrowthMetricsDTO(GrowthMetrics entity) {
        if (entity == null) {
            return null;
        }

        GrowthMetricsDTO dto = new GrowthMetricsDTO();

        //  Growth rates (direct mapping)
        dto.setMrrGrowthRate(entity.getMrrGrowthRate());
        dto.setArrGrowthRate(entity.getArrGrowthRate());

        //  Growth trend enum
        dto.setGrowthTrend(entity.getGrowthTrend());

        //  Current vs Previous values
        // (Only if your entity contains them)
        dto.setPreviousMrr(entity.getPreviousMrr());

        dto.setPreviousArr(entity.getPreviousArr());

//        dto.setCurrentRevenue(entity.getCurrentRevenue());
//        dto.setPreviousRevenue(entity.getPreviousRevenue());
//
//        // Business / AI summary (smart layer)
//        dto.setGrowthSummary(buildGrowthSummary(entity));

        return dto;
    }


    // =========================
    // PRODUCT PERFORMANCE
    // =========================
    public ProductPerformanceDTO toProductPerformanceDTO(ProductPerformance entity) {
        if (entity == null) return null;

        ProductPerformanceDTO dto = new ProductPerformanceDTO();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProductId());
        dto.setProductName(entity.getProductName());
        dto.setProductDescription(entity.getProductDescription());
        dto.setRevenue(entity.getRevenue());
        dto.setQuantity(entity.getQuantity());
        dto.setAveragePricePerUnit(entity.getAveragePricePerUnit());
        dto.setRevenueGrowth(entity.getRevenueGrowth());
        dto.setNumberOfCustomers(entity.getNumberOfCustomers());

        return dto;
    }

    public List<ProductPerformanceDTO> toProductPerformanceDTOList(List<ProductPerformance> entities) {
        if (entities == null) return List.of();
        return entities.stream()
                .map(this::toProductPerformanceDTO)
                .collect(Collectors.toList());
    }
}
