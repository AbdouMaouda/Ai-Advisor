

package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.Service.Metrics.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/v1/")
public class MetricsController {

    @Autowired
    private CustomerMetricsService customerMetricsService;
    @Autowired
    private RevenueMetricsService revenueMetricsService;

    @Autowired
    private RefundMetricsService refundMetricsService;

    @Autowired
    private SubscriptionMetricsService subscriptionMetricsService;

    @Autowired
    private InvoiceMetricsService invoiceMetricsService;

    @GetMapping("/customersBusiness/{businessId}")
    public ResponseEntity<CustomerMetrics> getCustomerMetrics(
            @PathVariable Long businessId,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end


    ) {


        if (end == null) {
            end = Instant.now();
        }
        Instant start;

        if (weeks != null && months != null) {
            throw new IllegalArgumentException(
                    "Provide either weeks OR months, not both"
            );
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException(
                    "You must provide weeks or months"
            );
        }

        if (weeks != null) {
            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
        } else {
            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
                    .minusMonths(months)
                    .toInstant(ZoneOffset.UTC);
        }


        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }

        CustomerMetrics metrics =
                customerMetricsService.computeCustomerMetrics(
                        businessId,
                        start,
                        end,
                        PlatformType.STRIPE
                );

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/revenueBusiness/{businessId}")
    public ResponseEntity<RevenueMetrics> getRevenuesMetrics(
            @PathVariable Long businessId,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end

    ) {
        if (end == null) {
            end = Instant.now();
        }
        Instant start;

        if (weeks != null && months != null) {
            throw new IllegalArgumentException(
                    "Provide either weeks OR months, not both"
            );
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException(
                    "You must provide weeks or months"
            );
        }

        if (weeks != null) {
            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
        } else {
            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
                    .minusMonths(months)
                    .toInstant(ZoneOffset.UTC);
        }


        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }

        RevenueMetrics metrics =
                revenueMetricsService.computeRevenueMetrics(
                        businessId,
                        start,
                        end,
                        PlatformType.STRIPE
                );

        return ResponseEntity.ok(metrics);
    }


    @GetMapping("/refundBusiness/{businessId}")
    public ResponseEntity<RefundMetrics> getRefundMetrics(
            @PathVariable Long businessId,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end

    ) {
        if (end == null) {
            end = Instant.now();
        }
        Instant start;

        if (weeks != null && months != null) {
            throw new IllegalArgumentException(
                    "Provide either weeks OR months, not both"
            );
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException(
                    "You must provide weeks or months"
            );
        }

        if (weeks != null) {
            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
        } else {
            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
                    .minusMonths(months)
                    .toInstant(ZoneOffset.UTC);
        }


        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }

        RefundMetrics metrics =
                refundMetricsService.computeRefundMetrics(
                        businessId,
                        start,
                        end,
                        PlatformType.STRIPE
                );

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/subscriptionBusiness/{businessId}")
    public ResponseEntity<SubscriptionMetrics> getSubscriptionMetrics(@PathVariable Long businessId,
                                                                      @RequestParam(required = false) Long weeks,
                                                                      @RequestParam(required = false) Long months,
                                                                      @RequestParam(required = false) Instant end

    ) {
        if (end == null) {
            end = Instant.now();
        }
        Instant start;

        if (weeks != null && months != null) {
            throw new IllegalArgumentException(
                    "Provide either weeks OR months, not both"
            );
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException(
                    "You must provide weeks or months"
            );
        }

        if (weeks != null) {
            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
        } else {
            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
                    .minusMonths(months)
                    .toInstant(ZoneOffset.UTC);
        }


        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }

        SubscriptionMetrics metrics =
                subscriptionMetricsService.computeSubscriptionMetrics(
                        businessId,
                        start,
                        end,
                        PlatformType.STRIPE
                );

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("invoiceBusiness/{businessId}")
    public ResponseEntity<InvoiceMetrics> getInvoiceMetrics(@PathVariable Long businessId,
                                                            @RequestParam(required = false) Long weeks,
                                                            @RequestParam(required = false) Long months,
                                                            @RequestParam(required = false) Instant end

    ) {
        if (end == null) {
            end = Instant.now();
        }
        Instant start;

        if (weeks != null && months != null) {
            throw new IllegalArgumentException(
                    "Provide either weeks OR months, not both"
            );
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException(
                    "You must provide weeks or months"
            );
        }

        if (weeks != null) {
            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
        } else {
            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
                    .minusMonths(months)
                    .toInstant(ZoneOffset.UTC);
        }


        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }
        InvoiceMetrics invoiceMetrics =
                invoiceMetricsService.computeInvoiceMetrics(businessId,
                        start,
                        end,
                        PlatformType.STRIPE);

        return ResponseEntity.ok(invoiceMetrics);
    }
    }



