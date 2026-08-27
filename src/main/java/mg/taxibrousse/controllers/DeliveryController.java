package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IDeliveryController;
import mg.taxibrousse.dto.shop.DeliveryCalculationRequest;
import mg.taxibrousse.dto.shop.DeliveryCalculationResponse;
import mg.taxibrousse.models.DeliveryZone;
import mg.taxibrousse.services.IDeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DeliveryController implements IDeliveryController {

    private final IDeliveryService deliveryService;

    @Override
    public ResponseEntity<List<DeliveryZone>> listZones() {
        return ResponseEntity.ok(deliveryService.listActiveZones());
    }

    @Override
    public ResponseEntity<DeliveryZone> createZone(DeliveryZone request) {
        return ResponseEntity.ok(deliveryService.createZone(request));
    }

    @Override
    public ResponseEntity<DeliveryZone> updateZone(Long id, DeliveryZone request) {
        return ResponseEntity.ok(deliveryService.updateZone(id, request));
    }

    @Override
    public ResponseEntity<Void> deleteZone(Long id) {
        deliveryService.deleteZone(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<DeliveryCalculationResponse> calculate(DeliveryCalculationRequest request) {
        return ResponseEntity.ok(deliveryService.calculate(request));
    }
}
