package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.entities.RentalVehicleEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rental/vehicles")
@CrossOrigin(origins = "*")
public interface IRentalVehicleController {

    @GetMapping
    ResponseEntity<List<RentalVehicleEntity>> getAllAvailable();

    @GetMapping("/category/{category}")
    ResponseEntity<List<RentalVehicleEntity>> getByCategory(@PathVariable String category);

    @GetMapping("/{id}")
    ResponseEntity<RentalVehicleEntity> getById(@PathVariable Long id);
}
