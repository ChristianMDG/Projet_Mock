package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.TombanaFanateranaEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface ITombanaFanateranaRepository extends JpaRepository<TombanaFanateranaEntity, Long>, JpaSpecificationExecutor<TombanaFanateranaEntity> {

    @Query("SELECT t FROM TombanaFanaterana t WHERE t.ville.id = :villeId AND t.deliveryMethod = :method AND :weight >= t.minWeight AND :weight <= t.maxWeight")
    Optional<TombanaFanateranaEntity> findTombana(@Param("villeId") Long villeId, @Param("method") DeliveryMethodEnum method, @Param("weight") BigDecimal weight);
}
