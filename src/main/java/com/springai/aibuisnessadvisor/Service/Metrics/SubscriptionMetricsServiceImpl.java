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
    public SubscriptionMetrics computeSubscriptionMetrics(Long businessId, Instant start, Instant end, PlatformType platformType) {
        RequestOptions requestOptions = buildRequestOptions(businessId);

        Long totalSubscriptions = countTotalSubscriptions(requestOptions);
        Long activeSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.ACTIVE);
        Long trialingSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.TRIALING);
        Long pausedSubscriptions = countSubscriptionsByStatus(requestOptions, SubscriptionListParams.Status.PAUSED);

        Long newSubscriptions = countNewSubscriptions(requestOptions, start, end);
        Long canceledSubscriptions = countCanceledSubscriptions(requestOptions, start, end);

        BigDecimal mrr = computeMrr(requestOptions);
        BigDecimal arr = mrr.multiply(BigDecimal.valueOf(12));

        BigDecimal averageRevenuePerSubscriptions = activeSubscriptions > 0 ? mrr.divide(BigDecimal.valueOf(activeSubscriptions), 2, RoundingMode.HALF_UP)
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
        metrics.setAverageRevenuePerSubscription(averageRevenuePerSubscriptions);
        return metrics;
    }

    private Long countTotalSubscriptions(RequestOptions requestOptions) {
        SubscriptionListParams subscriptionListParams = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.ALL)
                .setLimit(100L)
                .build();
        long count = 0;
        try {
            for (Subscription sub : Subscription.list(subscriptionListParams, requestOptions).autoPagingIterable()) {
                count++;
            }
            return count;
        } catch (StripeException e) {
            throw new RuntimeException(e);
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

    private BigDecimal computeMrr(RequestOptions requestOptions) {
        SubscriptionListParams params = SubscriptionListParams.builder()
                .setStatus(SubscriptionListParams.Status.ACTIVE)
                .setLimit(100L)
                .build();

        BigDecimal mrr = BigDecimal.ZERO;

        try {
            for (Subscription sub :
                    Subscription.list(params, requestOptions).autoPagingIterable()) {

                if (sub.getItems() == null || sub.getItems().getData() == null) {System.out.println("item is null"); continue;}

                for (SubscriptionItem item : sub.getItems().getData()) {

                    if (item.getPrice() == null ||
                            item.getPrice().getRecurring() == null ||
                            item.getPrice().getUnitAmount() == null) {
                        continue;
                    }

                    long unitAmountCents = item.getPrice().getUnitAmount();
                    long quantity = item.getQuantity() != null ? item.getQuantity() : 1;

                    BigDecimal amount =
                            BigDecimal.valueOf(unitAmountCents)
                                    .multiply(BigDecimal.valueOf(quantity))
                                    .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);

                    String interval = item.getPrice().getRecurring().getInterval();

                    if ("month".equals(interval)) {
                        mrr = mrr.add(amount);
                    } else if ("year".equals(interval)) {
                        mrr = mrr.add(
                                amount.divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP)
                        );
                    }
                    System.out.println("    Current MRR: " + mrr);

                }
            }
            System.out.println("Final MRR: " + mrr);

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
