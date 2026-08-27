package mg.taxibrousse.services;

import mg.taxibrousse.dto.rental.RentalPaymentInitiateRequest;
import mg.taxibrousse.dto.rental.RentalReservationCreateRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.entities.RentalReservationEntity;

import java.io.IOException;
import java.util.List;

public interface IRentalReservationService {

    List<RentalReservationEntity> findByUserId(Long userId);

    RentalReservationEntity findByIdOrThrow(Long id);

    RentalReservationEntity createReservation(RentalReservationCreateRequest request, Long callerUserId);

    PaymentInitiationResponse initiatePayment(Long id, RentalPaymentInitiateRequest request) throws IOException, InterruptedException;

    RentalReservationEntity confirm(Long id);

    RentalReservationEntity failPayment(Long id, String reason);
}
