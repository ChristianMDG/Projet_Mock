package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.VoyageClasses;
import mg.taxibrousse.dto.VoyageMonthlyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResponse;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.params.VoyageFilter;
import mg.taxibrousse.services.IVoyageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/voyages")
@RequiredArgsConstructor
public class VoyageController {

    private final IVoyageService voyageService;

    @GetMapping
    @Transactional(readOnly = true)
    public Page<Voyage> listVoyages(@PageableDefault(size = 20) Pageable pageable) {
        return voyageService.findAllVoyages(pageable);
    }

    @GetMapping("/koperative/{koperativeId}")
    @Transactional(readOnly = true)
    public List<Voyage> listVoyagesByKoperative(@PathVariable Long koperativeId) {
        return voyageService.findVoyagesByKoperativeId(koperativeId);
    }

    @PostMapping
    public Voyage createVoyage(@RequestBody Voyage voyage) {
        return voyageService.save(voyage);
    }

    @PutMapping("/{id}")
    public Voyage updateVoyage(@PathVariable Long id, @RequestBody Voyage voyage) {
        voyage.setId(id);
        return voyageService.save(voyage);
    }

    @DeleteMapping("/{id}")
    public void deleteVoyage(@PathVariable Long id) {
        voyageService.deleteById(id);
    }

    @PostMapping("/schedule")
    public ResponseEntity<List<Voyage>> scheduleVoyage(@RequestBody VoyageScheduler request) {
        List<Voyage> voyages = voyageService.scheduleVoyage(request);
        return ResponseEntity.ok(voyages);
    }

    @GetMapping("/{id}/details")
    @Transactional(readOnly = true)
    public ResponseEntity<Voyage> getVoyageDetails(@PathVariable Long id) {
        Voyage voyage = voyageService.findVoyageById(id);
        return voyage != null ? ResponseEntity.ok(voyage) : ResponseEntity.notFound().build();
    }

    @GetMapping("/available")
    @Transactional(readOnly = true)
    public List<Voyage> findAvailableVoyages(
            @RequestParam Long departureGareId,
            @RequestParam Long arrivalGareId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate
    ) {
        LocalDateTime departureDateTime = departureDate.atStartOfDay();
        return voyageService.findAvailableVoyages(departureGareId, arrivalGareId, departureDateTime);
    }

