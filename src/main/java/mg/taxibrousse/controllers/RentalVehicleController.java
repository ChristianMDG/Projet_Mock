package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IRentalVehicleController;
import mg.taxibrousse.entities.RentalVehicleEntity;
import mg.taxibrousse.services.RentalVehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RentalVehicleController implements IRentalVehicleController {

    private final RentalVehicleService service;

    @Override
    public ResponseEntity<List<RentalVehicleEntity>> getAllAvailable() {
        return ResponseEntity.ok(service.findAllAvailable());
    }

    @Override
    public ResponseEntity<List<RentalVehicleEntity>> getByCategory(String category) {
        return ResponseEntity.ok(service.findByCategory(category));
    }

    @Override
    public ResponseEntity<RentalVehicleEntity> getById(Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
