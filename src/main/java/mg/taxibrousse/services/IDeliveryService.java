package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.DeliveryCalculationRequest;
import mg.taxibrousse.dto.shop.DeliveryCalculationResponse;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.models.DeliveryZone;

import java.math.BigDecimal;
import java.util.List;

public interface IDeliveryService {

    List<DeliveryZone> listActiveZones();

    DeliveryZone createZone(DeliveryZone request);

    DeliveryZone updateZone(Long id, DeliveryZone request);

    void deleteZone(Long id);

    DeliveryCalculationResponse calculate(DeliveryCalculationRequest request);

    BigDecimal calculateForOrder(OrderEntity order);
}