    @GetMapping("/date-range")
    @Transactional(readOnly = true)
    public List<Voyage> findVoyagesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return voyageService.findVoyagesByDateRange(startDate, endDate);
    }

    @GetMapping("/filtered")
    @Transactional(readOnly = true)
    public List<Voyage> findFilteredVoyages(@ModelAttribute VoyageFilter filter) {
        return voyageService.findFilteredVoyages(filter);
    }

    @GetMapping("/filtered/grouped")
    @Transactional(readOnly = true)
    public ResponseEntity<List<VoyageClasses>> findGroupedFilteredVoyages(@ModelAttribute VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.findGroupedFilteredVoyages(filter));
    }

    @GetMapping("/resource-availability")
    @Transactional(readOnly = true)
    public ResponseEntity<Boolean> checkResourceAvailability(
            @RequestParam(required = false) Long crafterId,
            @RequestParam(required = false) Long chauffeurId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime estimatedArrivalTime,
            @RequestParam(required = false) Long excludeVoyageId
    ) {
        boolean available = voyageService.isResourceAvailable(
                crafterId,
                chauffeurId,
                departureTime,
                estimatedArrivalTime,
                excludeVoyageId
        );
        return ResponseEntity.ok(available);
    }

    @PostMapping("/{templateId}/generate-instances")
    public ResponseEntity<List<Voyage>> generateRecurringInstances(
            @PathVariable Long templateId,
            @RequestParam(defaultValue = "100") int maxInstances
    ) {
        Voyage template = voyageService.findVoyageById(templateId);
        if (template == null || !Boolean.TRUE.equals(template.getIsTemplate())) {
            return ResponseEntity.badRequest().build();
        }

        List<Voyage> instances = voyageService.generateRecurringInstances(template, maxInstances);
        return ResponseEntity.ok(instances);
    }

    /**
     * Get scheduled voyages by gare ID
     *
     * @param gareId the ID of the gare
     * @return list of voyages
     */
    @GetMapping("/scheduled/gare/{gareId}")
    @Transactional(readOnly = true)
    public List<Voyage> getScheduledVoyagesByGare(@PathVariable Long gareId) {
        return voyageService.findScheduledVoyagesByGare(gareId);
    }

    /**
     * Get scheduled voyages by multiple gare IDs
     *
     * @param gareIds list of gare IDs
     * @return list of voyages
     */
    @GetMapping("/scheduled/gares")
    @Transactional(readOnly = true)
    public List<Voyage> getScheduledVoyagesByGares(@RequestParam List<Long> gareIds) {
        return voyageService.findScheduledVoyagesByGares(gareIds);
    }

    // Enhanced Scheduler Endpoints
    /**
     * Process all active templates and generate instances
     */
    @PostMapping("/scheduler/process-templates")
    public ResponseEntity<Integer> processActiveTemplates() {
        int generated = voyageService.processActiveTemplates();
        return ResponseEntity.ok(generated);
    }

    /**
     * Batch generate instances for specific templates
     */
    @PostMapping("/scheduler/batch-generate")
    public ResponseEntity<Integer> batchGenerateInstances(
            @RequestBody List<Long> templateIds,
            @RequestParam(defaultValue = "50") int maxInstancesPerTemplate
    ) {
        int generated = voyageService.batchGenerateInstances(templateIds, maxInstancesPerTemplate);
        return ResponseEntity.ok(generated);
    }

    /**
     * Get instances generated from a template
     */
    @GetMapping("/scheduler/template/{templateId}/instances")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> getInstancesByTemplate(@PathVariable Long templateId) {
        List<Voyage> instances = voyageService.findInstancesByTemplate(templateId);
        return ResponseEntity.ok(instances);
    }

    /**
     * Update template and regenerate future instances
     */
    @PutMapping("/scheduler/template/{templateId}/update-and-regenerate")
    public ResponseEntity<List<Voyage>> updateTemplateAndRegenerate(
            @PathVariable Long templateId,
            @RequestBody Voyage updatedTemplate
    ) {
        List<Voyage> result = voyageService.updateTemplateAndRegenerate(templateId, updatedTemplate);
        return ResponseEntity.ok(result);
    }

    /**
     * Cancel future instances from a template
     */
    @PostMapping("/scheduler/template/{templateId}/cancel-future")
    public ResponseEntity<Integer> cancelFutureInstances(
            @PathVariable Long templateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate
    ) {
        int cancelled = voyageService.cancelFutureInstances(templateId, fromDate);
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping("/previous/{voyageurId}")
    @Transactional
    public ResponseEntity<List<Voyage>> previousVoyages(@PathVariable Long voyageurId) {
        try {
            List<Voyage> voyages = voyageService.findPreviousVoyages(voyageurId);
            return ResponseEntity.ok(voyages);
        } catch (Exception e) {
            // Return empty list instead of error for non-existent voyageur
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/by-reservation/{reservationId}")
    @Transactional(readOnly = true)
    public ResponseEntity<Voyage> getVoyageByReservationId(@PathVariable Long reservationId) {
        Voyage voyage = voyageService.findVoyageByReservationId(reservationId);
        return voyage != null ? ResponseEntity.ok(voyage) : ResponseEntity.notFound().build();
    }

    @GetMapping("/weekly-results")
    @Transactional(readOnly = true)
    public ResponseEntity<VoyageWeeklyResponse> getWeeklyResults(@ModelAttribute VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.getWeeklyResults(filter));
    }

    @GetMapping("/monthly-results")
    @Transactional(readOnly = true)
    public ResponseEntity<VoyageMonthlyResponse> getMonthlyResults(
            @RequestParam Long departureVilleId,
            @RequestParam Long arrivalVilleId,
            @RequestParam String month,
            @RequestParam(required = false) Long koperativeId,
            @RequestParam(required = false) Integer passengers,
            @RequestParam(required = false) String language
    ) {
        return ResponseEntity.ok(voyageService.getMonthlyResults(
                departureVilleId, arrivalVilleId, month, koperativeId, passengers, language));
    }
}
