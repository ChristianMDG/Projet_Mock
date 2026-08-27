package mg.taxibrousse.dto.shop.analytics;

import java.math.BigDecimal;

public record CustomerPatterns(Long newCustomers, Long returningCustomers, BigDecimal newCustomerRevenue, BigDecimal returningCustomerRevenue) {
}
