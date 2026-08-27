package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.VoyageAvailabilityRequest;
import mg.taxibrousse.dto.VoyageClasses;
import mg.taxibrousse.dto.VoyageMonthlyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResponse;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.params.VoyageFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/voyages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IVoyageController {

    @GetMapping
    ResponseEntity<Page<Voyage>> listVoyages(@PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/koperative/{koperativeId}")
    ResponseEntity<List<Voyage>> listVoyagesByKoperative(@PathVariable Long koperativeId);

    @PostMapping
    ResponseEntity<Voyage> createVoyage(@RequestBody Voyage voyage);

    @PutMapping("/{id}")
    ResponseEntity<Voyage> updateVoyage(@PathVariable Long id, @RequestBody Voyage voyage);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteVoyage(@PathVariable Long id);

    @PostMapping("/schedule")
    ResponseEntity<List<Voyage>> scheduleVoyage(@RequestBody VoyageScheduler request);

    @GetMapping("/{id}/details")
    ResponseEntity<Voyage> getVoyageDetails(@PathVariable Long id);

    @GetMapping("/available")
    ResponseEntity<List<Voyage>> findAvailableVoyages(@ModelAttribute VoyageAvailabilityRequest request);

    @GetMapping("/date-range")
    ResponseEntity<List<Voyage>> findVoyagesByDateRange(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);

    @GetMapping("/filtered")
    ResponseEntity<List<Voyage>> findFilteredVoyages(@ModelAttribute VoyageFilter filter);

    @GetMapping("/filtered/grouped")
    ResponseEntity<List<VoyageClasses>> findGroupedFilteredVoyages(@ModelAttribute VoyageFilter filter);

    @GetMapping("/filtered/grouped/koperative")
    ResponseEntity<List<VoyageClasses>> findGroupedFilteredVoyagesByKoperative(@ModelAttribute VoyageFilter filter);

    @PostMapping("/{templateId}/generate-instances")
    ResponseEntity<List<Voyage>> generateRecurringInstances(@PathVariable Long templateId, @RequestParam(defaultValue = "100") int maxInstances);

    @GetMapping("/scheduled/gare/{gareId}")
    ResponseEntity<List<Voyage>> getScheduledVoyagesByGare(@PathVariable Long gareId);

    @GetMapping("/scheduled/gares")
    ResponseEntity<List<Voyage>> getScheduledVoyagesByGares(@RequestParam List<Long> gareIds);

    @GetMapping("/previous/{voyageurId}")
    ResponseEntity<Page<Voyage>> previousVoyages(@PathVariable Long voyageurId, @PageableDefault(size = 10) Pageable pageable);

    @GetMapping("/by-reservation/{reservationId}")
    ResponseEntity<Voyage> getVoyageByReservationId(@PathVariable Long reservationId);

    @GetMapping("/weekly-results")
    ResponseEntity<VoyageWeeklyResponse> getWeeklyResults(@ModelAttribute VoyageFilter filter);

    @GetMapping("/monthly-results")
    ResponseEntity<VoyageMonthlyResponse> getMonthlyResults(@RequestParam Long departureVilleId, @RequestParam Long arrivalVilleId, @RequestParam String month,
            @RequestParam(required = false) Long koperativeId, @RequestParam(required = false) Integer passengers, @RequestParam(required = false) String language);
}
