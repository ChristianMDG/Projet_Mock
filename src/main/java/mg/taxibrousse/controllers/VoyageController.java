package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IVoyageController;
import mg.taxibrousse.dto.VoyageAvailabilityRequest;
import mg.taxibrousse.dto.VoyageClasses;
import mg.taxibrousse.dto.VoyageMonthlyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResponse;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.params.VoyageFilter;
import mg.taxibrousse.services.IVoyageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class VoyageController implements IVoyageController {

    private final IVoyageService voyageService;

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<Page<Voyage>> listVoyages(Pageable pageable) {
        return ResponseEntity.ok(voyageService.findAllVoyages(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> listVoyagesByKoperative(Long koperativeId) {
        return ResponseEntity.ok(voyageService.findVoyagesByKoperativeId(koperativeId));
    }

    @Override
    public ResponseEntity<Voyage> createVoyage(Voyage voyage) {
        return ResponseEntity.ok(voyageService.save(voyage));
    }

    @Override
    public ResponseEntity<Voyage> updateVoyage(Long id, Voyage voyage) {
        voyage.setId(id);
        return ResponseEntity.ok(voyageService.save(voyage));
    }

    @Override
    public ResponseEntity<Void> deleteVoyage(Long id) {
        voyageService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Voyage>> scheduleVoyage(VoyageScheduler request) {
        List<Voyage> voyages = voyageService.scheduleVoyage(request);
        return ResponseEntity.ok(voyages);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<Voyage> getVoyageDetails(Long id) {
        Voyage voyage = voyageService.findVoyageById(id);
        return voyage != null ? ResponseEntity.ok(voyage) : ResponseEntity.notFound().build();
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> findAvailableVoyages(VoyageAvailabilityRequest request) {
        LocalDateTime departureDateTime = request.getDepartureDate().atStartOfDay();
        return ResponseEntity.ok(voyageService.findAvailableVoyages(request.getDepartureGareId(), request.getArrivalGareId(), departureDateTime));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> findVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        return ResponseEntity.ok(voyageService.findVoyagesByDateRange(startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> findFilteredVoyages(VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.findFilteredVoyages(filter));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<VoyageClasses>> findGroupedFilteredVoyages(VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.findGroupedFilteredVoyages(filter));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<VoyageClasses>> findGroupedFilteredVoyagesByKoperative(VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.findGroupedFilteredVoyagesByKoperative(filter));
    }

    @Override
    public ResponseEntity<List<Voyage>> generateRecurringInstances(Long templateId, int maxInstances) {
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
    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> getScheduledVoyagesByGare(Long gareId) {
        return ResponseEntity.ok(voyageService.findScheduledVoyagesByGare(gareId));
    }

    /**
     * Get scheduled voyages by multiple gare IDs
     *
     * @param gareIds list of gare IDs
     * @return list of voyages
     */
    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voyage>> getScheduledVoyagesByGares(List<Long> gareIds) {
        return ResponseEntity.ok(voyageService.findScheduledVoyagesByGares(gareIds));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<Page<Voyage>> previousVoyages(Long voyageurId, Pageable pageable) {
        try {
            return ResponseEntity.ok(voyageService.findPreviousVoyages(voyageurId, pageable));
        } catch (Exception e) {
            return ResponseEntity.ok(Page.empty(pageable));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<Voyage> getVoyageByReservationId(Long reservationId) {
        Voyage voyage = voyageService.findVoyageByReservationId(reservationId);
        return voyage != null ? ResponseEntity.ok(voyage) : ResponseEntity.notFound().build();
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<VoyageWeeklyResponse> getWeeklyResults(VoyageFilter filter) {
        return ResponseEntity.ok(voyageService.getWeeklyResults(filter));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<VoyageMonthlyResponse> getMonthlyResults(Long departureVilleId, Long arrivalVilleId, String month, Long koperativeId, Integer passengers, String language) {
        return ResponseEntity.ok(voyageService.getMonthlyResults(departureVilleId, arrivalVilleId, month, koperativeId, passengers, language));
    }
}
