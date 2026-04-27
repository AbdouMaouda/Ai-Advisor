package com.springai.aibuisnessadvisor.Repositories;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.ProductPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessRepository extends JpaRepository<Business,Long> {
    List<Business> findAllByisActiveTrue();
    Optional<Business> findByClerkUserId(String clerkUserId);
}
