package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ChauffeurEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IChauffeurRepository extends JpaRepository<ChauffeurEntity, Long> {

    List<ChauffeurEntity> findByIsAvailable(Boolean isAvailable);

    @Query("SELECT DISTINCT c FROM Chauffeur c JOIN c.contrats ct WHERE ct.koperative.id = :koperativeId")
    List<ChauffeurEntity> findByKoperativeId(@Param("koperativeId") Long koperativeId);
}
