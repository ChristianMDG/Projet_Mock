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

    @EntityGraph(attributePaths = {"guichets", "crafters", "proprietaire", "villes", "contrats", "voyages", "operateurs"})
    Optional<KoperativeEntity> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"proprietaire"})
    Optional<KoperativeEntity> findBasicById(Long id);

    Optional<KoperativeEntity> findBySlug(String slug);

    @Query("""
                SELECT DISTINCT k.id FROM Koperative k
                LEFT JOIN k.villes v
                WHERE ((:name IS NULL OR :name = '') OR LOWER(k.name) LIKE LOWER(CONCAT('%', :name, '%')))
                AND (:villeIds IS NULL OR v.id IN :villeIds)
                AND k.status IN ('ACTIVE', 'CONFIRMED')
            """)
    List<Long> findKoperativeIds(@Param("villeIds") List<Long> villeIds, @Param("name") String name, Pageable pageable);

    @EntityGraph(attributePaths = {"villes"})
    @Query("""
                SELECT k FROM Koperative k
                WHERE k.id IN :ids
                ORDER BY CASE WHEN k.status = 'CONFIRMED' THEN 0 ELSE 1 END, k.name
            """)
    List<KoperativeEntity> findKoperativesByIds(@Param("ids") List<Long> ids);

    @Query("""
            SELECT DISTINCT k FROM Koperative k
            JOIN k.voyages v
            JOIN v.reservations r
            WHERE r.voyageur.id = :voyageurId
            """)
    List<KoperativeEntity> findFavoriteKoperatives(Long voyageurId);

    List<KoperativeEntity> findByStatus(KoperativeStatusEnum status);

    @Query("""
                SELECT COUNT(k) FROM Koperative k
                WHERE k.status IN ('ACTIVE', 'CONFIRMED')
            """)
    Long countKoperatives();

    long countByStatus(KoperativeStatusEnum status);
}
