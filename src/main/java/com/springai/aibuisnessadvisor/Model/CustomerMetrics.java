package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMetrics {

    @Column(name = "total_customers")
    private Long totalCustomers = 0L;

    @Column(name = "new_customers")
    private Long newCustomers = 0L;

    @Column(name = "active_customers")
    private Long activeCustomers = 0L;

    @Column(name = "churned_customers")
    private Long churnedCustomers = 0L;//customer active last month-customer from last month that are not active

    @Column(name = "avg_customer_value", precision = 19, scale = 2)
    private BigDecimal averageCustomerValue = BigDecimal.ZERO;

    @Column(name = "avg_customer_lifetime_value", precision = 19, scale = 2)
    private BigDecimal averageCustomerLifetimeValue = BigDecimal.ZERO;
}
