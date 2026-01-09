package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.CustomerMetrics;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.net.RequestOptions;
import com.stripe.param.CustomerListParams;
import com.stripe.param.InvoiceListParams;
import com.stripe.param.SubscriptionListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;

@Service
public class CustomerServiceImpl implements CustomerMetricsService {

    @Value("${app.mode}")
    private String appMode;


    @Autowired
    BusinessRepository businessRepository;



    @Override
    public CustomerMetrics computeCustomerMetrics(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions=buildRequestOptions(businessId);

        long totalCustomers=computeTotalCustomers(requestOptions,end,platformType);
        long active=computeTotalActiveCustomersByPeriod(requestOptions,start,end,platformType);
        long newCustomers=computeNumberOfNewCustomers(requestOptions,start,end,platformType);
        long churnedCustomers=computeTotalChurnedCustomersByPeriod(requestOptions,start,end,platformType);

        CustomerMetrics metrics = new CustomerMetrics();
        metrics.setTotalCustomers(totalCustomers);
        metrics.setActiveCustomers(active);
        metrics.setNewCustomers(newCustomers);
        metrics.setChurnedCustomers(churnedCustomers);

        return metrics;
    }




    private Long computeTotalCustomers(RequestOptions requestOptions, Instant end, PlatformType platformType) {

        try {
            CustomerListParams params = CustomerListParams.builder()
                    .setCreated(//Sets a filter on the created date of customers
                            CustomerListParams.Created.builder()
                                    .setLte(end.getEpochSecond())//lower than or equals
                                    .build()
                    )
                    .setLimit(100L)
                    .build();

            long count = 0;

            Iterable<Customer> customers = (requestOptions != null)
                    ? Customer.list(params, requestOptions).autoPagingIterable()
                    : Customer.list(params).autoPagingIterable();

            for (Customer customer : customers) {
                count++;
            }

            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to get total customers for " + platformType.name());
        }

    }

    private Long computeNumberOfNewCustomers(RequestOptions requestOptions, Instant start, Instant end, PlatformType platformType) {


        try {
            CustomerListParams params = CustomerListParams.builder().
                    setCreated(//Sets a filter on the created date of customers
                            CustomerListParams.Created.builder()
                                    .setLte(end.getEpochSecond())//lower than or equals
                                    .setGte(start.getEpochSecond())
                                    .build()
                    )
                    .setLimit(100L)
                    .build();

            long count = 0L;


            for (Customer customer : Customer.list(params, requestOptions).autoPagingIterable()) {
                count++;
            }

            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to get total customers for " + platformType.name());
        }
    }


    private Long computeTotalActiveCustomersByPeriod(RequestOptions requestOptions, Instant start, Instant end, PlatformType platformType) {
        //Need to get active subscription
        //Active user is a customer that has at least one active subscription


        Set<String> activeCustomers = new HashSet<>();
        try {
            SubscriptionListParams params = SubscriptionListParams.builder()
                    .setStatus(SubscriptionListParams.Status.ACTIVE)
                    .setCreated(//Sets a filter on the created date of customers
                            SubscriptionListParams.Created.builder()
                                    .setGte(start.getEpochSecond())
                                    .build()
                    )
                    .setLimit(100L)
                    .build();

            Iterable<Subscription> subscriptions =
                    requestOptions != null
                            ? Subscription.list(params, requestOptions).autoPagingIterable()
                            : Subscription.list(params).autoPagingIterable();

            for (Subscription subscription : subscriptions)
                activeCustomers.add(subscription.getCustomer());

        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
        return (long) activeCustomers.size();
    }

    private Long computeTotalChurnedCustomersByPeriod(RequestOptions requestOptions, Instant start, Instant end, PlatformType platformType) {

        try {
            Set<String> churnedCustomers = new HashSet<>();

            // Get ALL canceled subscriptions
            SubscriptionListParams canceledParams = SubscriptionListParams.builder()
                    .setStatus(SubscriptionListParams.Status.CANCELED)
                    .setLimit(100L)
                    .build();

            long startSeconds = start.getEpochSecond();
            long endSeconds = end.getEpochSecond();

            for (Subscription sub : Subscription.list(canceledParams, requestOptions).autoPagingIterable()) {
                Long canceledAt = sub.getCanceledAt();

                if (canceledAt != null && canceledAt >= startSeconds && canceledAt < endSeconds) {
                    churnedCustomers.add(sub.getCustomer());
                }
            }

            SubscriptionListParams activeParams = SubscriptionListParams.builder()
                    .setStatus(SubscriptionListParams.Status.ACTIVE)
                    .setLimit(100L)
                    .build();

            Set<String> stillActive = new HashSet<>();
            for (Subscription sub : Subscription.list(activeParams, requestOptions).autoPagingIterable()) {
                stillActive.add(sub.getCustomer());
            }

            churnedCustomers.removeAll(stillActive);

            return (long) churnedCustomers.size();

        } catch (StripeException e) {
            throw new RuntimeException("Failed to get churned customers", e);
        }
    }


    private RequestOptions buildRequestOptions(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        String stripeAccountId = business.getPlatformAccounts().get(PlatformType.STRIPE);

        if (stripeAccountId != null) {
            return RequestOptions.builder()
                    .setStripeAccount(stripeAccountId)
                    .build();
        } else if ("dev".equals(appMode)) {
            return RequestOptions.builder().build();  // Empty options for dev
        } else {
            throw new IllegalStateException("Stripe not connected for this business");
        }
    }














}