package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductPerformanceDTO {

    private Long id;

    // We DO NOT expose BusinessMetrics object (too heavy + circular JSON risk)
    private String productId;
    private String productName;
    private String productDescription;

    // Core performance metrics (important for AI + dashboard)
    private BigDecimal revenue;
    private Long quantity;
    private BigDecimal averagePricePerUnit;
    private BigDecimal revenueGrowth;
    private Integer numberOfCustomers;
}
