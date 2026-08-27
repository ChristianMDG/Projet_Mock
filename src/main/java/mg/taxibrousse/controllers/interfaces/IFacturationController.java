package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.Facturation;
import mg.taxibrousse.models.Voyage;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/facturations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
public interface IFacturationController {

    @GetMapping
    ResponseEntity<List<Facturation>> getAllFacturations();

    @GetMapping("/{id}")
    ResponseEntity<Facturation> getFacturationById(@PathVariable Long id);

    @GetMapping("/reservation/{reservationId}")
    ResponseEntity<List<Facturation>> getFacturationsByReservation(@PathVariable Long reservationId);

    @GetMapping("/voyages")
    ResponseEntity<List<Voyage>> getVoyagesWithFacturationStatus(@RequestParam(required = false) LocalDate departureDate, @RequestParam(required = false) Long koperativeId);
}
