package mg.taxibrousse.services;

import mg.taxibrousse.dto.VoyageClasses;
import mg.taxibrousse.dto.VoyageMonthlyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResponse;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.params.VoyageFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IVoyageService extends IBaseService {

    Voyage save(Voyage voyage);

    Page<Voyage> findAllVoyages(Pageable pageable);

    Voyage findVoyageById(Long id);

    void deleteById(Long id);

    List<Voyage> findVoyagesByKoperativeId(Long koperativeId);

    List<Voyage> scheduleVoyage(VoyageScheduler request);

    List<Voyage> generateRecurringInstances(Voyage template, int maxInstances);

    List<Voyage> findVoyagesByDateRange(LocalDate startDate, LocalDate endDate);

    List<Voyage> findAvailableVoyages(Long departureGareId, Long arrivalGareId, LocalDateTime departureDate);

    /**
     * Find scheduled voyages by gare ID
     *
     * @param gareId the ID of the gare
     * @return list of voyages
     */
    List<Voyage> findScheduledVoyagesByGare(Long gareId);

    /**
     * Find scheduled voyages by multiple gare IDs
     *
     * @param gareIds list of gare IDs
     * @return list of voyages
     */
    List<Voyage> findScheduledVoyagesByGares(List<Long> gareIds);

    /**
     * Find voyages applying filters for koperative, departure/arrival
     * locations, date and status
     */
    List<Voyage> findFilteredVoyages(VoyageFilter filter);

    /**
     * Find voyage by reservation ID
     *
     * @param reservationId the reservation ID
     * @return voyage associated with the reservation
     */
    Voyage findVoyageByReservationId(Long reservationId);

    Page<Voyage> findPreviousVoyages(Long voyageurId, Pageable pageable);

    VoyageWeeklyResponse getWeeklyResults(VoyageFilter filter);

    VoyageMonthlyResponse getMonthlyResults(Long departureVilleId, Long arrivalVilleId, String month, Long koperativeId, Integer passengers, String language);

    List<VoyageClasses> findGroupedFilteredVoyages(VoyageFilter filter);

    List<VoyageClasses> findGroupedFilteredVoyagesByKoperative(VoyageFilter filter);
}
