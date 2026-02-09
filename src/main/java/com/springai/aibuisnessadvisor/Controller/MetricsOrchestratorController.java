package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Service.Metrics.MetricsOrchestratorService;
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

    /**
     * Calculate and save a complete metrics snapshot
     * POST /api/v1/metrics/calculate/1?weeks=4
     */
//    @PostMapping("/calculate/{businessId}")
//    public ResponseEntity<BusinessMetrics> calculateAndSaveMetrics(
//            @PathVariable Long businessId,
//            @RequestParam(required = false) Long weeks,
//            @RequestParam(required = false) Long months,
//            @RequestParam(required = false) Instant end) {
//
//        if (end == null) {
//            end = Instant.now();
//        }
//
//        if (weeks != null && months != null) {
//            throw new IllegalArgumentException("Provide either weeks OR months, not both");
//        }
//
//        if (weeks == null && months == null) {
//            throw new IllegalArgumentException("You must provide either weeks or months");
//        }
//
//        Instant start;
//        if (weeks != null) {
//            start = end.minus(weeks * 7L, ChronoUnit.DAYS);
//        } else {
//            start = LocalDateTime.ofInstant(end, ZoneOffset.UTC)
//                    .minusMonths(months)
//                    .toInstant(ZoneOffset.UTC);
//        }
//
//        // Calculate and save everything!
//        BusinessMetrics snapshot = metricsOrchestratorService.calculateAndSaveAllMetrics(
//                businessId, start, end, PlatformType.STRIPE
//        );
//
//        return ResponseEntity.ok(snapshot);
//    }

    /**
     * Get the latest saved snapshot
     * GET /api/v1/metrics/latest/1
     */
    @GetMapping("/latest/{businessId}")
    public ResponseEntity<BusinessMetrics> getLatestSnapshot(@PathVariable Long businessId) {
        BusinessMetrics snapshot = metricsOrchestratorService.getLatestSnapshot(businessId);

        if (snapshot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(snapshot);
    }

    /**
     * Get all historical snapshots
     * GET /api/v1/metrics/history/1
     */
    @GetMapping("/history/{businessId}")
    public ResponseEntity<List<BusinessMetrics>> getSnapshotHistory(@PathVariable Long businessId) {
        List<BusinessMetrics> snapshots = metricsOrchestratorService.getAllSnapshots(businessId);
        return ResponseEntity.ok(snapshots);
    }

    /**
     * Get snapshot for specific period
     * GET /api/v1/metrics/1?start=...&end=...
     */
    @GetMapping("/period/{businessId}")
    public ResponseEntity<BusinessMetrics> getSnapshotByPeriod(
            @PathVariable Long businessId,
            @RequestParam(required = false) Long weeks,
            @RequestParam(required = false) Long months,
            @RequestParam(required = false) Instant end) {

        if (end == null) {
            end = Instant.now();
        }

        if (weeks != null && months != null) {
            throw new IllegalArgumentException("Provide either weeks OR months, not both");
        }

        if (weeks == null && months == null) {
            throw new IllegalArgumentException("You must provide weeks or months");
        }

        Instant start;
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

        LocalDate startDate = LocalDate.ofInstant(start, ZoneId.systemDefault());
        LocalDate endDate = LocalDate.ofInstant(end, ZoneId.systemDefault());

        BusinessMetrics snapshot = metricsOrchestratorService.getSnapshotByPeriod(
                businessId,
                startDate,  // ← LocalDate
                endDate     // ← LocalDate
        );

        if (snapshot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(snapshot);
    }
}