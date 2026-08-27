package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.DeliveryCalculationRequest;
import mg.taxibrousse.dto.shop.DeliveryCalculationResponse;
import mg.taxibrousse.models.DeliveryZone;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IDeliveryController {

    @GetMapping("/zones")
    ResponseEntity<List<DeliveryZone>> listZones();

    @PostMapping("/zones")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<DeliveryZone> createZone(@Valid @RequestBody DeliveryZone request);

    @PutMapping("/zones/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<DeliveryZone> updateZone(@PathVariable Long id, @Valid @RequestBody DeliveryZone request);

    @DeleteMapping("/zones/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteZone(@PathVariable Long id);

    @PostMapping("/calculate")
    ResponseEntity<DeliveryCalculationResponse> calculate(@Valid @RequestBody DeliveryCalculationRequest request);
}
