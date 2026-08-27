package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.analytics.CustomerPatterns;
import mg.taxibrousse.dto.shop.analytics.RevenuePoint;
import mg.taxibrousse.dto.shop.analytics.TopProduct;
import mg.taxibrousse.entities.enums.OrderStatusEnum;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IAnalyticsService {

    enum Granularity {
        DAY, WEEK, MONTH
    }

    enum TopProductCriterion {
        QUANTITY, REVENUE
    }

    List<RevenuePoint> getRevenueSeries(LocalDate from, LocalDate to, Granularity granularity);

    List<TopProduct> getTopProducts(LocalDate from, LocalDate to, int limit, TopProductCriterion criterion);

    Map<OrderStatusEnum, Long> getOrderStatusDistribution(LocalDate from, LocalDate to);

    CustomerPatterns getCustomerPatterns(LocalDate from, LocalDate to);
}
