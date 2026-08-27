package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.services.IShippingCalculator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Default stub shipping calculator. Returns zero until delivery zones are wired.
 * Will be replaced in Task 13 (Delivery and Shipping API).
 */
@Component
@RequiredArgsConstructor
public class DefaultShippingCalculator implements IShippingCalculator {

    @Override
    public BigDecimal calculate(OrderEntity order) {
        return BigDecimal.ZERO;
    }
}
