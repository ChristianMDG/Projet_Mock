package mg.taxibrousse.services;

import mg.taxibrousse.models.Facturation;
import mg.taxibrousse.models.Voyage;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IFacturationService {

    /**
     * Get existing facturation ID or create a new one for the given reservation
     *
     * @param reservationId the reservation ID
     * @return the facturation ID
     */
    Long getOrCreateFacturation(Long reservationId);

    /**
     * Find all facturations
     *
     * @return list of all facturations
     */
    List<Facturation> findAll();

    /**
     * Find facturation by ID
     *
     * @param id the facturation ID
     * @return optional facturation
     */
    Optional<Facturation> findById(Long id);

    /**
     * Find facturations by reservation ID
     *
     * @param reservationId the reservation ID
     * @return list of facturations
     */
    List<Facturation> findByReservationId(Long reservationId);

    /**
     * Find voyages with their facturation status, filtered by departure date and koperative
     * Returns all voyages (with or without facturations) to show payment status
     *
     * @param departureDate departure date filter (exact match)
     * @param koperativeId koperative ID filter
     * @return list of voyages with facturation information
     */
    List<Voyage> findVoyagesWithFacturationStatus(LocalDate departureDate, Long koperativeId);
}
