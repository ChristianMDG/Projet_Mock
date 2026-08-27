package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IAnalyticsController;
import mg.taxibrousse.dto.shop.analytics.CustomerPatterns;
import mg.taxibrousse.dto.shop.analytics.RevenuePoint;
import mg.taxibrousse.dto.shop.analytics.TopProduct;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.services.IAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AnalyticsController implements IAnalyticsController {

    private final IAnalyticsService analyticsService;

    @Override
    public ResponseEntity<List<RevenuePoint>> getRevenue(LocalDate from, LocalDate to, String granularity) {
        IAnalyticsService.Granularity g = parseGranularity(granularity);
        return ResponseEntity.ok(analyticsService.getRevenueSeries(from, to, g));
    }

    @Override
    public ResponseEntity<List<TopProduct>> getTopProducts(LocalDate from, LocalDate to, int limit, String by) {
        IAnalyticsService.TopProductCriterion criterion = parseCriterion(by);
        return ResponseEntity.ok(analyticsService.getTopProducts(from, to, limit, criterion));
    }

    @Override
    public ResponseEntity<Map<OrderStatusEnum, Long>> getOrderStatusDistribution(LocalDate from, LocalDate to) {
        return ResponseEntity.ok(analyticsService.getOrderStatusDistribution(from, to));
    }

    @Override
    public ResponseEntity<CustomerPatterns> getCustomerPatterns(LocalDate from, LocalDate to) {
        return ResponseEntity.ok(analyticsService.getCustomerPatterns(from, to));
    }

    private IAnalyticsService.Granularity parseGranularity(String value) {
        String normalized = value != null ? value.trim().toLowerCase(Locale.ROOT) : "day";
        return switch (normalized) {
            case "week" -> IAnalyticsService.Granularity.WEEK;
            case "month" -> IAnalyticsService.Granularity.MONTH;
            default -> IAnalyticsService.Granularity.DAY;
        };
    }

    private IAnalyticsService.TopProductCriterion parseCriterion(String value) {
        String normalized = value != null ? value.trim().toLowerCase(Locale.ROOT) : "quantity";
        boolean isRevenue = "revenue".equals(normalized);
        return isRevenue ? IAnalyticsService.TopProductCriterion.REVENUE : IAnalyticsService.TopProductCriterion.QUANTITY;
    }
}
