package mg.taxibrousse.services;

import mg.taxibrousse.entities.OrderEntity;

import java.math.BigDecimal;

public interface IShippingCalculator {

    BigDecimal calculate(OrderEntity order);
}
