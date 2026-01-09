package com.springai.aibuisnessadvisor.Repositories;


import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.ProductPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessMetricsRepository extends JpaRepository<BusinessMetrics,Long> {
}
