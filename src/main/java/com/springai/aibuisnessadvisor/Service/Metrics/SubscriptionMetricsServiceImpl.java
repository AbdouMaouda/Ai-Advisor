package com.springai.aibuisnessadvisor.Service.Metrics;

import com.springai.aibuisnessadvisor.Model.Business;
import com.springai.aibuisnessadvisor.Model.PlatformType;
import com.springai.aibuisnessadvisor.Model.SubscriptionMetrics;
import com.springai.aibuisnessadvisor.Repositories.BusinessRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionItem;
import com.stripe.net.RequestOptions;
import com.stripe.param.SubscriptionListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
public class SubscriptionMetricsServiceImpl implements SubscriptionMetricsService {

    @Autowired
    private BusinessRepository businessRepository;

    @Value("${app.mode}")
    private String appMode;

    @Override
    public SubscriptionMetrics computeSubscriptionMetrics(
            Long businessId,
            Instant start,
            Instant end,
            PlatformType platformType) {

        System.out.println("\n=========== STRIPE SUBSCRIPTION METRICS DEBUG ===========");
        System.out.println("Business ID: " + businessId);
        System.out.println("Platform: " + platformType);
        System.out.println("Start: " + start);
        System.out.println("End: " + end);

        RequestOptions requestOptions = buildRequestOptions(businessId);

        Long totalSubscriptions = countTotalSubscriptions(requestOptions);
        Long activeSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.ACTIVE);
        Long trialingSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.TRIALING);
        Long pausedSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.PAUSED);

        Long newSubscriptions = countNewSubscriptions(requestOptions, start, end);
        Long canceledSubscriptions = countCanceledSubscriptions(requestOptions, start, end);

        System.out.println("\n--- STRIPE COUNTS ---");
        System.out.println("Total Subscriptions: " + totalSubscriptions);
        System.out.println("Active Subscriptions: " + activeSubscriptions);
        System.out.println("Trialing Subscriptions: " + trialingSubscriptions);
        System.out.println("Paused Subscriptions: " + pausedSubscriptions);
        System.out.println("New Subscriptions (period): " + newSubscriptions);
        System.out.println("Canceled Subscriptions (period): " + canceledSubscriptions);

        BigDecimal mrr = computeMrr(requestOptions);
        BigDecimal arr = mrr.multiply(BigDecimal.valueOf(12));

        System.out.println("\n--- FINAL FINANCIAL METRICS ---");
        System.out.println("Final MRR: " + mrr);
        System.out.println("Final ARR: " + arr);

        BigDecimal averageRevenuePerSubscription =
                activeSubscriptions > 0
                        ? mrr.divide(BigDecimal.valueOf(activeSubscriptions), 2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;

        SubscriptionMetrics metrics = new SubscriptionMetrics();
        metrics.setTotalSubscriptions(totalSubscriptions);
        metrics.setActiveSubscriptions(activeSubscriptions);
        metrics.setTrialingSubscriptions(trialingSubscriptions);
        metrics.setPausedSubscriptions(pausedSubscriptions);
        metrics.setNewSubscriptions(newSubscriptions);
        metrics.setCanceledSubscriptions(canceledSubscriptions);
        metrics.setMrr(mrr);
        metrics.setArr(arr);
        metrics.setAverageRevenuePerSubscription(averageRevenuePerSubscription);

        System.out.println("=========== END STRIPE METRICS DEBUG ===========\n");

        return metrics;
    }

    private Long countTotalSubscriptions(RequestOptions requestOptions) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.ALL)
                .setLimit(100L)
                .build();

        long count = 0;
        try {
            for (Subscription sub : Subscription.list(params, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count total subscriptions", e);
        }
    }

    private Long countSubscriptionsByStatus(RequestOptions requestOptions, SubscriptionListParams.Status status) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(status)
                .setLimit(100L)
                .build();

        long count = 0;
        try {
            for (Subscription sub : Subscription.list(params, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count subscriptions by status: " + status, e);
        }
    }

    private Long countNewSubscriptions(RequestOptions requestOptions, Instant start, Instant end) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.ALL)
                .setCreated(
                        SubscriptionListParams.Created.builder()
                                .setGte(start.getEpochSecond())
                                .setLte(end.getEpochSecond())
                                .build()
                )
                .setLimit(100L)
                .build();

        long count = 0;
        try {
            for (Subscription sub : Subscription.list(params, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count new subscriptions", e);
        }
    }

    private Long countCanceledSubscriptions(RequestOptions requestOptions, Instant start, Instant end) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.CANCELED)
                .setLimit(100L)
                .build();

        long count = 0;
        long startSeconds = start.getEpochSecond();
        long endSeconds = end.getEpochSecond();

        try {
            for (Subscription sub : Subscription.list(params, requestOptions).autoPagingIterable()) {
                Long canceledAt = sub.getCanceledAt();
                if (canceledAt != null && canceledAt >= startSeconds && canceledAt < endSeconds) {
                    count++;
                }
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to count canceled subscriptions", e);
        }
    }

    /**
     * FIXED for Stripe SDK 26+
     * getUnitAmountDecimal() returns BigDecimal (NOT String)
     */
    private BigDecimal computeMrr(RequestOptions requestOptions) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.ACTIVE)
                .setLimit(100L)
                .build();

        BigDecimal mrr = BigDecimal.ZERO;

        try {
            for (Subscription sub : Subscription.list(params, requestOptions).autoPagingIterable()) {

                System.out.println("\n[MRR] Subscription ID: " + sub.getId());
                System.out.println("[MRR] Status: " + sub.getStatus());

                if (sub.getItems() == null || sub.getItems().getData() == null) {
                    System.out.println("[MRR] Items are NULL -> skipping");
                    continue;
                }

                for (SubscriptionItem item : sub.getItems().getData()) {

                    if (item.getPrice() == null) {
                        System.out.println("[MRR] Price is NULL -> skipping item");
                        continue;
                    }

                    if (item.getPrice().getRecurring() == null) {
                        System.out.println("[MRR] Non-recurring price -> skipping");
                        continue;
                    }

                    String interval = item.getPrice().getRecurring().getInterval();
                    long quantity = item.getQuantity() != null ? item.getQuantity() : 1;

                    Long unitAmountCents = item.getPrice().getUnitAmount();
                    BigDecimal unitAmountDecimal = item.getPrice().getUnitAmountDecimal();

                    BigDecimal amount;

                    if (unitAmountCents != null) {
                        amount = BigDecimal.valueOf(unitAmountCents)
                                .multiply(BigDecimal.valueOf(quantity))
                                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);

                        System.out.println("[MRR] Using unit_amount (cents): " + unitAmountCents);
                    }
                    else if (unitAmountDecimal != null) {
                        amount = unitAmountDecimal
                                .multiply(BigDecimal.valueOf(quantity))
                                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);

                        System.out.println("[MRR] Using unit_amount_decimal: " + unitAmountDecimal);
                    }
                    else {
                        System.out.println("[MRR] WARNING: No price amount found (tiered/metered pricing?)");
                        continue;
                    }

                    BigDecimal monthlyAmount;

                    if ("month".equals(interval)) {
                        monthlyAmount = amount;
                    } else if ("year".equals(interval)) {
                        monthlyAmount = amount.divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
                    } else {
                        System.out.println("[MRR] Unsupported interval: " + interval);
                        continue;
                    }

                    mrr = mrr.add(monthlyAmount);

                    System.out.println("[MRR] Interval: " + interval +
                            " | Quantity: " + quantity +
                            " | Monthly Contribution: " + monthlyAmount.setScale(2, RoundingMode.HALF_UP) +
                            " | Running MRR: " + mrr.setScale(2, RoundingMode.HALF_UP));
                }
            }

            System.out.println("\n[MRR] FINAL COMPUTED MRR: " + mrr.setScale(2, RoundingMode.HALF_UP));
            return mrr.setScale(2, RoundingMode.HALF_UP);

        } catch (StripeException e) {
            throw new RuntimeException("Failed to compute MRR", e);
        }
    }

    private RequestOptions buildRequestOptions(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id " + businessId));

        String stripeAccountId = business.getPlatformAccounts().get(PlatformType.STRIPE);

        if (stripeAccountId != null) {
            System.out.println("Using Stripe Connected Account: " + stripeAccountId);
            return RequestOptions.builder()
                    .setStripeAccount(stripeAccountId)
                    .build();
        } else if ("dev".equals(appMode)) {
            System.out.println("DEV MODE: Using platform Stripe key");
            return RequestOptions.builder().build();
        } else {
            throw new IllegalStateException("Stripe not connected for this business");
        }
    }
}
