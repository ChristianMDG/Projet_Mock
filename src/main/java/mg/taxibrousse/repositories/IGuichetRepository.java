package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.GuichetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IGuichetRepository extends JpaRepository<GuichetEntity, Long> {
    List<GuichetEntity> findByKoperativeId(Long koperativeId);

    List<GuichetEntity> findByGareId(Long gareId);

    @Query("SELECT g FROM Guichet g LEFT JOIN FETCH g.operateurs WHERE g.gare.id = :gareId AND g.koperative.id = :koperativeId")
    Optional<GuichetEntity> findByGareIdAndKoperativeIdWithOperateurs(@Param("gareId") Long gareId, @Param("koperativeId") Long koperativeId);

    @Query("SELECT DISTINCT g FROM Guichet g " +
           "LEFT JOIN FETCH g.destinations d " +
           "LEFT JOIN FETCH d.ville " +
           "LEFT JOIN FETCH g.gare gare " +
           "LEFT JOIN FETCH gare.ville " +
           "WHERE g.koperative.id = :koperativeId AND g.isActive = true")
    List<GuichetEntity> findByKoperativeIdWithDestinations(@Param("koperativeId") Long koperativeId);
}
