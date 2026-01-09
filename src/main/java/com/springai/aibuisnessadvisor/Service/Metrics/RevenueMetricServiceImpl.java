package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.RevenueMetrics;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
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
import java.time.temporal.ChronoUnit;

@Service
public class RevenueMetricServiceImpl implements RevenueMetricsService {


    @Value("${app.mode}")
    private String appMode;

    @Autowired
    BusinessRepository businessRepository;

    @Override
    public RevenueMetrics computeRevenueMetrics(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions = buildRequestOptions(businessId);

        BigDecimal grossRevenue = computeGrossRevenue(requestOptions, start, end);
        BigDecimal refundedAmount = computeRefundedAmount(requestOptions, start, end);
        Long successfulCharges = countPaidInvoices(requestOptions, start, end);
        Long failedCharges = countFailedInvoices(requestOptions, start, end);
        BigDecimal netRevenue = null;
        if (grossRevenue != null) {
            netRevenue = grossRevenue.subtract(refundedAmount);
        }
        BigDecimal AverageTransactionValue = BigDecimal.ZERO;
        if (grossRevenue != null) {
            AverageTransactionValue = computeAverageTransactionValue(grossRevenue, successfulCharges);

        }
        BigDecimal AverageDailyRevenue = computeAverageDailyRevenue(grossRevenue, start, end);

        RevenueMetrics metrics = new RevenueMetrics();


        metrics.setGrossRevenue(grossRevenue);
        metrics.setRefundedAmount(refundedAmount);
        metrics.setNetRevenue(netRevenue);
        metrics.setSuccessfulCharges(successfulCharges);
        metrics.setFailedCharges(failedCharges);

        metrics.setAverageTransactionValue(
                AverageTransactionValue
        );

        metrics.setAverageDailyRevenue(
                AverageDailyRevenue);

        return metrics;
    }

    private BigDecimal computeGrossRevenue(RequestOptions requestOptions, Instant start, Instant end) {


        InvoiceListParams invoiceListParams = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.PAID)
                .setCreated(
                        InvoiceListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        BigDecimal grossRevenue = BigDecimal.ZERO;

        try {
            for (Invoice invoice : Invoice.list(invoiceListParams, requestOptions).autoPagingIterable()) {
                BigDecimal amount = BigDecimal.valueOf(invoice.getAmountPaid())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                grossRevenue = grossRevenue.add(amount);
            }
            return grossRevenue;

        } catch (StripeException e) {
            throw new RuntimeException(e);
        }


    }

    private BigDecimal computeRefundedAmount(RequestOptions requestOptions, Instant start, Instant end) {

        RefundListParams refundListParams = RefundListParams.builder()
                .setCreated(
                        RefundListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        BigDecimal refundedAmount = BigDecimal.ZERO;


        try {
            for (Refund refund : Refund.list(refundListParams, requestOptions).autoPagingIterable()) {

                if (!"succeeded".equalsIgnoreCase(refund.getStatus())) {
                    continue;  // Skip failed/pending refunds
                }
                Long amountInCents = refund.getAmount();
                if (amountInCents == null) continue;

                BigDecimal amount = BigDecimal.valueOf(amountInCents)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                refundedAmount = refundedAmount.add(amount);
            }
            return refundedAmount;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    private Long countPaidInvoices(RequestOptions requestOptions, Instant start, Instant end) {

        InvoiceListParams invoiceListParams = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.PAID)
                .setCreated(InvoiceListParams.Created.builder()
                        .setGte(start.getEpochSecond())
                        .setLte(end.getEpochSecond())
                        .build())
                .setLimit(100L)
                .build();
        long count = 0;

        try {
            for (Invoice invoice : Invoice.list(invoiceListParams, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    private Long countFailedInvoices(RequestOptions requestOptions, Instant start, Instant end) {

        InvoiceListParams invoiceListParams = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.UNCOLLECTIBLE)
                .setCreated(InvoiceListParams.Created.builder()
                        .setGte(start.getEpochSecond())
                        .setLte(end.getEpochSecond())
                        .build())
                .setLimit(100L)
                .build();
        long count = 0;

        try {
            for (Invoice invoice : Invoice.list(invoiceListParams, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }

    private BigDecimal computeAverageTransactionValue(BigDecimal grossRevenue, Long successfulCharges) {
        //ATV
        //Gross Revenue/Successful charges
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
        long days = ChronoUnit.DAYS.between(start, end) + 1;

        if (days <= 0) {
            days = 1;
        }

        return grossRevenue.divide(
                BigDecimal.valueOf(days),
                2,
                RoundingMode.HALF_UP
        );
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
