package com.springai.aibuisnessadvisor.Service;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClerkUserService {

    private final BusinessRepository businessRepository;

    @Transactional
    public Long getOrCreateBusinessId(String clerkUserId) {
        if (clerkUserId == null || clerkUserId.isBlank()) {
            throw new RuntimeException("clerkUserId is null or blank — JWT subject not set");
        }

        return businessRepository.findByClerkUserId(clerkUserId)
                .map(b -> {
                    System.out.println("[ClerkUserService] Found business id=" + b.getId()
                            + " for clerkUserId=" + clerkUserId);
                    return b.getId();
                })
                .orElseGet(() -> {
                    System.out.println("[ClerkUserService] No business found for clerkUserId="
                            + clerkUserId + " — creating new");
                    try {
                        Business business = new Business();
                        business.setBusinessName("My Business");
                        business.setClerkUserId(clerkUserId);
                        business.setIsActive(true);
                        Business saved = businessRepository.saveAndFlush(business);
                        System.out.println("[ClerkUserService] Created business id=" + saved.getId()
                                + " for clerkUserId=" + clerkUserId);
                        return saved.getId();
                    } catch (DataIntegrityViolationException e) {
                        // Race condition: concurrent request already inserted the row
                        System.out.println("[ClerkUserService] Race condition — re-fetching for clerkUserId=" + clerkUserId);
                        return businessRepository.findByClerkUserId(clerkUserId)
                                .orElseThrow(() -> new RuntimeException(
                                        "Failed to resolve business for clerkUserId: " + clerkUserId))
                                .getId();
                    }
                });
    }
}
