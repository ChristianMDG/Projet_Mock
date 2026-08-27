package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.VilleEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IVilleRepository extends JpaRepository<VilleEntity, Long> {

    List<VilleEntity> findAllByOrderByFrequenceDesc();

    List<VilleEntity> findTop20ByIsActiveTrueOrderByFrequenceDesc();

    @Query("SELECT v FROM Ville v WHERE v.isActive = true AND " + "(LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "(v.keywords IS NOT NULL AND LOWER(v.keywords) LIKE LOWER(CONCAT('%', :keyword, '%')))) " + "ORDER BY v.frequence DESC")
    List<VilleEntity> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT v FROM Ville v WHERE UPPER(v.name) IN :names AND v.isActive = true ORDER BY v.name ASC")
    List<VilleEntity> findByNamesIn(@Param("names") List<String> names);
}
