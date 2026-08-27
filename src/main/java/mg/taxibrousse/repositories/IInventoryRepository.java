package mg.taxibrousse.repositories;

import jakarta.persistence.LockModeType;
import mg.taxibrousse.entities.InventoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IInventoryRepository extends JpaRepository<InventoryEntity, Long> {

    @Lock(LockModeType.OPTIMISTIC)
    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND (:variantId IS NULL AND i.variant IS NULL OR i.variant.id = :variantId)")
    Optional<InventoryEntity> findByProductAndVariantForUpdate(@Param("productId") Long productId, @Param("variantId") Long variantId);

    Optional<InventoryEntity> findFirstByProductIdAndVariantIsNull(Long productId);

    Optional<InventoryEntity> findFirstByProductIdAndVariantId(Long productId, Long variantId);

    @Query("SELECT i FROM Inventory i " + "WHERE (:productId IS NULL OR i.product.id = :productId) " + "AND (:variantId IS NULL OR i.variant.id = :variantId) "
            + "AND (:lowStock = false OR (i.quantity - i.reserved) < :threshold)")
    Page<InventoryEntity> searchInventory(@Param("productId") Long productId, @Param("variantId") Long variantId, @Param("lowStock") boolean lowStock, @Param("threshold") int threshold,
            Pageable pageable);
}
