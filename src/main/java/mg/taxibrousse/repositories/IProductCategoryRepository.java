package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Long> {

    Optional<ProductCategoryEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<ProductCategoryEntity> findAllByOrderByDisplayOrderAsc();

    List<ProductCategoryEntity> findByCategoryIdOrderByDisplayOrderAsc(Long parentId);
}
