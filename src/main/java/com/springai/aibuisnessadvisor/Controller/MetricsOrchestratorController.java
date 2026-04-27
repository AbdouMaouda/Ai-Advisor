package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Service.ClerkUserService;
import com.springai.aibuisnessadvisor.Service.Metrics.MetricsOrchestratorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricsOrchestratorController {

    @Autowired
    private MetricsOrchestratorService metricsOrchestratorService;
    @Autowired
    private ClerkUserService clerkUserService;

    @PostMapping("/calculate")
    public ResponseEntity<BusinessMetrics> calculateAndSaveMetrics(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));

        if (end == null) end = Instant.now();
        if (weeks != null && months != null) throw new IllegalArgumentException("Provide either weeks OR months, not both");
        if (weeks == null && months == null) throw new IllegalArgumentException("You must provide either weeks or months");

        Instant start = weeks != null
                ? end.minus(weeks * 7L, ChronoUnit.DAYS)
                : LocalDateTime.ofInstant(end, ZoneOffset.UTC).minusMonths(months).toInstant(ZoneOffset.UTC);

        BusinessMetrics snapshot = metricsOrchestratorService.calculateAndSaveAllMetrics(businessId, start, end, PlatformType.STRIPE);
        return ResponseEntity.ok(snapshot);
    }

    @GetMapping("/latest")
    public ResponseEntity<BusinessMetrics> getLatestSnapshot(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        BusinessMetrics snapshot = metricsOrchestratorService.getLatestSnapshot(businessId);
        if (snapshot == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(snapshot);
    }

    @GetMapping("/history")
    public ResponseEntity<List<BusinessMetrics>> getSnapshotHistory(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        return ResponseEntity.ok(metricsOrchestratorService.getAllSnapshots(businessId));
    }

    @GetMapping("/period")
    public ResponseEntity<BusinessMetrics> getSnapshotByPeriod(
            HttpServletRequest request,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));

        if (end == null) end = Instant.now();
        if (weeks != null && months != null) throw new IllegalArgumentException("Provide either weeks OR months, not both");
        if (weeks == null && months == null) throw new IllegalArgumentException("You must provide weeks or months");

        Instant start = weeks != null
                ? end.minus(weeks * 7L, ChronoUnit.DAYS)
                : LocalDateTime.ofInstant(end, ZoneOffset.UTC).minusMonths(months).toInstant(ZoneOffset.UTC);

        if (start.isAfter(end)) return ResponseEntity.badRequest().build();

        LocalDate startDate = LocalDate.ofInstant(start, ZoneId.systemDefault());
        LocalDate endDate = LocalDate.ofInstant(end, ZoneId.systemDefault());

        BusinessMetrics snapshot = metricsOrchestratorService.getSnapshotByPeriod(businessId, startDate, endDate);
        if (snapshot == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(snapshot);
    }
}
