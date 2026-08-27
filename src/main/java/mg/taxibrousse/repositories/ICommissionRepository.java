package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CommissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICommissionRepository extends JpaRepository<CommissionEntity, Long> {

    @Query("SELECT c FROM Commission c WHERE c.koperative.id = :koperativeId AND :amount >= c.minAmount AND :amount <= c.maxAmount ORDER BY c.minAmount DESC")
    List<CommissionEntity> findCommission(@Param("koperativeId") Long koperativeId, @Param("amount") BigDecimal amount);

    List<CommissionEntity> findByKoperativeId(Long koperativeId);

    Page<CommissionEntity> findByKoperativeId(Long koperativeId, Pageable pageable);
}
