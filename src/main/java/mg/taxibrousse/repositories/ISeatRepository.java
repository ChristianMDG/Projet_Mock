package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.enums.SeatStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISeatRepository extends JpaRepository<SeatEntity, Long> {
    /**
     * Find all seats for a specific voyage
     */
    @Query(
        """
        SELECT s FROM Seat s
        LEFT JOIN FETCH s.reservation
        WHERE s.voyage.id = :voyageId
        ORDER BY s.seatNumber ASC
        """
    )
    List<SeatEntity> findByVoyageIdOrderBySeatNumber(@Param("voyageId") Long voyageId);

    /**
     * Find all seats for a specific crafter
     */
    @Query(
        """
        SELECT s FROM Seat s
        WHERE s.crafter.id = :crafterId
        ORDER BY s.seatNumber ASC
        """
    )
    List<SeatEntity> findByCrafterIdOrderBySeatNumber(@Param("crafterId") Long crafterId);

    /**
     * Find a specific seat for a voyage by seat number
     */
    @Query(
        """
        SELECT s FROM Seat s
        LEFT JOIN FETCH s.reservation
        WHERE s.voyage.id = :voyageId
        AND s.seatNumber = :seatNumber
        """
    )
    Optional<SeatEntity> findByVoyageIdAndSeatNumber(
        @Param("voyageId") Long voyageId,
        @Param("seatNumber") Integer seatNumber
    );

    /**
     * Find all available seats for a specific voyage
     */
    @Query(
        """
        SELECT s FROM Seat s
        WHERE s.voyage.id = :voyageId
        AND s.seatStatus = :status
        ORDER BY s.seatNumber ASC
        """
    )
    List<SeatEntity> findByVoyageIdAndSeatStatus(
        @Param("voyageId") Long voyageId,
        @Param("status") SeatStatusEnum status
    );

    /**
     * Count available seats for a voyage
     */
    @Query(
        """
        SELECT COUNT(s) FROM Seat s
        WHERE s.voyage.id = :voyageId
        AND s.seatStatus = 'AVAILABLE'
        """
    )
    Long countAvailableSeatsByVoyageId(@Param("voyageId") Long voyageId);

    /**
     * Check if a seat exists for a voyage and seat number
     */
    boolean existsByVoyageIdAndSeatNumber(Long voyageId, Integer seatNumber);

    /**
     * Find seats by voyage and seat numbers
     */
    @Query(
        """
        SELECT s FROM Seat s
        WHERE s.voyage.id = :voyageId
        AND s.seatNumber IN :seatNumbers
        """
    )
    List<SeatEntity> findByVoyageIdAndSeatNumberIn(
        @Param("voyageId") Long voyageId,
        @Param("seatNumbers") List<Integer> seatNumbers
    );

    /**
     * Find seats for a specific voyage that belong to a given reservation
     */
    @Query(
        """
        SELECT s FROM Seat s
        LEFT JOIN FETCH s.reservation r
        WHERE s.voyage.id = :voyageId
        AND r.id = :reservationId
        ORDER BY s.seatNumber ASC
        """
    )
    List<SeatEntity> findByVoyageIdAndReservationId(
        @Param("voyageId") Long voyageId,
        @Param("reservationId") Long reservationId
    );

    /**
     * Find all seats for a specific reservation
     */
    @Query(
            """
        SELECT s FROM Seat s
        WHERE s.reservation.id = :reservationId
        ORDER BY s.seatNumber ASC
        """
    )
    List<SeatEntity> findByReservationId(@Param("reservationId") Long reservationId);

    /**
     * Delete all seats for a voyage
     */
    @Modifying
    @Query(
        """
        DELETE FROM Seat s
        WHERE s.voyage.id = :voyageId
        """
    )
    void deleteByVoyageId(@Param("voyageId") Long voyageId);

    @Modifying
    @Query(
        """
        DELETE FROM Seat s
        WHERE s.reservation.id = :reservationId
        """
    )
    void deleteByReservationId(@Param("reservationId") Long reservationId);
}
