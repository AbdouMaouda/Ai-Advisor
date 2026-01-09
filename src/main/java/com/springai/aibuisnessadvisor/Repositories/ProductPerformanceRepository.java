package com.springai.aibuisnessadvisor.Repositories;

import com.springai.aibuisnessadvisor.Model.ProductPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPerformanceRepository extends JpaRepository<ProductPerformance,Long> {
}
