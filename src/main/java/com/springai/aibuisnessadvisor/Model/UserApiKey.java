package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_api_keys")
@Getter
@Setter
@NoArgsConstructor
public class UserApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "encrypted_api_key", length = 1024)
    private String encryptedApiKey;

    @Column(name = "ollama_url")
    private String ollamaUrl;

    @Column(name = "ollama_model")
    private String ollamaModel;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
