package mg.taxibrousse.services;

import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.models.Colis;

import java.util.List;

public interface IColisService {

    Colis save(Colis colis);

    Colis findById(Long id);

    List<Colis> findAll();

    void deleteById(Long id);

    List<Colis> findByStatus(ColisStatusEnum status);

    List<Colis> findByCrafterId(Long crafterId);

    List<Colis> findByReservationId(Long reservationId);

    List<Colis> findByKoperativeId(Long koperativeId);

    List<Colis> findByVoyageId(Long voyageId);

    List<Colis> findFilteredByVoyageId(Long voyageId, String search);
}
