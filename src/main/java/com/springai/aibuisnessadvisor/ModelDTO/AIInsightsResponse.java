package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightsResponse {
    private String summary;
    private List<String> opportunities = new ArrayList<>();
    private List<String> risks = new ArrayList<>();
    private List<ActionItem> actions = new ArrayList<>();
    private List<String> keyEvents = new ArrayList<>();
    private Instant lastUpdated;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionItem {
        private String title;
        private String priority;
    }
}
