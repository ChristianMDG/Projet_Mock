package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ProductImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductImageRepository extends JpaRepository<ProductImageEntity, Long> {

    List<ProductImageEntity> findByProductIdOrderByDisplayOrderAsc(Long productId);

    @Modifying
    @Query("UPDATE ProductImage pi SET pi.isPrimary = false WHERE pi.product.id = :productId")
    void clearPrimaryForProduct(@Param("productId") Long productId);
}
