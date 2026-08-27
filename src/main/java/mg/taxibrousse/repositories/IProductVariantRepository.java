package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductVariantRepository extends JpaRepository<ProductVariantEntity, Long> {

    List<ProductVariantEntity> findByProductId(Long productId);

    boolean existsBySku(String sku);
}
