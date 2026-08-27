package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.services.IDeliveryService;
import mg.taxibrousse.services.IShippingCalculator;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Zone-based shipping calculator backed by the delivery service. Takes precedence
 * over {@link DefaultShippingCalculator}. Falls back to zero when the order has no
 * resolvable delivery context (no ville/fokotany/method).
 */
@Primary
@Component
@RequiredArgsConstructor
public class DeliveryShippingCalculator implements IShippingCalculator {

    private final IDeliveryService deliveryService;

    @Override
    public BigDecimal calculate(OrderEntity order) {
        BigDecimal fee = deliveryService.calculateForOrder(order);
        return fee != null ? fee : BigDecimal.ZERO;
    }
}
