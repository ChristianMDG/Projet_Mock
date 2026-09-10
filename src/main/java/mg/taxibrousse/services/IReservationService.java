package mg.taxibrousse.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.models.Reservation;

public interface IReservationService extends IBaseService {

    Reservation save(Reservation reservation);

    Reservation findById(Long id);

    List<Reservation> findByVoyageId(Long voyageId);

    List<Reservation> findActiveByVoyageId(Long voyageId);

    void deleteById(Long id);

    Reservation cancelReservation(Long id, ReservationStatusEnum cancelStatus);

    boolean isSeatAvailable(Long voyageId, String seatNumber);

    Reservation processPayment(Long reservationId, BigDecimal amount);

    List<Reservation> findByVoyageurId(Long voyageurId);

    Page<Reservation> findAllPageable(String status, String phoneNumber, String bookingReference, String paymentStatus, Pageable pageable);

    Reservation confirmReservation(Long id);

    List<Reservation> findByPhoneNumberOrIdNumber(String phoneNumber, String idNumber);

    Reservation confirmReservationWithoutVoyageur(ReservationWithoutVoyageurRequest request);

    Reservation attachVoyageur(Long reservationId, Long voyageurId);

    Reservation enrichReservation(Reservation reservation);

}
