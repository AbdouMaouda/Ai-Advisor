package com.springai.aibuisnessadvisor.Service.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.ModelDTO.BusinessMetricsForAi;
import com.springai.aibuisnessadvisor.ModelDTO.HealthInsights;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIInsightsService {

    private final AIPromptBuilder aiPromptBuilder;
    private final AIService aiService;

    public AIInsightsService(AIPromptBuilder aiPromptBuilder, AIService aiService) {
        this.aiPromptBuilder = aiPromptBuilder;
        this.aiService = aiService;
    }

    public HealthInsights AIInsights(BusinessMetricsForAi metrics, Long businessId) {
        String prompt = aiPromptBuilder.buildInsightsPrompt(metrics);
        String aiInsights = aiService.generateCompletion(prompt, businessId);
        if (aiInsights == null) return new HealthInsights();
        return parseResponse(aiInsights);
    }

    private HealthInsights parseResponse(String response) {
        try {
            String cleaned = response
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(cleaned);

            List<String> strengths = new ArrayList<>();
            if (root.has("strengths")) {
                root.get("strengths").forEach(s -> {
                    if (s.has("title")) strengths.add(s.get("title").asText());
                });
            }

            List<String> warnings = new ArrayList<>();
            if (root.has("warnings")) {
                root.get("warnings").forEach(w -> {
                    if (w.has("title")) warnings.add(w.get("title").asText());
                });
            }

            List<String> recommendations = new ArrayList<>();
            if (root.has("recommendations")) {
                root.get("recommendations").forEach(r -> {
                    if (r.has("title")) recommendations.add(r.get("title").asText());
                });
            }

            System.out.println("Parsed " + strengths.size() + " strengths, "
                    + warnings.size() + " warnings, "
                    + recommendations.size() + " recommendations");

            return new HealthInsights(strengths, warnings, recommendations);

        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
            return new HealthInsights();
        }
    }
}
