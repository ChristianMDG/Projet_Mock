package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICategoryRepository extends JpaRepository<CategoryEntity, Long> {

    Optional<CategoryEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<CategoryEntity> findAllByOrderByDisplayOrderAsc();
}
