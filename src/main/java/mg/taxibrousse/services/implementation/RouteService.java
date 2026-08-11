package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.GareEntity;
import mg.taxibrousse.entities.RouteEntity;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Route;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.repositories.IGareRepository;
import mg.taxibrousse.repositories.IRouteRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final IRouteRepository routeRepository;
    private final IGareRepository gareRepository;
    private final IVoyageRepository voyageRepository;

    /**
     * Find routes connected to a gare (either as departure or arrival)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "'gare-' + #gareId")
    public List<Route> findByConnectedGare(Long gareId) {
        return routeRepository.findByDepartureGareId(gareId)
                .stream().map(Route::fromEntity)
                .toList();
    }

    /**
     * Find route by ID
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "#id", unless = "#result == null")
    public Optional<Route> findById(Long id) {
        return routeRepository.findByIdWithGares(id)
                .map(Route::fromEntity);
    }

    /**
     * Create or update a route
     */
    @Transactional
    @CacheEvict(value = "routes", allEntries = true)
    public Route save(Route route) {
        RouteEntity entity = route.toEntity(null);

        if (route.getDepartureGare() != null && route.getDepartureGare().getId() != null) {
            GareEntity departureGare = gareRepository.findById(route.getDepartureGare().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Departure gare not found"));
            entity.setDepartureGare(departureGare);
        }

        if (route.getArrivalGare() != null && route.getArrivalGare().getId() != null) {
            GareEntity arrivalGare = gareRepository.findById(route.getArrivalGare().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Arrival gare not found"));
            entity.setArrivalGare(arrivalGare);
        }

        // Set defaults
        if (entity.getIsActive() == null) {
            entity.setIsActive(true);
        }

        RouteEntity savedEntity = routeRepository.save(entity);
        return Route.fromEntity(savedEntity);
    }

    /**
     * Delete a route (soft delete by setting isActive = false)
     */
    @Transactional
    @CacheEvict(value = "routes", allEntries = true)
    public void deleteById(Long id) {
        RouteEntity entity = routeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Route not found"));
        entity.setIsActive(false);
        routeRepository.save(entity);
    }

    /**
     * Get available destination gares for a departure gare (gares not already
     * connected)
     */
    @Transactional(readOnly = true)
    public List<Gare> getAvailableDestinations(Long departureGareId) {
        List<Long> existingConnectedGareIds = new ArrayList<>(findByConnectedGare(departureGareId)
                .stream().map(route -> route.getArrivalGare().getId())
                .toList());

        existingConnectedGareIds.add(departureGareId);

        return gareRepository.findByIdNotIn(existingConnectedGareIds)
                .stream()
                .map(Gare::fromEntity)
                .toList();
    }
    /**
     * Get all active routes
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "'active'")
    public List<Route> findAllActive() {
        return routeRepository.findAllActiveWithGares()
                .stream().map(Route::fromEntity)
                .toList();
    }

    /**
     * Get all routes
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "'all'")
    public List<Route> findAll() {
        return routeRepository.findAll()
                .stream().map(Route::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "'ville-' + #villeId")
    public List<Route> findByVille(Long villeId) {
        return routeRepository.findByDepartureGareVilleId(villeId)
                .stream().map(Route::fromEntity)
                .toList();
    }

    /**
     * Get top active routes for a departure gare by frequency
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "routes", key = "'top-gare-' + #departureGareId")
    public List<Route> getRoutesByDepartureGareId(Long departureGareId) {
        return routeRepository.findTopByDepartureGare(departureGareId, PageRequest.of(0, 5))
                .stream()
                .map(Route::fromEntity)
                .toList();
    }

    /**
     * Get top active routes for a departure ville by frequency,
     * with their associated voyages filtered in the given date range.
     * Defaults to tomorrow when no dates are provided.
     */
    @Transactional(readOnly = true)
    public List<Route> getRoutesByDepartureVilleId(Long villeId, LocalDate date) {
        List<RouteEntity> routeEntities = routeRepository.findTopByDepartureVille(villeId, PageRequest.of(0, 5));
        if (routeEntities.isEmpty()) return List.of();

        var startDateTime = date.atStartOfDay();
        var endDateTime = date.plusDays(14).atStartOfDay();

        var voyagesByRouteId = voyageRepository.findByRouteIdsAndDepartureBetween(
                routeEntities.stream().map(RouteEntity::getId).toList(),
                startDateTime,
                endDateTime
        ).stream().collect(Collectors.groupingBy(
                v -> v.getRoute().getId(),
                Collectors.mapping(Voyage::fromEntityLightWithKoperative, Collectors.toList())
        ));

        return routeEntities.stream().map(entity -> {
            var route = Route.fromEntity(entity);
            route.setVoyages(voyagesByRouteId.getOrDefault(entity.getId(), List.of()));
            return route;
        })
        .filter(route -> route.getVoyages().isEmpty() == false)
        .toList();
    }
}
