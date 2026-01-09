

package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.CustomerMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Service.Metrics.CustomerMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/v1/customers/metrics")
public class MetricsController {

    @Autowired
    private CustomerMetricsService customerMetricsService;

    @GetMapping("/business/{businessId}")
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
                        PlatformType.STRIPE // for now
                );

        return ResponseEntity.ok(metrics);
    }
}



