package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IFacturationController;
import mg.taxibrousse.models.Facturation;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.services.IFacturationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class FacturationController implements IFacturationController {

    private final IFacturationService facturationService;

    @Override
    public ResponseEntity<List<Facturation>> getAllFacturations() {
        return ResponseEntity.ok(facturationService.findAll());
    }

    @Override
    public ResponseEntity<Facturation> getFacturationById(@PathVariable Long id) {
        return facturationService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Facturation>> getFacturationsByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(facturationService.findByReservationId(reservationId));
    }

    @Override
    public ResponseEntity<List<Voyage>> getVoyagesWithFacturationStatus(@RequestParam(required = false) LocalDate departureDate, @RequestParam(required = false) Long koperativeId) {
        return ResponseEntity.ok(facturationService.findVoyagesWithFacturationStatus(departureDate, koperativeId));
    }
}
