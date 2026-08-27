package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.DeliveryZoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDeliveryZoneRepository extends JpaRepository<DeliveryZoneEntity, Long> {

    List<DeliveryZoneEntity> findByIsActiveTrue();

    boolean existsByName(String name);

    @Query("SELECT DISTINCT z FROM DeliveryZone z JOIN z.fokotanys f WHERE f.id = :fokotanyId AND z.isActive = true")
    Optional<DeliveryZoneEntity> findFirstActiveByFokotanyId(@Param("fokotanyId") Long fokotanyId);

    @Query("SELECT DISTINCT z FROM DeliveryZone z JOIN z.villes v WHERE v.id = :villeId AND z.isActive = true")
    Optional<DeliveryZoneEntity> findFirstActiveByVilleId(@Param("villeId") Long villeId);
}
