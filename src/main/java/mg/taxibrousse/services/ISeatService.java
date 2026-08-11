package mg.taxibrousse.services;

import mg.taxibrousse.entities.enums.SeatStatusEnum;
import mg.taxibrousse.models.Seat;

import java.util.List;

public interface ISeatService extends IBaseService {
    /**
     * Save or update a seat
     */
    Seat save(Seat seat);

    /**
     * Find seat by ID
     */
    Seat findById(Long id);

    /**
     * Find all seats for a specific voyage
     */
    List<Seat> findByVoyageId(Long voyageId);

    /**
     * Find all seats for a specific crafter
     */
    List<Seat> findByCrafterId(Long crafterId);

    /**
     * Find a specific seat by voyage and seat number
     */
    Seat findByVoyageIdAndSeatNumber(Long voyageId, Integer seatNumber);

    /**
     * Find seats by voyage and status
     */
    List<Seat> findByVoyageIdAndStatus(Long voyageId, SeatStatusEnum status);

    /**
     * Find seats by voyage and reservation
     */
    List<Seat> findByVoyageIdAndReservationId(Long voyageId, Long reservationId);

    /**
     * Find all seats for a specific reservation
     */
    List<Seat> findByReservationId(Long reservationId);

    /**
     * Get available seats count for a voyage
     */
    Long getAvailableSeatsCount(Long voyageId);

    /**
     * Initialize seats for a voyage based on crafter capacity
     */
    List<Seat> initializeSeatsForVoyage(Long voyageId, Long crafterId);

    /**
     * Update seat status
     */
    Seat updateSeatStatus(Long seatId, SeatStatusEnum status);

    /**
     * Reserve a seat
     */
    Seat reserveSeat(Long voyageId, Integer seatNumber);

    /**
     * Release a reserved seat
     */
    Seat releaseSeat(Long voyageId, Integer seatNumber);

    /**
     * Check if seat is available
     */
    boolean isSeatAvailable(Long voyageId, Integer seatNumber);

    /**
     * Delete seat by ID
     */
    void deleteById(Long id);

    /**
     * Update multiple seats status in bulk
     */
    List<Seat> updateMultipleSeatsStatus(Long voyageId, List<Integer> seatNumbers, SeatStatusEnum status);

    /**
     * Reset all seats for a voyage to available status
     */
    List<Seat> resetVoyageSeats(Long voyageId);

    /**
     * Release all seats for a specific reservation
     */
    List<Seat> releaseSeatsByReservation(Long voyageId, Long reservationId);
}
