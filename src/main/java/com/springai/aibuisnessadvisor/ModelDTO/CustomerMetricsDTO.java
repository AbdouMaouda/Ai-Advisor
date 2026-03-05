package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerMetricsDTO {

    private long totalCustomers;
    private long activeCustomers;
    private long newCustomers;
    private long churnedCustomers;
}
