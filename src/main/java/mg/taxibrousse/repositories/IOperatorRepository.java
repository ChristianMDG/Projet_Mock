package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.dto.OperateurSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOperatorRepository extends JpaRepository<UserOperatorEntity, Long> {

    @Query("SELECT DISTINCT uo FROM UserOperator uo JOIN uo.authorities a WHERE a.name = 'OPERATEUR'")
    List<UserOperatorEntity> findAllOperators();

    @Query("SELECT DISTINCT uo FROM UserOperator uo " + "LEFT JOIN FETCH uo.koperative k " + "LEFT JOIN FETCH uo.guichets g " + "WHERE uo.koperative.id = :koperativeId OR uo.isAdmin = true")
    List<UserOperatorEntity> findByKoperativeId(@Param("koperativeId") Long koperativeId);

    @Query("SELECT g FROM Guichet g JOIN g.operateurs o WHERE o.id = :userOperatorId")
    List<GuichetEntity> findGuichetsByUserOperatorId(@Param("userOperatorId") Long userOperatorId);

    @Query("""
            SELECT uo FROM UserOperator uo
            JOIN uo.authorities a
            WHERE a.name = 'OPERATEUR'
            AND (uo.username ILIKE %:search%
            OR uo.phone LIKE %:search%
            OR uo.email ILIKE %:search%
            OR uo.firstName ILIKE %:search%
            OR uo.lastName ILIKE %:search%
            OR uo.idNumber LIKE %:search%)
            """)
    List<UserOperatorEntity> findBySearchCriteria(@Param("search") String search);

    @Query(value = """
            SELECT DISTINCT uo FROM UserOperator uo
            LEFT JOIN FETCH uo.koperative k
            LEFT JOIN FETCH uo.departureGare dg
            WHERE (:#{#request.search} IS NULL OR :#{#request.search} = '' OR
                   uo.username ILIKE %:#{#request.search}% OR
                   uo.phone LIKE %:#{#request.search}% OR
                   uo.email ILIKE %:#{#request.search}% OR
                   uo.firstName ILIKE %:#{#request.search}% OR
                   uo.lastName ILIKE %:#{#request.search}% OR
                   uo.idNumber LIKE %:#{#request.search}%)
            AND (:#{#request.koperativeId} IS NULL OR k.id = :#{#request.koperativeId})
            AND (:#{#request.isActive} IS NULL OR uo.isActive = :#{#request.isActive})
            AND (:#{#request.gareId} IS NULL OR dg.id = :#{#request.gareId})
            """, countQuery = """
            SELECT COUNT(DISTINCT uo) FROM UserOperator uo
            LEFT JOIN uo.koperative k
            LEFT JOIN uo.departureGare dg
            WHERE (:#{#request.search} IS NULL OR :#{#request.search} = '' OR
                   uo.username ILIKE %:#{#request.search}% OR
                   uo.phone LIKE %:#{#request.search}% OR
                   uo.email ILIKE %:#{#request.search}% OR
                   uo.firstName ILIKE %:#{#request.search}% OR
                   uo.lastName ILIKE %:#{#request.search}% OR
                   uo.idNumber LIKE %:#{#request.search}%)
            AND (:#{#request.koperativeId} IS NULL OR k.id = :#{#request.koperativeId})
            AND (:#{#request.isActive} IS NULL OR uo.isActive = :#{#request.isActive})
            AND (:#{#request.gareId} IS NULL OR dg.id = :#{#request.gareId})
            """)
    Page<UserOperatorEntity> findAllPageable(@Param("request") OperateurSearchRequest request, Pageable pageable);
}
