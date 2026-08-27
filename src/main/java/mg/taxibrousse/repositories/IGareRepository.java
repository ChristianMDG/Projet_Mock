package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.GareEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IGareRepository extends JpaRepository<GareEntity, Long> {

    @EntityGraph(attributePaths = {"ville", "photos"})
    Optional<GareEntity> findWithDetailsById(Long id);

    @Query("""
                SELECT DISTINCT g FROM Gare g
                LEFT JOIN FETCH g.ville v
                LEFT JOIN FETCH g.guichets gui
                LEFT JOIN FETCH gui.koperative k
                WHERE ((:name IS NULL OR :name = '') OR LOWER(g.name) LIKE LOWER(CONCAT('%', :name, '%')))
                AND (:villeIds IS NULL OR v.id IN :villeIds)
                AND (:isClosed IS NULL OR g.isClosed = :isClosed)
                AND ((:koperativeName IS NULL OR :koperativeName = '') OR LOWER(k.name) LIKE CONCAT('%', LOWER(:koperativeName), '%'))
            """)
    List<GareEntity> findGares(@Param("villeIds") List<Long> villeIds, @Param("koperativeName") String koperativeName, @Param("name") String name, @Param("isClosed") Boolean isClosed);

    List<GareEntity> findByVilleId(Long villeId);

    /**
     * Find gares by excluding the provided IDs
     */
    List<GareEntity> findByIdNotIn(List<Long> ids);
}
