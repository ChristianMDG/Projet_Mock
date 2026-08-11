package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.VoyageurEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IVoyageurRepository extends JpaRepository<VoyageurEntity, Long> {
    @Query(
        """
        SELECT v
        FROM Voyageur v
        WHERE v.phone = :phone
        OR v.idNumber = :idNumber
        """
    )
    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD)
    Optional<VoyageurEntity> findByPhoneOrIdNumber(@Param("phone") String phone, @Param("idNumber") String idNumber);
    
    @Query(
        """
        SELECT v
        FROM Voyageur v
        WHERE v.email = :email
        """
    )
    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD)
    Optional<VoyageurEntity> findByEmail(@Param("email") String email);
    
    Optional<VoyageurEntity> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByUsernameAndIdNot(String username, Long id);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
    
    long countByIsActive(Boolean isActive);
    
    Page<VoyageurEntity> findByIsActive(Boolean isActive, Pageable pageable);
    
    @Query(
        """
        SELECT v FROM Voyageur v
        WHERE LOWER(v.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """
    )
    Page<VoyageurEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query(
        """
        SELECT v FROM Voyageur v
        WHERE v.isActive = :isActive
        AND (LOWER(v.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(v.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
        """
    )
    Page<VoyageurEntity> searchByKeywordAndStatus(
        @Param("keyword") String keyword,
        @Param("isActive") Boolean isActive,
        Pageable pageable
    );
}
