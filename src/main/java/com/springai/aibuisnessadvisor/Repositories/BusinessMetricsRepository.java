package com.springai.aibuisnessadvisor.Repositories;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.BusinessMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessMetricsRepository extends JpaRepository<BusinessMetrics, Long> {

    List<BusinessMetrics> findByBusinessOrderByEndDateDesc(Business business);

    Optional<BusinessMetrics> findFirstByBusinessOrderByEndDateDesc(Business business);
    Optional<BusinessMetrics>
    findFirstByBusinessAndEndDateLessThanEqualOrderByEndDateDesc(
            Business business,
            LocalDate endDate
    );


    Optional<BusinessMetrics> findFirstByBusiness_IdOrderByEndDateDesc(Long businessId);


    Optional<BusinessMetrics> findFirstByBusinessAndPlatformTypeOrderByEndDateDesc(Business business, PlatformType platformType);

    Optional<BusinessMetrics> findByBusinessAndStartDateAndEndDate(Business business, LocalDate start, LocalDate end);

    Optional<BusinessMetrics> findByBusinessAndStartDateAndEndDateAndPlatformType(Business business, LocalDate startDate, LocalDate endDate, PlatformType platformType);
}