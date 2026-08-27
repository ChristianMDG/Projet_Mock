package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IVoyageRepository extends JpaRepository<VoyageEntity, Long> {

    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville dv
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville av
                WHERE CAST(v.departureTime AS DATE) = :departureDate
                  AND dg.id = :gareId
                  AND dv.name = :departureVille
                  AND v.fbScheduled = false
                ORDER BY v.departureTime ASC
            """)
    List<VoyageEntity> findVoyagesForFacebookPost(@Param("departureDate") LocalDate departureDate, @Param("gareId") Long gareId, @Param("departureVille") String departureVille);

    @Modifying
    @Query(value = """
                UPDATE voyage
                SET fb_scheduled = true
                WHERE id IN (:voyageIds)
            """, nativeQuery = true)
    void markFbScheduledByIds(@Param("voyageIds") List<Long> voyageIds);

    // Pageable query with proper one-to-one relational loading
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                LEFT JOIN FETCH v.route r
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville dv
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville av
                LEFT JOIN FETCH v.crafter cr
                LEFT JOIN FETCH v.chauffeur ch
                LEFT JOIN FETCH ch.user chu
                LEFT JOIN FETCH v.parentTemplate pt
                ORDER BY v.departureTime DESC
            """)
    Page<VoyageEntity> findAllWithRelations(Pageable pageable);

    // JPA queries returning complete Voyage entities with related data
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE v.koperative.id = :koperativeId
            """)
    List<VoyageEntity> findByKoperativeId(@Param("koperativeId") Long koperativeId);

    // Batch query: eagerly fetch all associations needed by Voyage.fromEntity()
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                LEFT JOIN FETCH v.route r
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville dv
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville av
                LEFT JOIN FETCH v.crafter cr
                LEFT JOIN FETCH v.chauffeur ch
                LEFT JOIN FETCH ch.user chu
                LEFT JOIN FETCH v.classe cl
                WHERE v.departureTime >= :startDate
                AND v.departureTime <= :endDate
                AND v.isTemplate = false
                ORDER BY v.departureTime ASC
            """)
    List<VoyageEntity> findByDepartureTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT v FROM Voyage v
            INNER JOIN FETCH v.koperative
            LEFT JOIN FETCH v.route
            INNER JOIN FETCH v.departureGare dg
            INNER JOIN FETCH dg.ville
            INNER JOIN FETCH v.arrivalGare ag
            INNER JOIN FETCH ag.ville
            LEFT JOIN FETCH v.crafter
            LEFT JOIN FETCH v.chauffeur c
            LEFT JOIN FETCH c.user
            WHERE v.departureGare.id = :departureGareId
            AND v.arrivalGare.id = :arrivalGareId
            AND FUNCTION('DATE', v.departureTime) = FUNCTION('DATE', :departureDate)
            AND v.availableSeats > 0
            """)
    List<VoyageEntity> findAvailableVoyages(@Param("departureGareId") Long departureGareId, @Param("arrivalGareId") Long arrivalGareId, @Param("departureDate") LocalDateTime departureDate);

    // Find voyage by reservation ID
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE v.id = (SELECT r.voyage.id FROM Reservation r WHERE r.id = :reservationId)
            """)
    VoyageEntity findByReservationId(@Param("reservationId") Long reservationId);

    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE (:departureVilleId IS NULL OR dg.ville.id = :departureVilleId)
                AND (:arrivalVilleId IS NULL OR ag.ville.id = :arrivalVilleId)
                AND (:departureGareId IS NULL OR v.departureGare.id = :departureGareId)
                AND (:arrivalGareId IS NULL OR v.arrivalGare.id = :arrivalGareId)
                AND v.isTemplate = false
                ORDER BY CASE WHEN (:koperativeId IS NOT NULL AND v.koperative.id = :koperativeId) THEN 0 ELSE 1 END ASC, v.departureTime DESC
            """)
    List<VoyageEntity> findFilteredVoyages(@Param("koperativeId") Long koperativeId, @Param("departureVilleId") Long departureVilleId, @Param("arrivalVilleId") Long arrivalVilleId,
            @Param("departureGareId") Long departureGareId, @Param("arrivalGareId") Long arrivalGareId);

    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE v.koperative.id = :koperativeId
                AND (:departureVilleId IS NULL OR dg.ville.id = :departureVilleId)
                AND (:arrivalVilleId IS NULL OR ag.ville.id = :arrivalVilleId)
                AND (:departureGareId IS NULL OR v.departureGare.id = :departureGareId)
                AND (:arrivalGareId IS NULL OR v.arrivalGare.id = :arrivalGareId)
                AND v.isTemplate = false
                ORDER BY v.departureTime DESC
            """)
    List<VoyageEntity> findFilteredVoyagesByKoperative(@Param("koperativeId") Long koperativeId, @Param("departureVilleId") Long departureVilleId, @Param("arrivalVilleId") Long arrivalVilleId,
            @Param("departureGareId") Long departureGareId, @Param("arrivalGareId") Long arrivalGareId);

    // Find scheduled voyages by gare ID
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE (v.departureGare.id = :gareId OR v.arrivalGare.id = :gareId)
                AND v.status = :status
                AND v.isTemplate = false
                ORDER BY v.departureTime DESC
            """)
    List<VoyageEntity> findByGareIdAndStatus(@Param("gareId") Long gareId, @Param("status") VoyageStatusEnum status);

    // Find scheduled voyages by multiple gare IDs
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative
                LEFT JOIN FETCH v.route
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville
                LEFT JOIN FETCH v.crafter
                LEFT JOIN FETCH v.chauffeur c
                LEFT JOIN FETCH c.user
                WHERE (v.departureGare.id IN :gareIds OR v.arrivalGare.id IN :gareIds)
                AND v.status = :status
                AND v.isTemplate = false
                ORDER BY v.departureTime DESC
            """)
    List<VoyageEntity> findByGareIdsAndStatus(@Param("gareIds") List<Long> gareIds, @Param("status") VoyageStatusEnum status);

    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                INNER JOIN FETCH v.route r
                WHERE r.id IN :routeIds
                AND v.isTemplate = false
                AND v.departureTime >= :startDateTime
                AND v.departureTime < :endDateTime
                ORDER BY v.departureTime DESC
            """)
    List<VoyageEntity> findByRouteIdsAndDepartureBetween(@Param("routeIds") List<Long> routeIds, @Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime);

    @Query("""
            SELECT MIN(v.pricePerSeat) FROM Voyage v
            WHERE v.route.id = :routeId
            AND v.pricePerSeat IS NOT NULL
            """)
    BigDecimal findMinPricePerSeatByRouteId(@Param("routeId") Long routeId);

    @Query(value = """
                 SELECT DISTINCT v FROM Voyage v
                 JOIN v.reservations r
                 WHERE v.estimatedArrivalTime < CURRENT_TIMESTAMP
                 AND r.voyageur.id = :voyageurId
                 ORDER BY v.departureTime DESC
            """, countQuery = """
                SELECT COUNT(DISTINCT v) FROM Voyage v
                JOIN v.reservations r
                WHERE v.estimatedArrivalTime < CURRENT_TIMESTAMP
                AND r.voyageur.id = :voyageurId
            """)
    Page<VoyageEntity> findByPreviousDate(@Param("voyageurId") Long voyageurId, Pageable pageable);

    /**
     * Find voyages in a week range with all possible filters for weekly results.
     * Fetches koperative, departureGare, arrivalGare and crafter — no nested
     * ville, chauffeur or parentTemplate — matching exactly what the search
     * page consumes.
     */
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH v.arrivalGare ag
                LEFT JOIN FETCH v.crafter cr
                WHERE v.departureTime >= :weekStart
                    AND v.departureTime <= :weekEnd
                    AND v.departureTime >= CURRENT_TIMESTAMP
                    AND (:departureGareId IS NULL OR v.departureGare.id = :departureGareId)
                    AND (:departureVilleId IS NULL OR dg.ville.id = :departureVilleId)
                    AND (:arrivalGareId IS NULL OR v.arrivalGare.id = :arrivalGareId)
                    AND (:arrivalVilleId IS NULL OR ag.ville.id = :arrivalVilleId)
                    AND (:status IS NULL OR v.status = :status)
                    AND (:statuses IS NULL OR v.status IN (:statuses))
                    AND (:passengers IS NULL OR v.availableSeats >= :passengers)
                    AND v.isTemplate = false
                ORDER BY CASE WHEN (:koperativeId IS NOT NULL AND v.koperative.id = :koperativeId) THEN 0 ELSE 1 END ASC, v.departureTime DESC
            """)
    List<VoyageEntity> findWeeklyFiltered(@Param("weekStart") LocalDateTime weekStart, @Param("weekEnd") LocalDateTime weekEnd, @Param("koperativeId") Long koperativeId,
            @Param("departureGareId") Long departureGareId, @Param("departureVilleId") Long departureVilleId, @Param("arrivalGareId") Long arrivalGareId, @Param("arrivalVilleId") Long arrivalVilleId,
            @Param("status") VoyageStatusEnum status, @Param("statuses") List<VoyageStatusEnum> statuses, @Param("passengers") Integer passengers);

    /**
     * Find voyages in a month range for the monthly calendar results.
     * Filters by required departure and arrival villes, and optional koperative / passengers.
     * Excludes cancelled voyages and template entries.
     */
    @Query("""
                SELECT v FROM Voyage v
                INNER JOIN FETCH v.koperative k
                INNER JOIN FETCH v.departureGare dg
                INNER JOIN FETCH dg.ville dv
                INNER JOIN FETCH v.arrivalGare ag
                INNER JOIN FETCH ag.ville av
                LEFT JOIN FETCH v.crafter cr
                LEFT JOIN FETCH v.chauffeur ch
                LEFT JOIN FETCH ch.user chu
                WHERE v.departureTime >= :monthStart
                    AND v.departureTime <= :monthEnd
                    AND dg.ville.id = :departureVilleId
                    AND ag.ville.id = :arrivalVilleId
                    AND (:koperativeId IS NULL OR v.koperative.id = :koperativeId)
                    AND (:passengers IS NULL OR v.availableSeats >= :passengers)
                    AND v.status != 'CANCELLED'
                    AND v.isTemplate = false
                ORDER BY v.departureTime ASC
            """)
    List<VoyageEntity> findMonthlyFiltered(@Param("monthStart") LocalDateTime monthStart, @Param("monthEnd") LocalDateTime monthEnd, @Param("departureVilleId") Long departureVilleId,
            @Param("arrivalVilleId") Long arrivalVilleId, @Param("koperativeId") Long koperativeId, @Param("passengers") Integer passengers);

    // -------------------------------------------------------------------------
    // Dashboard statistics
    // -------------------------------------------------------------------------

    long countByStatus(VoyageStatusEnum status);

    /**
     * Returns the count of non-template voyages grouped by status as {@code [status, count]} pairs.
     * Each row contains the {@link VoyageStatusEnum} value and its corresponding count.
     * Only statuses with at least one voyage are returned.
     */
    @Query("SELECT v.status, COUNT(v) FROM Voyage v WHERE v.isTemplate = false GROUP BY v.status")
    List<Object[]> countVoyagesByStatusDistribution();

    /**
     * Returns the total number of actual voyages, excluding template entries.
     */
    @Query("SELECT COUNT(v) FROM Voyage v WHERE v.isTemplate = false")
    long countNonTemplateVoyages();

}
