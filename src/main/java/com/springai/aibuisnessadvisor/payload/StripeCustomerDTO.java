package com.springai.aibuisnessadvisor.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripeCustomerDTO {
    private String id;
    private String name;
    private String email;
    private Long created;
}
