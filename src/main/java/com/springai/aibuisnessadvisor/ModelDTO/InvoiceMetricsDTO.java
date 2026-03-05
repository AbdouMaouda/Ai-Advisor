package com.springai.aibuisnessadvisor.ModelDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceMetricsDTO {

    // =========================
    // Invoice Counts (Operational)
    // =========================
    private Long totalInvoices;
    private Long paidInvoices;
    private Long unpaidInvoices;
    private Long overdueInvoices;
    private Long voidInvoices;

    // =========================
    // Financial Amounts (Cash Flow)
    // =========================
    private BigDecimal totalInvoiced;
    private BigDecimal totalPaid;
    private BigDecimal totalOutstanding;

    // =========================
    // Performance Metrics (AI Insights Friendly)
    // =========================
    private BigDecimal averageInvoiceValue;
    private BigDecimal averageDaysToPayment;
}
