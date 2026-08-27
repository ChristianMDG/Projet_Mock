package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.DeliveryRateEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDeliveryRateRepository extends JpaRepository<DeliveryRateEntity, Long> {

    List<DeliveryRateEntity> findByZoneId(Long zoneId);

    Optional<DeliveryRateEntity> findByZoneIdAndMethod(Long zoneId, DeliveryMethodEnum method);
}
