package com.springai.aibuisnessadvisor.Repositories;

import com.springai.aibuisnessadvisor.Model.UserApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserApiKeyRepository extends JpaRepository<UserApiKey, Long> {
    Optional<UserApiKey> findByBusiness_Id(Long businessId);
}
