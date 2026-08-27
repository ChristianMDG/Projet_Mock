package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Route;
import mg.taxibrousse.services.implementation.RouteService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    /**
     * Get routes connected to a gare (either as departure or arrival)
     */
    @GetMapping("/connected-gare/{gareId}")
    public ResponseEntity<List<Route>> getRoutesByConnectedGare(@PathVariable Long gareId) {
        List<Route> routes = routeService.findByConnectedGare(gareId);
        return ResponseEntity.ok(routes);
    }

    /**
     * Get all routes active
     */
    @GetMapping("/active")
    public ResponseEntity<List<Route>> getRoutesActive() {
        List<Route> routes = routeService.findAllActive();
        return ResponseEntity.ok(routes);
    }

    /**
     * Get a specific route by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        return routeService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create or update a route
     */
    @PostMapping
    public ResponseEntity<Route> createOrUpdateRoute(@RequestBody Route route) {
        try {
            Route savedRoute = routeService.save(route);
            return ResponseEntity.ok(savedRoute);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get available destination gares for a departure gare
     */
    @GetMapping("/connected-gare/{gareId}/available-destinations")
    public ResponseEntity<List<Gare>> getAvailableDestinations(@PathVariable Long gareId) {
        try {
            List<Gare> availableDestinations = routeService.getAvailableDestinations(gareId);
            return ResponseEntity.ok(availableDestinations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete a route (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all routes
     */
    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.findAll());
    }

    /**
     * Get routes by departure ville ID
     */
    @GetMapping("/ville/{villeId}")
    public ResponseEntity<List<Route>> getRoutesByVille(@PathVariable Long villeId) {
        return ResponseEntity.ok(routeService.findByVille(villeId));
    }

    /**
     * Get top active routes by departure gare ID
     */
    @GetMapping("/by-departure-gare/{gareId}")
    public ResponseEntity<List<Route>> getRoutesByDepartureGareId(@PathVariable Long gareId) {
        return ResponseEntity.ok(routeService.getRoutesByDepartureGareId(gareId));
    }

    /**
     * Get top active routes by departure ville ID
     */
    @GetMapping("/by-departure-ville/{villeId}")
    public ResponseEntity<List<Route>> getRoutesByDepartureVilleId(@PathVariable Long villeId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(routeService.getRoutesByDepartureVilleId(villeId, date));
    }
}
