package com.springai.aibuisnessadvisor.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

//Describe how a business bills its customers
// and how well those bills are getting paid
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceMetrics {

    // Counts
    @Column(name = "total_invoices")
    private Long totalInvoices = 0L;

    @Column(name = "paid_invoices")
    private Long paidInvoices = 0L;

    @Column(name = "unpaid_invoices")
    private Long unpaidInvoices = 0L;

    @Column(name = "overdue_invoices")
    private Long overdueInvoices = 0L;

    @Column(name = "void_invoices")
    private Long voidInvoices = 0L;

    // Money
    @Column(name = "total_invoiced", precision = 19, scale = 2)
    private BigDecimal totalInvoiced = BigDecimal.ZERO;

    @Column(name = "total_paid", precision = 19, scale = 2)
    private BigDecimal totalPaid = BigDecimal.ZERO;

    @Column(name = "total_outstanding", precision = 19, scale = 2)
    private BigDecimal totalOutstanding = BigDecimal.ZERO;

    // Averages
    @Column(name = "average_invoice_value", precision = 19, scale = 2)
    private BigDecimal averageInvoiceValue = BigDecimal.ZERO;

    // Average number of days between invoice creation and payment
    @Column(name = "average_days_to_payment", precision = 10, scale = 2)
    private BigDecimal averageDaysToPayment = BigDecimal.ZERO;
}

