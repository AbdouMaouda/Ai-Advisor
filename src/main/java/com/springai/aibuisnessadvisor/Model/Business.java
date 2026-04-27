package com.springai.aibuisnessadvisor.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Entity
@Table(name = "businesses")
@Getter
@Setter
@NoArgsConstructor
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "email")
    private String email;

    @Column(name = "country")
    private String country;

    @Column(name = "primary_currency")
    private String primaryCurrency;

    @ElementCollection
    @CollectionTable(
            name = "business_platform_accounts",
            joinColumns = @JoinColumn(name = "business_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "platform")
    @Column(name = "account_id")
    private Map<PlatformType, String> platformAccounts = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "clerk_user_id", unique = true)
    private String clerkUserId;

    @ElementCollection
    @CollectionTable(
            name = "business_platform_tokens",
            joinColumns = @JoinColumn(name = "business_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "platform")
    private Map<PlatformType, PlatformAuth> platformAuth = new HashMap<>();//Key: PlateformType, Value:Access Token(String)

    /**
     * All metric snapshots for this business
     */
    //@JsonIgnore
    @JsonManagedReference
    @OneToMany(
            mappedBy = "business",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<BusinessMetrics> metricsHistory = new ArrayList<>();

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
