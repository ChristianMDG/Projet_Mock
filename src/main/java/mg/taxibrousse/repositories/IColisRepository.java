package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ColisEntity;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IColisRepository extends JpaRepository<ColisEntity, Long> {
    List<ColisEntity> findByStatus(ColisStatusEnum status);

    @Query("SELECT c FROM Colis c WHERE c.crafter.id = :crafterId")
    List<ColisEntity> findByCrafterId(@Param("crafterId") Long crafterId);

    @Query("SELECT c FROM Colis c WHERE c.reservation.id = :reservationId")
    List<ColisEntity> findByReservationId(@Param("reservationId") Long reservationId);

    @Query("SELECT c FROM Colis c WHERE c.crafter.koperative.id = :koperativeId")
    List<ColisEntity> findByKoperativeId(@Param("koperativeId") Long koperativeId);

    @Query("SELECT c FROM Colis c WHERE c.voyage.id = :voyageId")
    List<ColisEntity> findByVoyageId(@Param("voyageId") Long voyageId);
}
