package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.entities.UserOperatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOperatorRepository extends JpaRepository<UserOperatorEntity, Long> {
    @Query("SELECT DISTINCT uo FROM UserOperator uo JOIN uo.authorities a WHERE a.name = 'OPERATEUR'")
    List<UserOperatorEntity> findAllOperators();

    @Query(
        "SELECT DISTINCT uo FROM UserOperator uo " +
        "LEFT JOIN FETCH uo.koperative k " +
        "LEFT JOIN FETCH uo.guichets g " +
        "WHERE uo.koperative.id = :koperativeId OR uo.isAdmin = true"
    )
    List<UserOperatorEntity> findByKoperativeId(@Param("koperativeId") Long koperativeId);

    @Query("SELECT g FROM Guichet g JOIN g.operateurs o WHERE o.id = :userOperatorId")
    List<GuichetEntity> findGuichetsByUserOperatorId(@Param("userOperatorId") Long userOperatorId);

    @Query(
        """
        SELECT uo FROM UserOperator uo
        JOIN uo.authorities a
        WHERE a.name = 'OPERATEUR'
        AND (uo.username ILIKE %:search%
        OR uo.phone LIKE %:search%
        OR uo.email ILIKE %:search%
        OR uo.firstName ILIKE %:search%
        OR uo.lastName ILIKE %:search%
        OR uo.idNumber LIKE %:search%)
        """
    )
    List<UserOperatorEntity> findBySearchCriteria(@Param("search") String search);

    @Query(
        """
        SELECT DISTINCT uo FROM UserOperator uo
        JOIN uo.authorities a
        LEFT JOIN FETCH uo.koperative k
        LEFT JOIN FETCH uo.guichets g
        LEFT JOIN FETCH g.gare gare
        WHERE a.name = 'OPERATEUR'
        AND (:search IS NULL OR :search = '' OR 
               uo.username ILIKE %:search% OR
               uo.phone LIKE %:search% OR
               uo.email ILIKE %:search% OR
               uo.firstName ILIKE %:search% OR
               uo.lastName ILIKE %:search% OR
               uo.idNumber LIKE %:search%)
        AND (:koperativeId IS NULL OR k.id = :koperativeId)
        AND (:isActive IS NULL OR uo.isActive = :isActive)
        AND (:gareId IS NULL OR gare.id = :gareId)
        ORDER BY uo.firstName, uo.lastName
        """
    )
    List<UserOperatorEntity> findByFilterCriteria(
        @Param("search") String search,
        @Param("koperativeId") Long koperativeId,
        @Param("isActive") Boolean isActive,
        @Param("gareId") Long gareId
    );
}
