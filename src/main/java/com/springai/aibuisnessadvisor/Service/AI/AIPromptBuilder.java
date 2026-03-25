package com.springai.aibuisnessadvisor.Service.AI;

import org.springframework.stereotype.Component;
import com.springai.aibuisnessadvisor.ModelDTO.BusinessMetricsForAi;
import java.math.BigDecimal;

@Component
public class AIPromptBuilder {

    /**
     * Build comprehensive insights prompt with all business metrics
     */
    public String buildInsightsPrompt(BusinessMetricsForAi m) {
        return String.format("""
            You are an expert SaaS business analyst. Analyze all these metrics together and provide actionable insights.
            
            ================================================================
            REVENUE METRICS
            ================================================================
            Gross Revenue:
              Current: $%s
              Previous: $%s
              Growth: %s%%
            
            Net Revenue:
              Current: $%s
              Previous: $%s
              Growth: %s%%
              Net/Gross Ratio: %s%% (revenue retention after refunds)
            
            ================================================================
            RECURRING REVENUE (MRR/ARR)
            ================================================================
            Monthly Recurring Revenue (MRR):
              Current: $%s
              Previous: $%s
              Growth: %s%%
            
            Annual Recurring Revenue (ARR):
              Current: $%s
              Previous: $%s
              Growth: %s%%
            
            ================================================================
            CUSTOMER METRICS
            ================================================================
            Customer Base:
              Total Customers: %,d
              Active Customers: %,d (%.1f%% active rate)
              Previous Active: %,d
              New Customers: %,d
              Churned Customers: %,d
            
            Customer Health:
              Churn Rate: %.2f%% (monthly)
              Retention Rate: %.2f%%
              Customer Growth: %s
            
            ================================================================
            SUBSCRIPTION METRICS
            ================================================================
            Subscriptions:
              Total Subscriptions: %,d
              Active Subscriptions: %,d (%.1f%% active rate)
              Previous Active: %,d
              New Subscriptions: %,d
              Cancelled Subscriptions: %,d
              Trial Conversion Rate: %s%%
            
            ================================================================
            FINANCIAL HEALTH
            ================================================================
            Unit Economics:
              ARPU (Average Revenue Per User): $%s
              LTV (Customer Lifetime Value): $%s
              CAC (Customer Acquisition Cost): $%s
              LTV/CAC Ratio: %sx
            
            ================================================================
            PAYMENT & INVOICE METRICS
            ================================================================
            Invoices:
              Total: %,d
              Paid: %,d
              Pending: %,d
              Overdue: %,d
              Payment Success Rate: %s%%
            
            Refunds:
              Refund Rate: %s%%
            
            ================================================================
            GROWTH TREND & HEALTH SCORES
            ================================================================
            Growth Trend: %s
            
            Component Health Scores (0-100):
              Overall Health: %.2f/100
              Customer Score: %s/100
              Revenue Score: %s/100
              Subscription Score: %s/100
              Growth Score: %s/100
              Refund Score: %s/100
            
            ================================================================
            TIME PERIOD
            ================================================================
            Analysis Period: %s to %s (%s)
            
            ================================================================
            SAAS INDUSTRY BENCHMARKS (for comparison)
            ================================================================
            Healthy MRR Growth: 10-20%% monthly
            Good Churn Rate: Less than 5%% monthly
            Excellent Churn: Less than 3%% monthly
            Strong LTV/CAC Ratio: Greater than 3x
            Ideal LTV/CAC: Greater than 5x
            Healthy Retention: Greater than 90%%
            Good Refund Rate: Less than 3%%
            Payment Success: Greater than 95%%
            Trial Conversion: 40-60%%
            
            ================================================================
            YOUR TASK
            ================================================================
            Analyze all the metrics above and return insights in this exact JSON format:
            
            {
              "strengths": [
                {
                  "category": "revenue|customers|retention|growth|subscriptions|payments|refunds",
                  "title": "Clear, specific title (max 60 chars)",
                  "description": "Detailed explanation with specific numbers from the data (100-200 chars)",
                  "impact": "high|medium|low",
                  "metric": "The specific metric name this relates to"
                }
              ],
              "warnings": [
                {
                  "category": "revenue|customers|retention|growth|subscriptions|payments|refunds",
                  "severity": "critical|high|medium|low",
                  "title": "Clear warning title (max 60 chars)",
                  "description": "What's wrong and why it matters (100-200 chars)",
                  "recommendedAction": "Specific, actionable step to fix this (80-150 chars)",
                  "impact": "Quantified potential impact (e.g., '$2,400 MRR at risk')",
                  "metric": "The specific metric triggering this warning"
                }
              ],
              "recommendations": [
                {
                  "category": "growth|retention|optimization|revenue|acquisition|product",
                  "priority": "high|medium|low",
                  "title": "Actionable recommendation (max 60 chars)",
                  "description": "Why this matters and how to implement (150-250 chars)",
                  "expectedImpact": "Quantified expected benefit (e.g., 'Could increase MRR by 15%%')",
                  "effort": "high|medium|low",
                  "timeline": "Realistic timeframe (e.g., '2-4 weeks', '1-2 months')"
                }
              ]
            }
            
            ================================================================
            CRITICAL ANALYSIS RULES
            ================================================================
            
            1. STRENGTHS (provide 2-4 items):
               - Highlight metrics that exceed industry benchmarks
               - Use exact numbers from the data provided
               - Focus on sustainable competitive advantages
               - Explain why this is a strength (not just state it)
            
            2. WARNINGS (provide 0-3 items):
               - Flag metrics below benchmarks or showing negative trends
               - Only warn if there is a real issue (do not invent problems)
               - Quantify the risk (revenue impact, customer impact)
               - Provide specific remediation steps (not generic advice)
               - Severity levels:
                 critical: Immediate threat to business (churn greater than 10%%, negative growth)
                 high: Significant concern (churn 5-10%%, LTV/CAC less than 2x)
                 medium: Watch closely (churn 3-5%%, declining trends)
                 low: Minor optimization opportunity
            
            3. RECOMMENDATIONS (provide 2-4 items):
               - Prioritize by impact versus effort (quick wins plus strategic moves)
               - Be specific and actionable (not "improve retention" but "implement win-back campaign for churned users")
               - Include realistic timelines based on effort
               - Quantify expected outcomes when possible
               - Consider current growth stage and resources
            
            4. GENERAL RULES:
               - Use exact numbers from the metrics (not approximations)
               - Compare to industry benchmarks provided
               - Consider the full context (do not analyze metrics in isolation)
               - Be honest (if everything is good, do not invent warnings)
               - Write for a business owner (not a data scientist)
            
            ================================================================
            JSON OUTPUT REQUIREMENTS
            ================================================================
            - Return ONLY the JSON object (no explanations before or after)
            - NO markdown formatting (no ```json or ``` blocks)
            - Start directly with { and end with }
            - Use exact field names shown above
            - Ensure all strings are properly escaped
            - All arrays must have at least 1 item (or be empty [])
            
            JSON OUTPUT:
            """,
                // REVENUE
                formatMoney(m.getCurrentGrossRevenue()),
                formatMoney(m.getPreviousGrossRevenue()),
                formatPercent(m.getGrossRevenueGrowthRate()),
                formatMoney(m.getCurrentNetRevenue()),
                formatMoney(m.getPreviousNetRevenue()),
                formatPercent(m.getNetRevenueGrowthRate()),
                formatPercent(m.getNetRevenueRatio() != null ? m.getNetRevenueRatio().multiply(BigDecimal.valueOf(100)) : BigDecimal.ZERO),

                // MRR/ARR
                formatMoney(m.getCurrentMrr()),
                formatMoney(m.getPreviousMrr()),
                formatPercent(m.getMrrGrowthRate()),
                formatMoney(m.getCurrentArr()),
                formatMoney(m.getPreviousArr()),
                formatPercent(m.getArrGrowthRate()),

                // CUSTOMERS
                m.getTotalCustomers() != null ? m.getTotalCustomers() : 0,
                m.getActiveCustomers() != null ? m.getActiveCustomers() : 0,
                m.getActiveCustomerRatio() != null ? m.getActiveCustomerRatio() * 100 : 0.0,
                m.getPreviousActiveCustomers() != null ? m.getPreviousActiveCustomers() : 0,
                m.getNewCustomers() != null ? m.getNewCustomers() : 0,
                m.getChurnedCustomers() != null ? m.getChurnedCustomers() : 0,
                m.getChurnRate() != null ? m.getChurnRate() : 0.0,
                m.getRetentionRate() != null ? m.getRetentionRate() : 0.0,
                formatGrowth(m.getCustomerGrowth(), m.getCustomerGrowthRate()),

                // SUBSCRIPTIONS
                m.getTotalSubscriptions() != null ? m.getTotalSubscriptions() : 0,
                m.getActiveSubscriptions() != null ? m.getActiveSubscriptions() : 0,
                m.getActiveSubscriptionRatio() != null ? m.getActiveSubscriptionRatio() * 100 : 0.0,
                m.getPreviousActiveSubscriptions() != null ? m.getPreviousActiveSubscriptions() : 0,
                m.getNewSubscriptions() != null ? m.getNewSubscriptions() : 0,
                m.getCancelledSubscriptions() != null ? m.getCancelledSubscriptions() : 0,
                formatOptionalPercent(m.getTrialConversionRate()),

                // FINANCIAL
                formatMoney(m.getAverageRevenuePerUser()),
                formatMoney(m.getCustomerLifetimeValue()),
                formatMoney(m.getCustomerAcquisitionCost()),
                formatRatio(m.getLtvcacRatio()),

                // PAYMENTS
                m.getTotalInvoices() != null ? m.getTotalInvoices() : 0,
                m.getPaidInvoices() != null ? m.getPaidInvoices() : 0,
                m.getPendingInvoices() != null ? m.getPendingInvoices() : 0,
                m.getOverdueInvoices() != null ? m.getOverdueInvoices() : 0,
                formatOptionalPercent(m.getPaymentSuccessRate()),
                formatPercent(m.getRefundRate()),

                // GROWTH & HEALTH
                m.getGrowthTrend() != null ? m.getGrowthTrend() : "STABLE",
                m.getOverallHealthScore() != null ? m.getOverallHealthScore() : BigDecimal.ZERO,
                formatScore(m.getCustomerScore()),
                formatScore(m.getRevenueScore()),
                formatScore(m.getSubscriptionScore()),
                formatScore(m.getGrowthScore()),
                formatScore(m.getRefundScore()),

                // TIME
                m.getPeriodStart() != null ? m.getPeriodStart() : "N/A",
                m.getPeriodEnd() != null ? m.getPeriodEnd() : "N/A",
                m.getComparisonPeriod() != null ? m.getComparisonPeriod() : "N/A"
        );
    }

