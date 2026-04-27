package com.springai.aibuisnessadvisor.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.ModelDTO.AIInsightsResponse;
import com.springai.aibuisnessadvisor.Repositories.BusinessMetricsRepository;
import com.springai.aibuisnessadvisor.Service.AI.AIService;
import com.springai.aibuisnessadvisor.Service.ClerkUserService;
import com.springai.aibuisnessadvisor.Service.UserApiKeyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIInsightsController {

    private final AIService aiService;
    private final UserApiKeyService userApiKeyService;
    private final BusinessMetricsRepository metricsRepository;
    private final ClerkUserService clerkUserService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIInsightsController(AIService aiService,
                                UserApiKeyService userApiKeyService,
                                BusinessMetricsRepository metricsRepository,
                                ClerkUserService clerkUserService) {
        this.aiService = aiService;
        this.userApiKeyService = userApiKeyService;
        this.metricsRepository = metricsRepository;
        this.clerkUserService = clerkUserService;
    }

    @GetMapping("/insights")
    public ResponseEntity<AIInsightsResponse> getInsights(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));

        if (userApiKeyService.getConfig(businessId).isEmpty()) {
            return ResponseEntity.ok(apiKeyRequiredResponse());
        }

        return metricsRepository
                .findFirstByBusiness_IdOrderByEndDateDesc(businessId)
                .map(m -> {
                    String raw = aiService.generateCompletion(buildPrompt(m), businessId);
                    if (raw == null) return ResponseEntity.ok(apiKeyRequiredResponse());
                    if (AIService.INVALID_KEY_SENTINEL.equals(raw)) return ResponseEntity.ok(apiKeyInvalidResponse());
                    AIInsightsResponse response = parseResponse(raw);
                    response.setLastUpdated(m.getCollectedAt());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.ok(emptyResponse()));
    }

    private AIInsightsResponse apiKeyRequiredResponse() {
        AIInsightsResponse r = new AIInsightsResponse();
        r.setSummary("api_key_required");
        r.setOpportunities(new ArrayList<>());
        r.setRisks(new ArrayList<>());
        r.setActions(new ArrayList<>());
        r.setKeyEvents(new ArrayList<>());
        return r;
    }

    private AIInsightsResponse apiKeyInvalidResponse() {
        AIInsightsResponse r = new AIInsightsResponse();
        r.setSummary("api_key_invalid");
        r.setOpportunities(new ArrayList<>());
        r.setRisks(new ArrayList<>());
        r.setActions(new ArrayList<>());
        r.setKeyEvents(new ArrayList<>());
        return r;
    }

    private AIInsightsResponse emptyResponse() {
        AIInsightsResponse r = new AIInsightsResponse();
        r.setSummary("No metrics found. Connect Stripe and run a metrics calculation to generate insights.");
        r.setOpportunities(new ArrayList<>());
        r.setRisks(new ArrayList<>());
        r.setActions(new ArrayList<>());
        r.setKeyEvents(new ArrayList<>());
        return r;
    }

    private String buildPrompt(BusinessMetrics m) {
        var rev  = m.getRevenueMetrics();
        var cust = m.getCustomerMetrics();
        var sub  = m.getSubscriptionMetrics();
        var inv  = m.getInvoiceMetrics();
        var hlth = m.getHealthMetrics();

        return String.format("""
                YOU MUST respond with ONLY a JSON object. No introduction, no explanation, no markdown. Start your response with { and end with }.

                You are a SaaS business analyst. Analyze the following metrics and return a JSON object.

                METRICS:
                Revenue — Gross: $%s | Net: $%s | Successful charges: %s | Failed: %s
                Customers — Total: %s | Active: %s | New: %s | Churned: %s
                Subscriptions — Active: %s | New: %s | MRR: $%s | ARR: $%s
                Invoices — Total: %s | Paid: %s | Unpaid: %s | Overdue: %s
                Health score: %s/100

                Return ONLY this JSON, no markdown, starting with { and ending with }:
                {
                  "summary": "2-3 sentence plain-English executive summary of the business state",
                  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
                  "risks": ["risk 1", "risk 2"],
                  "actions": [
                    {"title": "Action title", "priority": "urgent"},
                    {"title": "Action title", "priority": "moderate"},
                    {"title": "Action title", "priority": "low"}
                  ],
                  "keyEvents": ["notable event or data point 1", "notable event or data point 2"]
                }
                """,
                rev  != null ? rev.getGrossRevenue()        : 0,
                rev  != null ? rev.getNetRevenue()           : 0,
                rev  != null ? rev.getSuccessfulCharges()    : 0,
                rev  != null ? rev.getFailedCharges()        : 0,
                cust != null ? cust.getTotalCustomers()      : 0,
                cust != null ? cust.getActiveCustomers()     : 0,
                cust != null ? cust.getNewCustomers()        : 0,
                cust != null ? cust.getChurnedCustomers()    : 0,
                sub  != null ? sub.getActiveSubscriptions()  : 0,
                sub  != null ? sub.getNewSubscriptions()     : 0,
                sub  != null ? sub.getMrr()                  : 0,
                sub  != null ? sub.getArr()                  : 0,
                inv  != null ? inv.getTotalInvoices()        : 0,
                inv  != null ? inv.getPaidInvoices()         : 0,
                inv  != null ? inv.getUnpaidInvoices()       : 0,
                inv  != null ? inv.getOverdueInvoices()      : 0,
                hlth != null ? hlth.getHealthScore()         : 0
        );
    }

    private AIInsightsResponse parseResponse(String raw) {
        AIInsightsResponse result = new AIInsightsResponse();
        result.setOpportunities(new ArrayList<>());
        result.setRisks(new ArrayList<>());
        result.setActions(new ArrayList<>());
        result.setKeyEvents(new ArrayList<>());

        try {
            int start = raw.indexOf('{');
            int end   = raw.lastIndexOf('}');
            if (start == -1 || end == -1 || end < start) {
                System.err.println("No JSON object found in AI response");
                return result;
            }
            String cleaned = raw.substring(start, end + 1);
            JsonNode root = objectMapper.readTree(cleaned);

            if (root.has("summary")) result.setSummary(root.get("summary").asText());
            if (root.has("opportunities")) {
                List<String> list = new ArrayList<>();
                root.get("opportunities").forEach(n -> list.add(n.asText()));
                result.setOpportunities(list);
            }
            if (root.has("risks")) {
                List<String> list = new ArrayList<>();
                root.get("risks").forEach(n -> list.add(n.asText()));
                result.setRisks(list);
            }
            if (root.has("actions")) {
                List<AIInsightsResponse.ActionItem> list = new ArrayList<>();
                root.get("actions").forEach(n -> list.add(new AIInsightsResponse.ActionItem(
                        n.has("title")    ? n.get("title").asText()    : "",
                        n.has("priority") ? n.get("priority").asText() : "low"
                )));
                result.setActions(list);
            }
            if (root.has("keyEvents")) {
                List<String> list = new ArrayList<>();
                root.get("keyEvents").forEach(n -> list.add(n.asText()));
                result.setKeyEvents(list);
            }
        } catch (Exception e) {
            System.err.println("Failed to parse AI insights response: " + e.getMessage());
        }

        return result;
    }
}
