package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.RevenueMetrics;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Service.StripeRequestOptionsBuilder;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.param.InvoiceListParams;
import com.stripe.param.RefundListParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class RevenueMetricServiceImpl implements RevenueMetricsService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("America/Toronto");
    @Autowired
    private final StripeRequestOptionsBuilder stripeRequestOptionsBuilder;


    @Override
    public RevenueMetrics computeRevenueMetrics(
            Long businessId,
            Instant start,
            Instant end,
            PlatformType platformType
    ) {

        System.out.println("\n=========== STRIPE REVENUE METRICS DEBUG ===========");
        System.out.println("Business ID: " + businessId);
        System.out.println("Platform: " + platformType);
        System.out.println("Raw Start (UTC): " + start);
        System.out.println("Raw End (UTC): " + end);

        RequestOptions requestOptions = stripeRequestOptionsBuilder.createRequestOptions(businessId);

        // 🔥 Convert to BUSINESS LOCAL DAY WINDOW (fixes your main bug)
        Instant correctedStart = toBusinessStartOfDay(start);
        Instant correctedEnd = toBusinessEndOfDay(end);

        System.out.println("Corrected Start (Business TZ): " + correctedStart);
        System.out.println("Corrected End (Business TZ): " + correctedEnd);

        BigDecimal grossRevenue = computeGrossRevenue(requestOptions, correctedStart, correctedEnd);
        BigDecimal refundedAmount = computeRefundedAmount(requestOptions, correctedStart, correctedEnd);
        Long successfulCharges = countPaidInvoices(requestOptions, correctedStart, correctedEnd);
        Long failedCharges = countFailedInvoices(requestOptions, correctedStart, correctedEnd);

        BigDecimal netRevenue = grossRevenue.subtract(refundedAmount);

        BigDecimal averageTransactionValue = computeAverageTransactionValue(
                grossRevenue,
                successfulCharges
        );

        BigDecimal averageDailyRevenue = computeAverageDailyRevenue(
                grossRevenue,
                correctedStart,
                correctedEnd
        );

        RevenueMetrics metrics = new RevenueMetrics();
        metrics.setGrossRevenue(grossRevenue);
        metrics.setRefundedAmount(refundedAmount);
        metrics.setNetRevenue(netRevenue);
        metrics.setSuccessfulCharges(successfulCharges);
        metrics.setFailedCharges(failedCharges);
        metrics.setAverageTransactionValue(averageTransactionValue);
        metrics.setAverageDailyRevenue(averageDailyRevenue);

        System.out.println("\n--- FINAL REVENUE METRICS ---");
        System.out.println("Gross Revenue: " + grossRevenue);
        System.out.println("Refunded Amount: " + refundedAmount);
        System.out.println("Net Revenue: " + netRevenue);
        System.out.println("Successful Charges: " + successfulCharges);
        System.out.println("Failed Charges: " + failedCharges);
        System.out.println("=============================================\n");

        return metrics;
    }

    /**
     * 🔥 CRITICAL: Use PAID_AT instead of CREATED
     * This matches real SaaS analytics (Stripe, Baremetrics, ChartMogul)
     */
    private BigDecimal computeGrossRevenue(
            RequestOptions requestOptions,
            Instant start,
            Instant end
    ) {

        System.out.println("=== REVENUE DEBUG: FETCHING ALL INVOICES (PAID_AT FILTER) ===");

        BigDecimal grossRevenue = BigDecimal.ZERO;
        long startSec = start.getEpochSecond();
        long endSec = end.getEpochSecond();

        InvoiceListParams params = InvoiceListParams.builder()
                .setLimit(100L) // DO NOT filter by created
                .build();

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {

                System.out.println("\nInvoice ID: " + invoice.getId());
                System.out.println("Status: " + invoice.getStatus());

                if (!"paid".equalsIgnoreCase(invoice.getStatus())) {
                    System.out.println("Skipped (not paid)");
                    continue;
                }

                if (invoice.getStatusTransitions() == null ||
                        invoice.getStatusTransitions().getPaidAt() == null) {
                    System.out.println("Skipped (no paid_at timestamp)");
                    continue;
                }

                long paidAt = invoice.getStatusTransitions().getPaidAt();
                Instant paidInstant = Instant.ofEpochSecond(paidAt);

                System.out.println("PaidAt (UTC): " + paidInstant);

                // 🔥 Correct filtering (by payment time, not creation)
                if (paidAt >= startSec && paidAt <= endSec) {

                    Long amountPaid = invoice.getAmountPaid();
                    if (amountPaid == null) {
                        System.out.println("Skipped (amountPaid null)");
                        continue;
                    }

                    BigDecimal amount = BigDecimal.valueOf(amountPaid)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                    grossRevenue = grossRevenue.add(amount);

                    System.out.println("COUNTED REVENUE: " + amount);
                    System.out.println("Running Gross Revenue: " + grossRevenue);
                } else {
                    System.out.println("Skipped (outside business day window)");
                }
            }

            System.out.println("[REVENUE] FINAL GROSS REVENUE: " + grossRevenue);
            return grossRevenue.setScale(2, RoundingMode.HALF_UP);

        } catch (StripeException e) {
            throw new RuntimeException("Failed to compute gross revenue", e);
        }
    }

    private BigDecimal computeRefundedAmount(
            RequestOptions requestOptions,
            Instant start,
            Instant end
    ) {

        BigDecimal refundedAmount = BigDecimal.ZERO;
        long startSec = start.getEpochSecond();
        long endSec = end.getEpochSecond();

        RefundListParams params = RefundListParams.builder()
                .setLimit(100L)
                .build();

        try {
            for (Refund refund : Refund.list(params, requestOptions).autoPagingIterable()) {

                if (!"succeeded".equalsIgnoreCase(refund.getStatus())) {
                    continue;
                }

                if (refund.getCreated() < startSec || refund.getCreated() > endSec) {
                    continue;
                }

                Long amount = refund.getAmount();
                if (amount == null) continue;

                BigDecimal refundValue = BigDecimal.valueOf(amount)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                refundedAmount = refundedAmount.add(refundValue);
            }

            return refundedAmount.setScale(2, RoundingMode.HALF_UP);

        } catch (StripeException e) {
            throw new RuntimeException("Failed to compute refunded amount", e);
        }
    }

    private Long countPaidInvoices(
            RequestOptions requestOptions,
            Instant start,
            Instant end
    ) {
        long count = 0;
        long startSec = start.getEpochSecond();
        long endSec = end.getEpochSecond();

        try {
            for (Invoice invoice : Invoice.list(
                    InvoiceListParams.builder().setLimit(100L).build(),
                    requestOptions
            ).autoPagingIterable()) {

                if (!"paid".equalsIgnoreCase(invoice.getStatus())) continue;

                if (invoice.getStatusTransitions() == null ||
                        invoice.getStatusTransitions().getPaidAt() == null) continue;

                long paidAt = invoice.getStatusTransitions().getPaidAt();
                if (paidAt >= startSec && paidAt <= endSec) {
                    count++;
                }
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count paid invoices", e);
        }
    }

    private Long countFailedInvoices(
            RequestOptions requestOptions,
            Instant start,
            Instant end
    ) {
        long count = 0;
        long startSec = start.getEpochSecond();
        long endSec = end.getEpochSecond();

        try {
            for (Invoice invoice : Invoice.list(
                    InvoiceListParams.builder().setLimit(100L).build(),
                    requestOptions
            ).autoPagingIterable()) {

                if (!"uncollectible".equalsIgnoreCase(invoice.getStatus())) continue;

                if (invoice.getCreated() >= startSec && invoice.getCreated() <= endSec) {
                    count++;
                }
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count failed invoices", e);
        }
    }

    private BigDecimal computeAverageTransactionValue(
            BigDecimal grossRevenue,
            Long successfulCharges
    ) {
        if (successfulCharges == null || successfulCharges == 0) {
            return BigDecimal.ZERO;
        }

        return grossRevenue.divide(
                BigDecimal.valueOf(successfulCharges),
                2,
                RoundingMode.HALF_UP
        );
    }

    private BigDecimal computeAverageDailyRevenue(
            BigDecimal grossRevenue,
            Instant start,
            Instant end
    ) {
        long days = ChronoUnit.DAYS.between(start, end);
        if (days <= 0) days = 1;

        return grossRevenue.divide(
                BigDecimal.valueOf(days),
                2,
                RoundingMode.HALF_UP
        );
    }

    /**
     * Convert to start of business day (fixes UTC mismatch)
     */
    private Instant toBusinessStartOfDay(Instant instant) {
        LocalDate localDate = instant.atZone(BUSINESS_ZONE).toLocalDate();
        return localDate.atStartOfDay(BUSINESS_ZONE).toInstant();
    }

    /**
     * Convert to end of business day (23:59:59)
     */
    private Instant toBusinessEndOfDay(Instant instant) {
        LocalDate localDate = instant.atZone(BUSINESS_ZONE).toLocalDate();
        return localDate.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant();
    }

}
