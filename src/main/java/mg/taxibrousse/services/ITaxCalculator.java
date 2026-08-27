package mg.taxibrousse.services;

import mg.taxibrousse.entities.OrderEntity;

import java.math.BigDecimal;

public interface ITaxCalculator {

    BigDecimal calculate(OrderEntity order);
}
