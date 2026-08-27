package mg.taxibrousse.controllers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IReservationController;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.PaymentResponse;
import mg.taxibrousse.dto.ReservationSearchRequest;
import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.models.Facturation;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.services.IReservationService;

@RestController
@RequiredArgsConstructor
public class ReservationController implements IReservationController {

    private final IReservationService reservationService;

    @Override
    public ResponseEntity<List<Reservation>> getReservationsByVoyage(@PathVariable Long voyageId) {
        return ResponseEntity.ok(reservationService.findByVoyageId(voyageId));
    }

    @Override
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation saved = reservationService.save(reservation);
        return ResponseEntity.ok(saved);
    }

    @Override
    public ResponseEntity<Reservation> getReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.findById(id);
        if (reservation != null) {
            return ResponseEntity.ok(reservation);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        reservation.setId(id);
        Reservation updated = reservationService.save(reservation);
        return ResponseEntity.ok(updated);
    }

    @Override
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id, @RequestParam ReservationStatusEnum status) {
        try {
            Reservation cancelledReservation = reservationService.cancelReservation(id, status);
            return ResponseEntity.ok(cancelledReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Override
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable Long id, @RequestBody PaymentRequest paymentRequest) {
        try {
            if (!PaymentRequest.isValidAmount(paymentRequest)) {
                return ResponseEntity.badRequest().body(createErrorResponse("payment_amount_required"));
            }

            if (!PaymentRequest.isValidReservationId(paymentRequest, id)) {
                return ResponseEntity.badRequest().body(createErrorResponse("payment_id_mismatch"));
            }

            var updatedReservation = reservationService.processPayment(id, paymentRequest.getAmount());
            var remainingAmount = Optional.ofNullable(updatedReservation.getFacturation()).map(Facturation::getRemainingAmount).orElse(updatedReservation.getTotalAmount());

            var message = remainingAmount.compareTo(BigDecimal.ZERO) <= 0 ? "payment_completed_successfully" : "payment_partial_success";

            return ResponseEntity.ok(createSuccessResponse(updatedReservation, remainingAmount, message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("reservation_not_found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("payment_processing_failed"));
        }
    }

    private PaymentResponse createErrorResponse(String message) {
        var response = new PaymentResponse();
        response.setSuccess(false);
        response.setMessage(message);
        response.setRemainingAmount(BigDecimal.ZERO);
        return response;
    }

    private PaymentResponse createSuccessResponse(Reservation reservation, BigDecimal remainingAmount, String message) {
        var response = new PaymentResponse();
        response.setSuccess(true);
        response.setReservation(reservation);
        response.setRemainingAmount(remainingAmount);
        response.setMessage(message);
        return response;
    }

    @Override
    public ResponseEntity<List<Reservation>> getReservationsByVoyageur(@PathVariable Long voyageurId) {
        return ResponseEntity.ok(reservationService.findByVoyageurId(voyageurId));
    }

    @Override
    public ResponseEntity<Page<Reservation>> searchReservations(@RequestBody ReservationSearchRequest request) {
        var pageable = PageRequest.of(request.getPage(), request.getSize());
        Page<Reservation> reservations = reservationService.findAllPageable(request.getStatus(), request.getPhoneNumber(), request.getBookingReference(), request.getPaymentStatus(), pageable);
        return ResponseEntity.ok(reservations);
    }

    @Override
    public ResponseEntity<Reservation> confirmReservation(@PathVariable Long id) {
        try {
            Reservation confirmedReservation = reservationService.confirmReservation(id);
            return ResponseEntity.ok(confirmedReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Override
    public ResponseEntity<Reservation> cancelReservationByOperator(@PathVariable Long id) {
        try {
            Reservation cancelledReservation = reservationService.cancelReservation(id, ReservationStatusEnum.CANCELLED_BY_OPERATOR);
            return ResponseEntity.ok(cancelledReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Override
    public ResponseEntity<List<Reservation>> getGuestReservations(@RequestParam(required = false) String phoneNumber, @RequestParam(required = false) String idNumber) {
        List<Reservation> reservations = reservationService.findByPhoneNumberOrIdNumber(phoneNumber, idNumber);
        return ResponseEntity.ok(reservations);
    }

    @Override
    public ResponseEntity<Reservation> confirmReservationWithoutVoyageur(@RequestBody ReservationWithoutVoyageurRequest request) {
        Reservation reservation = reservationService.confirmReservationWithoutVoyageur(request);
        return ResponseEntity.ok(reservation);
    }

    @Override
    public ResponseEntity<List<Reservation>> getActiveReservationsByVoyage(@PathVariable Long voyageId) {
        return ResponseEntity.ok(reservationService.findActiveByVoyageId(voyageId));
    }

    @Override
    public ResponseEntity<Reservation> attachVoyageur(@PathVariable Long id, @RequestParam Long voyageurId) {
        return ResponseEntity.ok(reservationService.attachVoyageur(id, voyageurId));
    }

}
