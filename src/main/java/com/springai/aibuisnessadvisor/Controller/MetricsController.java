package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.*;
import com.springai.aibuisnessadvisor.Service.ClerkUserService;
import com.springai.aibuisnessadvisor.Service.Metrics.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
public class MetricsController {

    @Autowired private CustomerMetricsService customerMetricsService;
    @Autowired private RevenueMetricsService revenueMetricsService;
    @Autowired private RefundMetricsService refundMetricsService;
    @Autowired private SubscriptionMetricsService subscriptionMetricsService;
    @Autowired private InvoiceMetricsService invoiceMetricsService;
    @Autowired private ClerkUserService clerkUserService;

    private static final Map<String, Object> STRIPE_NOT_CONNECTED = Map.of("stripe_not_connected", true);

    private Instant resolveStart(Long weeks, Long months, Instant end) {
        if (weeks != null && months != null) throw new IllegalArgumentException("Provide either weeks OR months, not both");
        if (weeks == null && months == null) throw new IllegalArgumentException("You must provide weeks or months");
        return weeks != null
                ? end.minus(weeks * 7L, ChronoUnit.DAYS)
                : LocalDateTime.ofInstant(end, ZoneOffset.UTC).minusMonths(months).toInstant(ZoneOffset.UTC);
    }

    @GetMapping("/customersBusiness")
    public ResponseEntity<?> getCustomerMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        if (end == null) end = Instant.now();
        Instant start = resolveStart(weeks, months, end);
        if (start.isAfter(end)) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(customerMetricsService.computeCustomerMetrics(businessId, start, end, PlatformType.STRIPE));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(STRIPE_NOT_CONNECTED);
        }
    }

    @GetMapping("/revenueBusiness")
    public ResponseEntity<?> getRevenuesMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        if (end == null) end = Instant.now();
        Instant start = resolveStart(weeks, months, end);
        if (start.isAfter(end)) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(revenueMetricsService.computeRevenueMetrics(businessId, start, end, PlatformType.STRIPE));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(STRIPE_NOT_CONNECTED);
        }
    }

    @GetMapping("/refundBusiness")
    public ResponseEntity<?> getRefundMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        if (end == null) end = Instant.now();
        Instant start = resolveStart(weeks, months, end);
        if (start.isAfter(end)) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(refundMetricsService.computeRefundMetrics(businessId, start, end, PlatformType.STRIPE));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(STRIPE_NOT_CONNECTED);
        }
    }

    @GetMapping("/subscriptionBusiness")
    public ResponseEntity<?> getSubscriptionMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        if (end == null) end = Instant.now();
        Instant start = resolveStart(weeks, months, end);
        if (start.isAfter(end)) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(subscriptionMetricsService.computeSubscriptionMetrics(businessId, start, end, PlatformType.STRIPE));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(STRIPE_NOT_CONNECTED);
        }
    }

    @GetMapping("/invoiceBusiness")
    public ResponseEntity<?> getInvoiceMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        if (end == null) end = Instant.now();
        Instant start = resolveStart(weeks, months, end);
        if (start.isAfter(end)) return ResponseEntity.badRequest().build();
        try {
            return ResponseEntity.ok(invoiceMetricsService.computeInvoiceMetrics(businessId, start, end, PlatformType.STRIPE));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(STRIPE_NOT_CONNECTED);
        }
    }
}
