package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.ProductPerformance;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.springai.aibuisnessadvisor.Service.StripeRequestOptionsBuilder;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceLineItem;
import com.stripe.net.RequestOptions;
import com.stripe.param.InvoiceCreateParams;
import com.stripe.param.InvoiceListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductPerformanceServiceImpl implements ProductPerformanceService {
    private final StripeRequestOptionsBuilder stripeRequestOptionsBuilder;

    public ProductPerformanceServiceImpl(StripeRequestOptionsBuilder stripeRequestOptionsBuilder) {
        this.stripeRequestOptionsBuilder = stripeRequestOptionsBuilder;
    }


    @Override
    public List<ProductPerformance> getProductPerformanceService(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions = stripeRequestOptionsBuilder.createRequestOptions(businessId);

        Map<String, ProductData> productMap = new HashMap<>();//store name and the product Data

        InvoiceListParams params = InvoiceListParams.builder()
                .setCreated(InvoiceListParams.Created.builder()
                        .setGte(start.getEpochSecond())
                        .setLte(end.getEpochSecond())
                        .build()
                )
                .setStatus(InvoiceListParams.Status.PAID)//Get all the paid Invoices
                .setLimit(100L)
                .build();

//For each Product:extract Name,quantity,price,total revenue

        try {
            for (Invoice invoice : Invoice.list(params, requestOptions).autoPagingIterable()) {
                String customerId = invoice.getCustomer();

                if (invoice.getLines() != null && invoice.getLines().getData() != null) {
                    for (InvoiceLineItem lineItem : invoice.getLines().getData()) {
                        processLineItem(lineItem, customerId, productMap);
                    }
                }
            }

            //convert to productPerformance Object

            List<ProductPerformance> performances = productMap.entrySet().stream()
                    .map(entry -> {
                        ProductData data = entry.getValue();
                        data.productId = entry.getKey();
                        return convertToProductPerformance(data, businessId);
                    })
                    .sorted()
                    .collect(Collectors.toList());

            return performances;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    private void processLineItem(InvoiceLineItem lineItem, String customerId, Map<String, ProductData> productMap) {
        String productId = null;
        String productName = null;
        String productDescription = null;

        if (lineItem.getPrice() != null) {
            productId = lineItem.getPrice().getProduct();

            if (lineItem.getPrice().getProduct() != null) {
                if (lineItem.getPrice().getProductObject() != null) {
                    productName = lineItem.getPrice().getProductObject().getName();
                    productDescription = lineItem.getPrice().getProductObject().getDescription();
                } else {
                    productName = "Product " + lineItem.getPrice().getProduct();
                }
            }

            if (productName == null && lineItem.getDescription() != null) {
                productName = lineItem.getDescription();
            }
        }

        if (productId == null) {
            return;
        }
        ProductData data = productMap.computeIfAbsent(productId, k -> new ProductData());

        if (productName != null) {
            data.productName = productName;
        }
        if (productDescription != null) {
            data.productDescription = productDescription;
        }
        Long quantity = lineItem.getQuantity() != null ? lineItem.getQuantity() : 0L;
        Long amountCents = lineItem.getAmount() != null ? lineItem.getAmount() : 0L;
        BigDecimal amount = BigDecimal.valueOf(amountCents)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        data.revenue = data.revenue.add(amount);
        data.quantity += quantity;
        data.customers.add(customerId);
    }


    private ProductPerformance convertToProductPerformance(ProductData data, Long businessId) {
        ProductPerformance performance = new ProductPerformance();

        performance.setProductId(data.productId);
        performance.setProductName(data.productName != null ? data.productName : "Unknown Product");
        performance.setProductDescription(data.productDescription);
        performance.setRevenue(data.revenue);
        performance.setQuantity(data.quantity);
        performance.setNumberOfCustomers(data.customers.size());

        if (data.quantity > 0) {
            BigDecimal averagePrice = data.revenue.divide(
                    BigDecimal.valueOf(data.quantity),
                    2,
                    RoundingMode.HALF_UP
            );
            performance.setAveragePricePerUnit(averagePrice);
        }

        performance.setRevenueGrowth(BigDecimal.ZERO);

        return performance;
    }



    private static class ProductData {
        String productId;
        String productName;
        String productDescription;
        BigDecimal revenue = BigDecimal.ZERO;
        Long quantity = 0L;
        Set<String> customers = new HashSet<>();  // Unique customers
    }


}
