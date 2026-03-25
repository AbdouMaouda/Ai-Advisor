package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * AI-generated insights wrapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthInsights {

    private List<String> strengths = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
}