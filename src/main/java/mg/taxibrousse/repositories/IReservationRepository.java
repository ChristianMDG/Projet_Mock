package mg.taxibrousse.repositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;

@Repository
public interface IReservationRepository extends JpaRepository<ReservationEntity, Long>, JpaSpecificationExecutor<ReservationEntity> {

    @Query("""
            SELECT DISTINCT r FROM Reservation r
            LEFT JOIN FETCH r.voyage v
            LEFT JOIN FETCH v.koperative
            LEFT JOIN FETCH v.route
            LEFT JOIN FETCH v.departureGare
            LEFT JOIN FETCH v.arrivalGare
            LEFT JOIN FETCH v.crafter
            LEFT JOIN FETCH v.chauffeur
            LEFT JOIN FETCH r.voyageur
            LEFT JOIN FETCH r.classe
            LEFT JOIN FETCH r.facturation
            LEFT JOIN FETCH r.seats
            WHERE r.voyage.id = :voyageId
            """)
    List<ReservationEntity> findByVoyageId(@Param("voyageId") Long voyageId);

    @Query("""
            SELECT DISTINCT r FROM Reservation r
            LEFT JOIN FETCH r.voyage v
            LEFT JOIN FETCH v.koperative
            LEFT JOIN FETCH v.route
            LEFT JOIN FETCH v.departureGare
            LEFT JOIN FETCH v.arrivalGare
            LEFT JOIN FETCH v.crafter
            LEFT JOIN FETCH v.chauffeur
            LEFT JOIN FETCH r.voyageur
            LEFT JOIN FETCH r.classe
            LEFT JOIN FETCH r.facturation
            LEFT JOIN FETCH r.seats
            WHERE r.voyage.id = :voyageId
            AND r.status NOT IN (:cancelledStatuses)
            """)
    List<ReservationEntity> findActiveByVoyageId(@Param("voyageId") Long voyageId, @Param("cancelledStatuses") java.util.Set<ReservationStatusEnum> cancelledStatuses);

    @Query("""
            SELECT DISTINCT r FROM Reservation r
            LEFT JOIN FETCH r.voyage v
            LEFT JOIN FETCH v.koperative
            LEFT JOIN FETCH v.departureGare dg
            LEFT JOIN FETCH dg.ville
            LEFT JOIN FETCH v.arrivalGare ag
            LEFT JOIN FETCH ag.ville
            LEFT JOIN FETCH r.voyageur
            LEFT JOIN FETCH r.classe
            LEFT JOIN FETCH r.facturation
            LEFT JOIN FETCH r.seats s
            WHERE r.id = :id
            """)
    Optional<ReservationEntity> findByIdWithDetails(@Param("id") Long id);

    @Query("""
            SELECT COUNT(r) > 0 FROM Reservation r
            JOIN r.seats s
            WHERE r.voyage.id = :voyageId
            AND s.seatNumber = :seatNumber
            AND r.status != 'CANCELLED'
            """)
    boolean existsByVoyageIdAndSeatNumberAndStatusNotCancelled(@Param("voyageId") Long voyageId, @Param("seatNumber") Integer seatNumber);

    @Modifying
    @Query("""
            UPDATE Reservation r SET r.status = :status
            WHERE r.id = :id
            """)
    int updateStatus(@Param("id") Long id, @Param("status") ReservationStatusEnum status);

    boolean existsByBookingReference(String bookingReference);

    @Query("""
            SELECT r FROM Reservation r
            INNER JOIN FETCH r.voyageur
            LEFT JOIN FETCH r.voyage v
            LEFT JOIN FETCH r.classe
            LEFT JOIN FETCH r.facturation
            LEFT JOIN FETCH r.seats
            WHERE r.voyageur.id = :voyageurId
              AND v.departureTime >= :now
            """)
    List<ReservationEntity> findFutureByVoyageurId(@Param("voyageurId") Long voyageurId, @Param("now") LocalDateTime now);

    // -------------------------------------------------------------------------
    // Dashboard statistics
    // -------------------------------------------------------------------------

    long countByStatus(ReservationStatusEnum status);

