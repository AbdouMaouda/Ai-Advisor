package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Entity
@Table(name="product_performance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductPerformance implements Comparable<ProductPerformance> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_metrics_id", nullable = false)
    private BusinessMetrics businessMetrics;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_description", columnDefinition = "TEXT")
    private String productDescription;

    @Column(name = "revenue", precision = 19, scale = 2)
    private BigDecimal revenue = BigDecimal.ZERO;

    @Column(name = "quantity")
    private Long quantity = 0L;


    @Column(name = "average_price_per_unit", precision = 19, scale = 2)
    private BigDecimal averagePricePerUnit = BigDecimal.ZERO;

    @Column(name = "revenue_growth", precision = 10, scale = 4)
    private BigDecimal revenueGrowth = BigDecimal.ZERO;

    @Override
    public int compareTo(ProductPerformance other) {
        return Comparator
                .comparing(ProductPerformance::getRevenue, Comparator.nullsLast(BigDecimal::compareTo))
                .reversed()
                .compare(this, other);
    }

}
