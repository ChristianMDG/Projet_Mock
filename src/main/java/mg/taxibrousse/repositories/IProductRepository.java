package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {

    Optional<ProductEntity> findFirstBySlug(String slug);

    Optional<ProductEntity> findFirstBySku(String sku);

    boolean existsBySlug(String slug);

    boolean existsBySku(String sku);

    Page<ProductEntity> findByIsActiveTrue(Pageable pageable);

    Page<ProductEntity> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    Page<ProductEntity> findByPriceBetweenAndIsActiveTrue(BigDecimal min, BigDecimal max, Pageable pageable);

    @Query("SELECT p FROM Product p " + "WHERE p.isActive = TRUE " + "AND p.id <> :productId " + "AND p.category.id = :categoryId " + "AND p.price BETWEEN :minPrice AND :maxPrice "
            + "ORDER BY ABS(p.price - :pivotPrice) ASC, p.rating DESC NULLS LAST")
    List<ProductEntity> findRelatedProducts(@Param("productId") Long productId, @Param("categoryId") Long categoryId, @Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice,
            @Param("pivotPrice") BigDecimal pivotPrice, Pageable pageable);
}
