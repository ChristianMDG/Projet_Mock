package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IKoperativeRepository extends JpaRepository<KoperativeEntity, Long> {
    @EntityGraph(
        attributePaths = { "guichets", "crafters", "proprietaire", "villes", "contrats", "voyages", "operateurs" }
    )
    Optional<KoperativeEntity> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = { "proprietaire" })
    Optional<KoperativeEntity> findBasicById(Long id);

    @EntityGraph(attributePaths = { "villes" })
    @Query(
        """
            SELECT k FROM Koperative k
            LEFT JOIN FETCH k.villes v
            WHERE ((:name IS NULL OR :name = '') OR LOWER(k.name) LIKE LOWER(CONCAT('%', :name, '%')))
            AND (:villeIds IS NULL OR v.id IN :villeIds)
            AND k.status IN ('ACTIVE', 'CONFIRMED')
            ORDER BY CASE WHEN k.status = 'CONFIRMED' THEN 0 ELSE 1 END, k.name
        """
    )
    List<KoperativeEntity> findKoperatives(@Param("villeIds") List<Long> villeIds, @Param("name") String name, Pageable pageable);

    @Query(
            """
            SELECT DISTINCT k FROM Koperative k
            JOIN k.voyages v
            JOIN v.reservations r
            WHERE r.voyageur.id = :voyageurId
            """
    )
    List<KoperativeEntity> findFavoriteKoperatives(Long voyageurId);

    List<KoperativeEntity> findByStatus(KoperativeStatusEnum status);

    @Query(
        """
            SELECT COUNT(k) FROM Koperative k
            WHERE k.status IN ('ACTIVE', 'CONFIRMED')
        """
    )
    Long countKoperatives();

    long countByStatus(KoperativeStatusEnum status);
}
