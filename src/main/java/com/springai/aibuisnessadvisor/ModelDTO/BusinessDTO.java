package com.springai.aibuisnessadvisor.ModelDTO;

import com.springai.aibuisnessadvisor.Model.PlatformType;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
public class BusinessDTO {

    private Long id;
    private String businessName;
    private String email;
    private String country;
    private String primaryCurrency;

    // Connected platform account IDs (SAFE to expose)
    private Map<PlatformType, String> platformAccounts;

    private Boolean isActive;
    private Instant createdAt;
}
