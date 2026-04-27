package com.springai.aibuisnessadvisor.Service.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springai.aibuisnessadvisor.Model.UserApiKey;
import com.springai.aibuisnessadvisor.Service.UserApiKeyService;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AIService {

    public static final String INVALID_KEY_SENTINEL = "__api_key_invalid__";

    private final UserApiKeyService userApiKeyService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public AIService(UserApiKeyService userApiKeyService) {
        this.userApiKeyService = userApiKeyService;
    }

    public String generateCompletion(String prompt, Long businessId) {
        Optional<UserApiKey> configOpt = userApiKeyService.getConfig(businessId);
        if (configOpt.isEmpty()) return null;

        UserApiKey config = configOpt.get();
        String provider = config.getProvider();
        String apiKey = userApiKeyService.getDecryptedKey(businessId);

        try {
            return switch (provider) {
                case "anthropic" -> callAnthropic(prompt, apiKey);
                case "openai" -> callOpenAI(prompt, apiKey);
                case "ollama" -> callOllama(prompt, config.getOllamaUrl(), config.getOllamaModel());
                default -> null;
            };
        } catch (Exception e) {
            System.err.println("AI provider call failed [" + provider + "]: " + e.getMessage());
            return null;
        }
    }

    private String callAnthropic(String prompt, String apiKey) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "model", "claude-haiku-4-5-20251001",
                "max_tokens", 1024,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        ));

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.anthropic.com/v1/messages"))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() == 401 || res.statusCode() == 403) {
            System.err.println("Anthropic rejected key — HTTP " + res.statusCode());
            return INVALID_KEY_SENTINEL;
        }
        JsonNode root = objectMapper.readTree(res.body());
        return root.path("content").get(0).path("text").asText();
    }

    private String callOpenAI(String prompt, String apiKey) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(Map.of("role", "user", "content", prompt))
        ));

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() == 401 || res.statusCode() == 403) {
            System.err.println("OpenAI rejected key — HTTP " + res.statusCode());
            return INVALID_KEY_SENTINEL;
        }
        JsonNode root = objectMapper.readTree(res.body());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    private String callOllama(String prompt, String ollamaUrl, String model) throws Exception {
        String url = (ollamaUrl != null && !ollamaUrl.isBlank() ? ollamaUrl : "http://localhost:11434") + "/api/chat";
        String body = objectMapper.writeValueAsString(Map.of(
                "model", model != null && !model.isBlank() ? model : "llama3",
                "stream", false,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        ));

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        JsonNode root = objectMapper.readTree(res.body());
        return root.path("message").path("content").asText();
    }
}
