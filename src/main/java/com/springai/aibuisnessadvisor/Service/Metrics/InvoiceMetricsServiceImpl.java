package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.InvoiceMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.net.RequestOptions;
import com.stripe.param.InvoiceListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceMetricsServiceImpl implements InvoiceMetricsService {
    @Value("${app.mode}")
    private String appMode;

    @Autowired
    private BusinessRepository businessRepository;

    @Override
    public InvoiceMetrics computeInvoiceMetrics(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions = buildRequestOptions(businessId);

        Long totalInvoices = countAllInvoices(requestOptions, start, end);
        Long paidInvoices = countInvoicesByStatus(requestOptions, start, end, InvoiceListParams.Status.PAID);
        Long unpaidInvoices = countInvoicesByStatus(requestOptions, start, end, InvoiceListParams.Status.OPEN);
        Long overdueInvoices = countOverdueInvoices(requestOptions, start, end);
        Long voidInvoices = countInvoicesByStatus(requestOptions, start, end, InvoiceListParams.Status.VOID);

        BigDecimal totalInvoiced = computeTotalInvoiced(requestOptions, start, end);
        BigDecimal totalPaid = computeTotalPaid(requestOptions, start, end);
        BigDecimal totalOutstanding = computeTotalOutstanding(requestOptions, start, end);

        // Calculate averages
        BigDecimal averageInvoiceValue = totalInvoices > 0
                ? totalInvoiced.divide(BigDecimal.valueOf(totalInvoices), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal averageDaysToPayment = computeAverageDaysToPayment(requestOptions, start, end);

        // Build response
        InvoiceMetrics metrics = new InvoiceMetrics();
        metrics.setTotalInvoices(totalInvoices);
        metrics.setPaidInvoices(paidInvoices);
        metrics.setUnpaidInvoices(unpaidInvoices);
        metrics.setOverdueInvoices(overdueInvoices);
        metrics.setVoidInvoices(voidInvoices);
        metrics.setTotalInvoiced(totalInvoiced);
        metrics.setTotalPaid(totalPaid);
        metrics.setTotalOutstanding(totalOutstanding);
        metrics.setAverageInvoiceValue(averageInvoiceValue);
        metrics.setAverageDaysToPayment(averageDaysToPayment);

        return metrics;
    }

    private Long countAllInvoices(RequestOptions requestOptions, Instant start, Instant end) {
        InvoiceListParams params = InvoiceListParams.builder()
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
            throw new RuntimeException("Failed to count all invoices", e);
        }
    }

    private Long countInvoicesByStatus(RequestOptions requestOptions, Instant start, Instant end, InvoiceListParams.Status status) {
        InvoiceListParams params = InvoiceListParams.builder()
                .setStatus(status)
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
            throw new RuntimeException("Failed to count invoices by status: " + status, e);
        }
    }

    private Long countOverdueInvoices(RequestOptions requestOptions, Instant start, Instant end) {
        InvoiceListParams params = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.OPEN)  // Unpaid invoices
                .setCreated(
                        InvoiceListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        long count = 0;
        long nowSeconds = Instant.now().getEpochSecond();

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                // Check if invoice is past due date
                if (invoice.getDueDate() != null && invoice.getDueDate() < nowSeconds) {
                    count++;
                }
            }
            return count;

        } catch (StripeException e) {
            throw new RuntimeException("Failed to count overdue invoices", e);
        }
    }

    private BigDecimal computeTotalInvoiced(RequestOptions requestOptions, Instant start, Instant end) {
        InvoiceListParams params = InvoiceListParams.builder()
                .setCreated(InvoiceListParams.Created.builder()
                        .setGte(start.getEpochSecond())
                        .setLte(end.getEpochSecond())
                        .build()
                )
                .setLimit(100L)
                .build();
        BigDecimal totalInvoiced = BigDecimal.ZERO;

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                if (invoice.getAmountDue() != null) {
                    BigDecimal amount = BigDecimal.valueOf(invoice.getAmountDue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    totalInvoiced = totalInvoiced.add(amount);
                }
            }
            return totalInvoiced;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    private BigDecimal computeTotalPaid(RequestOptions requestOptions, Instant start, Instant end) {
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

        BigDecimal totalPaid = BigDecimal.ZERO;

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                if (invoice.getAmountDue() != null) {
                    BigDecimal amount = BigDecimal.valueOf(invoice.getAmountDue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    totalPaid = totalPaid.add(amount);
                }
            }
            return totalPaid;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }


    }

    private BigDecimal computeAverageDaysToPayment(RequestOptions requestOptions, Instant start, Instant end) {
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

        List<Long> daysToPaymentList = new ArrayList<>();

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                Long created = invoice.getCreated();
                Long statusTransitions = invoice.getStatusTransitions() != null
                        ? invoice.getStatusTransitions().getPaidAt()
                        : null;

                if (created != null && statusTransitions != null) {
                    // Calculate days between creation and payment
                    long secondsDiff = statusTransitions - created;
                    long daysDiff = secondsDiff / 86400;  // 86400 seconds in a day
                    daysToPaymentList.add(daysDiff);
                }
            }

            // Calculate average
            if (daysToPaymentList.isEmpty()) {
                return BigDecimal.ZERO;
            }

            long totalDays = daysToPaymentList.stream()
                    .mapToLong(Long::longValue)
                    .sum();

            return BigDecimal.valueOf(totalDays)
                    .divide(BigDecimal.valueOf(daysToPaymentList.size()), 2, RoundingMode.HALF_UP);

        } catch (StripeException e) {
            throw new RuntimeException("Failed to compute average days to payment", e);
        }
    }

    private BigDecimal computeTotalOutstanding(RequestOptions requestOptions, Instant start, Instant end) {
        InvoiceListParams params = InvoiceListParams.builder()
                .setStatus(InvoiceListParams.Status.OPEN)  // Unpaid invoices
                .setCreated(
                        InvoiceListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        BigDecimal totalOutstanding = BigDecimal.ZERO;

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                if (invoice.getAmountDue() != null) {
                    BigDecimal amount = BigDecimal.valueOf(invoice.getAmountDue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    totalOutstanding = totalOutstanding.add(amount);
                }
            }
            return totalOutstanding;
        } catch (StripeException e) {
            throw new RuntimeException(e);
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
