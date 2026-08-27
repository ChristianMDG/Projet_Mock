package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.services.ITaxCalculator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Default stub tax calculator. Returns zero until a real tax engine is wired.
 * Replace by a jurisdiction-aware implementation when tax rules are specified.
 */
@Component
@RequiredArgsConstructor
public class DefaultTaxCalculator implements ITaxCalculator {

    @Override
    public BigDecimal calculate(OrderEntity order) {
        return BigDecimal.ZERO;
    }
}
