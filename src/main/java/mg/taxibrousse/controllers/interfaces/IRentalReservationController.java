package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.rental.RentalPaymentInitiateRequest;
import mg.taxibrousse.dto.rental.RentalReservationCreateRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.entities.RentalReservationEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/rental/reservations")
@CrossOrigin(origins = "*")
public interface IRentalReservationController {

    @PostMapping
    ResponseEntity<RentalReservationEntity> createReservation(Authentication authentication, @Valid @RequestBody RentalReservationCreateRequest request);

    @GetMapping("/{id}")
    ResponseEntity<RentalReservationEntity> getById(@PathVariable Long id);

    @GetMapping("/user/{userId}")
    ResponseEntity<List<RentalReservationEntity>> getByUser(@PathVariable Long userId, Authentication authentication);

    @PostMapping("/{id}/payment/initiate")
    ResponseEntity<PaymentInitiationResponse> initiatePayment(@PathVariable Long id, @Valid @RequestBody RentalPaymentInitiateRequest request) throws IOException, InterruptedException;

    @PostMapping("/{id}/payment/confirm")
    ResponseEntity<RentalReservationEntity> confirmPayment(@PathVariable Long id);

    @PostMapping("/{id}/payment/fail")
    ResponseEntity<RentalReservationEntity> failPayment(@PathVariable Long id, @RequestParam(required = false) String reason);
}
