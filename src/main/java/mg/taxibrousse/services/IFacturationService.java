package mg.taxibrousse.services;

public interface IFacturationService {
    /**
     * Get existing facturation ID or create a new one for the given reservation
     * @param reservationId the reservation ID
     * @return the facturation ID
     */
    Long getOrCreateFacturation(Long reservationId);
}
