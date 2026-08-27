package mg.taxibrousse.dto.shop.analytics;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenuePoint(LocalDate period, BigDecimal revenue, Long orderCount) {
}