    // ================================================================
    // HELPER FORMATTING METHODS
    // ================================================================

    /**
     * Format money (BigDecimal) to string
     * Example: 45600.00 -> "45,600"
     */
    private String formatMoney(BigDecimal value) {
        if (value == null) {
            return "0";
        }
        return String.format("%,d", value.longValue());
    }

    /**
     * Format percentage (BigDecimal) to string
     * Example: 15.5 -> "+15.5"
     */
    private String formatPercent(BigDecimal value) {
        if (value == null) {
            return "0.0";
        }
        double val = value.doubleValue();
        if (val > 0) {
            return String.format("+%.1f", val);
        } else if (val < 0) {
            return String.format("%.1f", val);
        } else {
            return "0.0";
        }
    }

    /**
     * Format optional percentage (Double) to string
     */
    private String formatOptionalPercent(Double value) {
        if (value == null) {
            return "N/A";
        }
        return String.format("%.1f", value);
    }

    /**
     * Format ratio to string
     * Example: 4.5 -> "4.5"
     */
    private String formatRatio(BigDecimal value) {
        if (value == null) {
            return "N/A";
        }
        return String.format("%.1f", value.doubleValue());
    }

    /**
     * Format score to string
     */
    private String formatScore(BigDecimal value) {
        if (value == null) {
            return "N/A";
        }
        return String.format("%.1f", value.doubleValue());
    }

    /**
     * Format growth (count + percentage)
     * Example: +30 customers (+8.5%)
     */
    private String formatGrowth(Long count, Double percentage) {
        if (count == null || percentage == null) {
            return "N/A";
        }
        String sign = count >= 0 ? "+" : "";
        return String.format("%s%d customers (%s%.1f%%)", sign, count, count >= 0 ? "+" : "", percentage);
    }
}