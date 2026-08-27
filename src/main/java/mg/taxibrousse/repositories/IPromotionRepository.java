package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.PromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPromotionRepository extends JpaRepository<PromotionEntity, Long> {

    Optional<PromotionEntity> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT p FROM ShopPromotion p WHERE p.isActive = true " + "AND (p.startDate IS NULL OR p.startDate <= :now) " + "AND (p.endDate IS NULL OR p.endDate >= :now)")
    List<PromotionEntity> findActive(@Param("now") LocalDateTime now);
}
