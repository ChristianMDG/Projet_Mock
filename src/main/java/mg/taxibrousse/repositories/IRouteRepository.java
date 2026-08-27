package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.RouteEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface IRouteRepository extends JpaRepository<RouteEntity, Long> {

    /**
     * Find routes by active status (standard JPA method)
     */
    List<RouteEntity> findByIsActive(Boolean isActive);

    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            INNER JOIN FETCH ag.ville v
            WHERE dg.id = :departureGareId
            AND r.isActive = true
            ORDER BY v.frequence DESC
            """)
    List<RouteEntity> findTopByDepartureGare(@Param("departureGareId") Long departureGareId, Pageable pageable);

    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            INNER JOIN FETCH ag.ville v
            WHERE dg.ville.id = :villeId
            AND r.isActive = true
            ORDER BY v.frequence DESC
            """)
    List<RouteEntity> findTopByDepartureVille(@Param("villeId") Long villeId, Pageable pageable);

    /**
     * Find all active routes with gares eagerly loaded
     */
    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            WHERE r.isActive = true
            ORDER BY r.name
            """)
    List<RouteEntity> findAllActiveWithGares();

    /**
     * Find active routes where the specified gare is the departure gare.
     * Related gares are eagerly loaded.
     */
    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            WHERE r.isActive = true
            AND dg.id = :gareId
            """)
    List<RouteEntity> findByDepartureGareId(@Param("gareId") Long gareId);

    /**
     * Find route by ID with departure and arrival gares eagerly loaded
     */
    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            WHERE r.id = :id
            """)
    Optional<RouteEntity> findByIdWithGares(@Param("id") Long id);

    /**
     * Find route by departure and arrival gare IDs
     */
    Optional<RouteEntity> findByDepartureGareIdAndArrivalGareId(Long departureGareId, Long arrivalGareId);

    /**
     * Find route by departure and arrival gare IDs with gares eagerly loaded (for batch processing)
     * This method eagerly loads gares and triggers description fetch to avoid LazyInitializationException
     */
    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            WHERE dg.id = :departureGareId
            AND ag.id = :arrivalGareId
            """)
    Optional<RouteEntity> findByDepartureAndArrivalGareIdWithGares(@Param("departureGareId") Long departureGareId, @Param("arrivalGareId") Long arrivalGareId);

    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            WHERE dg.ville.id = :villeId
            ORDER BY r.name
            """)
    List<RouteEntity> findByDepartureGareVilleId(@Param("villeId") Long villeId);

    @Query("""
            SELECT r
            FROM Route r
            INNER JOIN FETCH r.departureGare dg
            INNER JOIN FETCH r.arrivalGare ag
            INNER JOIN FETCH ag.ville v
            WHERE dg.ville.id = :villeId
            AND UPPER(ag.ville.name) IN :majorCities
            ORDER BY r.name
            """)
    List<RouteEntity> findByDepartureGareVilleIdAndArrivalGareVilleIn(@Param("villeId") Long villeId, @Param("majorCities") List<String> majorCities);

    /**
     * Returns the average distanceKm of all active routes arriving at the given ville.
     * Used by the delivery fee calculator to price shipping based on route distance.
     */
    @Query("""
            SELECT AVG(r.distanceKm)
            FROM Route r
            WHERE r.arrivalGare.ville.id = :villeId
            AND r.isActive = true
            AND r.distanceKm IS NOT NULL
            """)
    Optional<BigDecimal> findAverageDistanceKmByArrivalVilleId(@Param("villeId") Long villeId);
}
