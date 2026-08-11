package mg.taxibrousse.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;

@Repository
public interface IReservationRepository extends JpaRepository<ReservationEntity, Long>, JpaSpecificationExecutor<ReservationEntity> {

    @Query(
            """
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
        """
    )
    List<ReservationEntity> findByVoyageId(@Param("voyageId") Long voyageId);

    @Query(
            """
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
        """
    )
    List<ReservationEntity> findActiveByVoyageId(
            @Param("voyageId") Long voyageId,
            @Param("cancelledStatuses") java.util.Set<ReservationStatusEnum> cancelledStatuses
    );

    @Query(
            """
        SELECT r FROM Reservation r
        LEFT JOIN FETCH r.voyageur
        LEFT JOIN FETCH r.classe
        LEFT JOIN FETCH r.facturation
        LEFT JOIN FETCH r.seats s
        LEFT JOIN FETCH s.voyage
        LEFT JOIN FETCH s.crafter
        WHERE r.id = :id
        """
    )
    Optional<ReservationEntity> findByIdWithDetails(@Param("id") Long id);

    @Query(
            """
        SELECT COUNT(r) > 0 FROM Reservation r
        JOIN r.seats s
        WHERE r.voyage.id = :voyageId
        AND s.seatNumber = :seatNumber
        AND r.status != 'CANCELLED'
        """
    )
    boolean existsByVoyageIdAndSeatNumberAndStatusNotCancelled(
            @Param("voyageId") Long voyageId,
            @Param("seatNumber") Integer seatNumber
    );

    @Modifying
    @Query(
            """
        UPDATE Reservation r SET r.status = :status
        WHERE r.id = :id
        """
    )
    int updateStatus(@Param("id") Long id, @Param("status") ReservationStatusEnum status);

    boolean existsByBookingReference(String bookingReference);

    @Query(
            """
            SELECT r FROM Reservation r
            INNER JOIN FETCH r.voyageur
            LEFT JOIN FETCH r.voyage
            LEFT JOIN FETCH r.classe
            LEFT JOIN FETCH r.facturation
            LEFT JOIN FETCH r.seats
            WHERE r.voyageur.id = :voyageurId
            """
    )
    List<ReservationEntity> findByVoyageurId(Long voyageurId);

    // Dashboard stats queries
    long countByStatus(ReservationStatusEnum status);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM Reservation r")
    java.math.BigDecimal sumTotalAmount();

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
        WHERE v.phone = :phoneNumber OR v.id_number = :idNumber
        ORDER BY r.booking_date DESC
    """, nativeQuery = true)
    List<ReservationEntity> findByPhoneNumberOrIdNumber(
            @Param("phoneNumber") String phoneNumber,
            @Param("idNumber") String idNumber
    );
}