    long countByStatusAndFacturationPaymentStatus(ReservationStatusEnum status, PaymentStatusEnum paymentStatus);

    /**
     * Counts confirmed reservations whose payment has been fully or partially received.
     * Excludes confirmed reservations still awaiting payment.
     */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status = :status AND r.facturation.paymentStatus IN (:paymentStatuses)")
    long countByStatusAndFacturationPaymentStatusIn(@Param("status") ReservationStatusEnum status, @Param("paymentStatuses") Collection<PaymentStatusEnum> paymentStatuses);

    /**
     * Counts all reservations that are logically pending payment, including:
     * <ul>
     * <li>Reservations with {@code status = PENDING_PAYMENT}</li>
     * <li>Confirmed reservations whose payment has not yet been received</li>
     * </ul>
     */
    @Query("""
                SELECT COUNT(r) FROM Reservation r
                WHERE r.status = 'PENDING_PAYMENT'
                   OR (r.status = 'CONFIRMED' AND (r.facturation IS NULL OR r.facturation.paymentStatus = 'PENDING'))
            """)
    long countPendingReservations();

    /**
     * Returns the total revenue collected from confirmed and paid reservations.
     * Only {@code PAID} and {@code PARTIALLY_PAID} payment statuses are included.
     */
    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM Reservation r WHERE r.status = 'CONFIRMED' AND (r.facturation.paymentStatus = 'PAID' OR r.facturation.paymentStatus = 'PARTIALLY_PAID')")
    BigDecimal sumTotalAmount();

    /**
     * Returns the count of reservations grouped by status as {@code [status, count]} pairs.
     * Each row contains the {@link ReservationStatusEnum} value and its corresponding count.
     * Only statuses with at least one reservation are returned.
     */
    @Query("SELECT r.status, COUNT(r) FROM Reservation r GROUP BY r.status")
    List<Object[]> countReservationsByStatusDistribution();

    /**
     * Returns the top 8 routes ordered by reservation count, along with their total revenue.
     * Each row contains: {@code [route_name, reservation_count, total_revenue]}.
     * Routes without associated ville data are excluded.
     */
    @Query(value = """
                SELECT CONCAT(dv.name, ' → ', av.name) AS route_name,
                       COUNT(r.id)                       AS reservation_count,
                       COALESCE(SUM(r.total_amount), 0)  AS total_revenue
                FROM reservation r
                JOIN voyage v  ON r.voyage_id          = v.id
                JOIN gare  dg  ON v.departure_gare_id  = dg.id
                JOIN ville dv  ON dg.ville_id          = dv.id
                JOIN gare  ag  ON v.arrival_gare_id    = ag.id
                JOIN ville av  ON ag.ville_id          = av.id
                GROUP BY dv.name, av.name
                ORDER BY COUNT(r.id) DESC
                LIMIT 8
            """, nativeQuery = true)
    List<Object[]> findTopRoutesByReservationCount();

    @Query("""
                SELECT r FROM Reservation r
                INNER JOIN FETCH r.voyageur
                LEFT JOIN FETCH r.voyage v
                LEFT JOIN FETCH v.departureGare dg
                LEFT JOIN FETCH dg.ville
                LEFT JOIN FETCH v.arrivalGare ag
                LEFT JOIN FETCH ag.ville
                LEFT JOIN FETCH r.facturation
                ORDER BY r.bookingDate DESC
                LIMIT 5
            """)
    List<ReservationEntity> findTop5ByOrderByBookingDateDesc();

    @Query(value = """
                SELECT DISTINCT r.* FROM reservation r
                INNER JOIN userinfo v ON r.voyageur_id = v.id
                INNER JOIN voyage voy ON r.voyage_id = voy.id
                WHERE (v.phone = :phoneNumber AND v.id_number = :idNumber)
                AND r.status = 'CONFIRMED'
                AND voy.departure_time >= CURRENT_DATE - INTERVAL '1 day'
                ORDER BY r.booking_date DESC
            """, nativeQuery = true)
    List<ReservationEntity> findByPhoneNumberOrIdNumber(@Param("phoneNumber") String phoneNumber, @Param("idNumber") String idNumber);
}
