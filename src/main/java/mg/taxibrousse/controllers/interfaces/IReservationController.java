package mg.taxibrousse.controllers.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.PaymentResponse;
import mg.taxibrousse.dto.ReservationSearchRequest;
import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.models.Reservation;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IReservationController {

    @GetMapping("/voyage/{voyageId}")
    ResponseEntity<List<Reservation>> getReservationsByVoyage(@PathVariable Long voyageId);

    @PostMapping
    ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation);

    @GetMapping("/{id}")
    ResponseEntity<Reservation> getReservation(@PathVariable Long id);

    @PutMapping("/{id}")
    ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteReservation(@PathVariable Long id);

    @PatchMapping("/{id}/cancel")
    ResponseEntity<Reservation> cancelReservation(
            @PathVariable Long id,
            @RequestParam ReservationStatusEnum status
    );

    @PostMapping("/{id}/payment")
    ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Long id,
            @RequestBody PaymentRequest paymentRequest
    );

    @GetMapping("/voyageur/{voyageurId}")
    ResponseEntity<List<Reservation>> getReservationsByVoyageur(@PathVariable Long voyageurId);

    @PostMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<Page<Reservation>> searchReservations(@RequestBody ReservationSearchRequest request);

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<Reservation> confirmReservation(@PathVariable Long id);

    @PatchMapping("/{id}/cancel-by-operator")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<Reservation> cancelReservationByOperator(@PathVariable Long id);

    @GetMapping("/guest")
    ResponseEntity<List<Reservation>> getGuestReservations(
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String idNumber
    );

    @PostMapping("/confirm-without-voyageur")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<Reservation> confirmReservationWithoutVoyageur(@RequestBody ReservationWithoutVoyageurRequest request);

    @GetMapping("/voyage/{voyageId}/active")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<List<Reservation>> getActiveReservationsByVoyage(@PathVariable Long voyageId);

    @PatchMapping("/{id}/voyageur")
    ResponseEntity<Reservation> attachVoyageur(@PathVariable Long id, @RequestParam Long voyageurId);
}
