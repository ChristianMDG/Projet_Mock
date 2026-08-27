package mg.taxibrousse.dto.shop.analytics;

import java.math.BigDecimal;

public record TopProduct(Long productId, String sku, String name, Long totalQuantity, BigDecimal totalRevenue) {
}
