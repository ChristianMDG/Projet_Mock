package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.shop.analytics.CustomerPatterns;
import mg.taxibrousse.dto.shop.analytics.RevenuePoint;
import mg.taxibrousse.dto.shop.analytics.TopProduct;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.services.IAnalyticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService implements IAnalyticsService {

    private static final List<OrderStatusEnum> CONFIRMED = List.of(OrderStatusEnum.PROCESSING, OrderStatusEnum.SHIPPED, OrderStatusEnum.DELIVERED);

    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getRevenueSeries(LocalDate from, LocalDate to, Granularity granularity) {
        Range range = resolveRange(from, to);
        String truncUnit = toTruncUnit(granularity);
        String sql = "SELECT CAST(date_trunc(:unit, o.created_at) AS DATE) AS period, " + "       COALESCE(SUM(o.total), 0) AS revenue, " + "       COUNT(o.id) AS order_count " + "FROM shop_order o "
                + "WHERE o.status IN ('PROCESSING','SHIPPED','DELIVERED') " + "  AND o.created_at >= :fromTs AND o.created_at < :toTs " + "GROUP BY date_trunc(:unit, o.created_at) "
                + "ORDER BY date_trunc(:unit, o.created_at) ASC";

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(sql)
                .setParameter("unit", truncUnit)
                .setParameter("fromTs", Timestamp.valueOf(range.fromTs()))
                .setParameter("toTs", Timestamp.valueOf(range.toTs()))
                .getResultList();

        List<RevenuePoint> points = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            LocalDate period = toLocalDate(row[0]);
            BigDecimal revenue = toBigDecimal(row[1]);
            Long orderCount = toLong(row[2]);
            points.add(new RevenuePoint(period, revenue, orderCount));
        }
        return points;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopProduct> getTopProducts(LocalDate from, LocalDate to, int limit, TopProductCriterion criterion) {
        Range range = resolveRange(from, to);
        int effectiveLimit = limit > 0 ? Math.min(limit, 100) : 10;
        String orderByExpr = criterion == TopProductCriterion.REVENUE ? "SUM(oi.lineTotal) DESC" : "SUM(oi.quantity) DESC";

        String jpql = "SELECT oi.product.id, oi.product.sku, oi.product.name, " + "       COALESCE(SUM(oi.quantity), 0L), COALESCE(SUM(oi.lineTotal), 0) " + "FROM OrderItem oi "
                + "WHERE oi.order.status IN :statuses " + "  AND oi.order.createdAt >= :fromTs AND oi.order.createdAt < :toTs " + "  AND oi.product IS NOT NULL "
                + "GROUP BY oi.product.id, oi.product.sku, oi.product.name " + "ORDER BY " + orderByExpr;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createQuery(jpql)
                .setParameter("statuses", CONFIRMED)
                .setParameter("fromTs", range.fromTs())
                .setParameter("toTs", range.toTs())
                .setMaxResults(effectiveLimit)
                .getResultList();

        List<TopProduct> out = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            out.add(new TopProduct(toLong(row[0]), (String) row[1], (String) row[2], toLong(row[3]), toBigDecimal(row[4])));
        }
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<OrderStatusEnum, Long> getOrderStatusDistribution(LocalDate from, LocalDate to) {
        Range range = resolveRange(from, to);
        String jpql = "SELECT o.status, COUNT(o.id) FROM ShopOrder o " + "WHERE o.createdAt >= :fromTs AND o.createdAt < :toTs " + "GROUP BY o.status";

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createQuery(jpql).setParameter("fromTs", range.fromTs()).setParameter("toTs", range.toTs()).getResultList();

        Map<OrderStatusEnum, Long> result = new EnumMap<>(OrderStatusEnum.class);
        for (OrderStatusEnum status : OrderStatusEnum.values()) {
            result.put(status, 0L);
        }
        for (Object[] row : rows) {
            result.put((OrderStatusEnum) row[0], toLong(row[1]));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerPatterns getCustomerPatterns(LocalDate from, LocalDate to) {
        Range range = resolveRange(from, to);

        // Per-user: min(createdAt) over all confirmed orders; sum(total) over confirmed orders in window.
        String sql = "WITH user_first AS ( " + "  SELECT o.user_account_id AS uid, MIN(o.created_at) AS first_confirmed " + "  FROM shop_order o "
                + "  WHERE o.status IN ('PROCESSING','SHIPPED','DELIVERED') " + "    AND o.user_account_id IS NOT NULL " + "  GROUP BY o.user_account_id " + "), window_orders AS ( "
                + "  SELECT o.user_account_id AS uid, o.total AS total " + "  FROM shop_order o " + "  WHERE o.status IN ('PROCESSING','SHIPPED','DELIVERED') "
                + "    AND o.user_account_id IS NOT NULL " + "    AND o.created_at >= :fromTs AND o.created_at < :toTs " + ") " + "SELECT "
                + "  COUNT(DISTINCT CASE WHEN uf.first_confirmed >= :fromTs THEN wo.uid END) AS new_customers, "
                + "  COUNT(DISTINCT CASE WHEN uf.first_confirmed <  :fromTs THEN wo.uid END) AS returning_customers, "
                + "  COALESCE(SUM(CASE WHEN uf.first_confirmed >= :fromTs THEN wo.total ELSE 0 END), 0) AS new_revenue, "
                + "  COALESCE(SUM(CASE WHEN uf.first_confirmed <  :fromTs THEN wo.total ELSE 0 END), 0) AS returning_revenue " + "FROM window_orders wo " + "JOIN user_first uf ON uf.uid = wo.uid";

        Object[] row = (Object[]) entityManager.createNativeQuery(sql)
                .setParameter("fromTs", Timestamp.valueOf(range.fromTs()))
                .setParameter("toTs", Timestamp.valueOf(range.toTs()))
                .getSingleResult();

        return new CustomerPatterns(toLong(row[0]), toLong(row[1]), toBigDecimal(row[2]), toBigDecimal(row[3]));
    }

    private Range resolveRange(LocalDate from, LocalDate to) {
        LocalDate effectiveTo = to != null ? to : LocalDate.now();
        LocalDate effectiveFrom = from != null ? from : effectiveTo.minusDays(30);
        boolean validRange = !effectiveFrom.isAfter(effectiveTo);
        if (!validRange) {
            throw new IllegalArgumentException("'from' must not be after 'to'");
        }
        LocalDateTime fromTs = effectiveFrom.atStartOfDay();
        LocalDateTime toTs = effectiveTo.plusDays(1).atStartOfDay();
        return new Range(fromTs, toTs);
    }

    private String toTruncUnit(Granularity granularity) {
        Granularity g = granularity != null ? granularity : Granularity.DAY;
        return switch (g) {
            case WEEK -> "week";
            case MONTH -> "month";
            case DAY -> "day";
        };
    }

    private Long toLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Number n) {
            return n.longValue();
        }
        return Long.parseLong(value.toString());
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        if (value instanceof Number n) {
            return BigDecimal.valueOf(n.doubleValue());
        }
        return new BigDecimal(value.toString());
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof Date d) {
            return d.toLocalDate();
        }
        if (value instanceof java.util.Date d) {
            return new Date(d.getTime()).toLocalDate();
        }
        if (value instanceof LocalDate ld) {
            return ld;
        }
        if (value instanceof LocalDateTime ldt) {
            return ldt.toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }

    private record Range(LocalDateTime fromTs, LocalDateTime toTs) {
    }
}
