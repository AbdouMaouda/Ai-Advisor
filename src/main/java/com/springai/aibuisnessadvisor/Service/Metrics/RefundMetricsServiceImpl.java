package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.RefundMetrics;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.BalanceTransaction;
import com.stripe.model.Charge;
import com.stripe.model.Invoice;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.param.InvoiceListParams;
import com.stripe.param.RefundListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
public class RefundMetricsServiceImpl implements RefundMetricsService {


    @Autowired
    private BusinessRepository businessRepository;

    @Value("${app.mode}")
    private String appMode;

    @Override
    public RefundMetrics computeRefundMetrics(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions = buildRequestOptions(businessId);

        // Calculate all refund metrics
        Long totalRefunds = countTotalRefunds(requestOptions, start, end);
        BigDecimal totalRefundAmount = computeTotalRefundAmount(requestOptions, start, end);
        //Skip partial and full for MVP
        BigDecimal averageRefundAmount = computeAverageRefundAmount(totalRefundAmount, totalRefunds);
        BigDecimal refundRate = computeRefundRate(requestOptions, start, end, totalRefunds);

        // Build response
        RefundMetrics metrics = new RefundMetrics();
        metrics.setTotalRefunds(totalRefunds);
        metrics.setTotalRefundAmount(totalRefundAmount);
        metrics.setAverageRefundAmount(averageRefundAmount);
        metrics.setRefundRate(refundRate);

        return metrics;
    }

    private long countTotalRefunds(RequestOptions requestOptions, Instant start, Instant end) {
        RefundListParams refundListParams = RefundListParams.builder()
                .setCreated(
                        RefundListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        long count = 0;

        try {
            for (Refund refund : Refund.list(refundListParams, requestOptions).autoPagingIterable()) {

                if (!"succeeded".equalsIgnoreCase(refund.getStatus())) continue;

                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }

    private BigDecimal computeTotalRefundAmount(RequestOptions requestOptions, Instant start, Instant end) {

        RefundListParams params = RefundListParams.builder()
                .setCreated(
                        RefundListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        try {
            for (Refund refund : Refund.list(params, requestOptions).autoPagingIterable()) {
                if (!"succeeded".equalsIgnoreCase(refund.getStatus())) continue;

                BigDecimal amount = BigDecimal.valueOf(refund.getAmount()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                totalAmount = totalAmount.add(amount);

            }
            return totalAmount;

        } catch (StripeException e) {
            throw new RuntimeException("Failed to compute total refund amount", e);
        }
    }


    //per customers
    private BigDecimal computeAverageRefundAmount(BigDecimal totalRefundAmount, Long totalRefunds) {
        if (totalRefunds == null || totalRefunds == 0) {
            return BigDecimal.ZERO;
        }

        return totalRefundAmount.divide(
                BigDecimal.valueOf(totalRefunds),
                2,
                RoundingMode.HALF_UP
        );
    }

    private BigDecimal computeRefundRate(RequestOptions requestOptions, Instant start, Instant end, Long totalRefunds) {
        // Get total paid invoices in a period
        Long paidInvoices = countPaidInvoices(requestOptions, start, end);

        if (paidInvoices == null || paidInvoices == 0) {
            return BigDecimal.ZERO;
        }

        // Refund rate = (total refunds / total paid invoices) * 100
        return BigDecimal.valueOf(totalRefunds)
                .divide(BigDecimal.valueOf(paidInvoices), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    // Helper: Count paid invoices
    private Long countPaidInvoices(RequestOptions requestOptions, Instant start, Instant end) {
        InvoiceListParams params = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.PAID)
                .setCreated(
                        InvoiceListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        long count = 0;

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;

        } catch (StripeException e) {
            throw new RuntimeException("Failed to count paid invoices", e);
        }
    }


    private RequestOptions buildRequestOptions(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        String stripeAccountId = business.getPlatformAccounts().get(PlatformType.STRIPE);

        if (stripeAccountId != null) {
            return RequestOptions.builder()
                    .setStripeAccount(stripeAccountId)
                    .build();
        } else if ("dev".equals(appMode)) {
            return RequestOptions.builder().build();  // Empty options for dev
        } else {
            throw new IllegalStateException("Stripe not connected for this business");
        }
    }


}


