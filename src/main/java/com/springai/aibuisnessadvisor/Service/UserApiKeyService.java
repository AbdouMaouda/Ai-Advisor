package com.springai.aibuisnessadvisor.Service;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.UserApiKey;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Repositories.UserApiKeyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Optional;

@Service
public class UserApiKeyService {

    private final UserApiKeyRepository repository;
    private final BusinessRepository businessRepository;
    private final String encryptionSecret;

    public UserApiKeyService(UserApiKeyRepository repository,
                             BusinessRepository businessRepository,
                             @Value("${encryption.secret}") String encryptionSecret) {
        this.repository = repository;
        this.businessRepository = businessRepository;
        this.encryptionSecret = encryptionSecret;
    }

    public void saveKey(Long businessId, String provider, String apiKey, String ollamaUrl, String ollamaModel) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        UserApiKey key = repository.findByBusiness_Id(businessId).orElse(new UserApiKey());
        key.setBusiness(business);
        key.setProvider(provider);
        if (apiKey != null && !apiKey.isBlank()) {
            key.setEncryptedApiKey(encrypt(apiKey));
        }
        key.setOllamaUrl(ollamaUrl);
        key.setOllamaModel(ollamaModel);
        repository.save(key);
    }

    public Optional<UserApiKey> getConfig(Long businessId) {
        return repository.findByBusiness_Id(businessId);
    }

    public String getDecryptedKey(Long businessId) {
        return repository.findByBusiness_Id(businessId)
                .map(k -> k.getEncryptedApiKey() != null ? decrypt(k.getEncryptedApiKey()) : null)
                .orElse(null);
    }

    public String maskKey(String apiKey) {
        if (apiKey == null || apiKey.length() < 8) return "****";
        return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length() - 4);
    }

    public void deleteKey(Long businessId) {
        repository.findByBusiness_Id(businessId).ifPresent(repository::delete);
    }

    private String encrypt(String plaintext) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, buildKeySpec());
            return Base64.getEncoder().encodeToString(cipher.doFinal(plaintext.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    private String decrypt(String ciphertext) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, buildKeySpec());
            return new String(cipher.doFinal(Base64.getDecoder().decode(ciphertext)));
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    private SecretKeySpec buildKeySpec() {
        byte[] keyBytes = new byte[32];
        byte[] secretBytes = encryptionSecret.getBytes();
        System.arraycopy(secretBytes, 0, keyBytes, 0, Math.min(secretBytes.length, 32));
        return new SecretKeySpec(keyBytes, "AES");
    }
}
