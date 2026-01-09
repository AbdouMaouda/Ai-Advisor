package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.Instant;
@Data
@Embeddable
public class PlatformAuth {
    private String accessToken;
    private String refreshToken;

    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    private PlatformConnectionStatus status;

}
