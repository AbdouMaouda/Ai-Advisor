package com.springai.aibuisnessadvisor.Controller;

import com.springai.aibuisnessadvisor.Model.UserApiKey;
import com.springai.aibuisnessadvisor.Service.ClerkUserService;
import com.springai.aibuisnessadvisor.Service.UserApiKeyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/api-key")
public class UserApiKeyController {

    private final UserApiKeyService userApiKeyService;
    private final ClerkUserService clerkUserService;

    public UserApiKeyController(UserApiKeyService userApiKeyService, ClerkUserService clerkUserService) {
        this.userApiKeyService = userApiKeyService;
        this.clerkUserService = clerkUserService;
    }

    @PostMapping
    public ResponseEntity<?> saveKey(HttpServletRequest request, @RequestBody Map<String, String> body) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        String provider = body.get("provider");
        String apiKey = body.get("apiKey");
        String ollamaUrl = body.get("ollamaUrl");
        String ollamaModel = body.get("ollamaModel");

        if (provider == null || provider.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "provider is required"));
        }

        userApiKeyService.saveKey(businessId, provider, apiKey, ollamaUrl, ollamaModel);
        return ResponseEntity.ok(Map.of("message", "API key saved successfully"));
    }

    @GetMapping
    public ResponseEntity<?> getKey(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        Optional<UserApiKey> configOpt = userApiKeyService.getConfig(businessId);

        if (configOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("configured", false));
        }

        UserApiKey key = configOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("configured", true);
        response.put("provider", key.getProvider());
        response.put("ollamaUrl", key.getOllamaUrl() != null ? key.getOllamaUrl() : "");
        response.put("ollamaModel", key.getOllamaModel() != null ? key.getOllamaModel() : "");
        if (key.getEncryptedApiKey() != null) {
            String decrypted = userApiKeyService.getDecryptedKey(businessId);
            response.put("maskedKey", userApiKeyService.maskKey(decrypted));
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteKey(HttpServletRequest request) {
        Long businessId = clerkUserService.getOrCreateBusinessId((String) request.getAttribute("clerkUserId"));
        userApiKeyService.deleteKey(businessId);
        return ResponseEntity.ok(Map.of("message", "API key deleted successfully"));
    }
}
