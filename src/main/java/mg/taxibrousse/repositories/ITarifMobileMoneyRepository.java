package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.TarifMobileMoneyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ITarifMobileMoneyRepository extends JpaRepository<TarifMobileMoneyEntity, Long> {

    @Query("SELECT t FROM TarifMobileMoney t WHERE UPPER(t.operatorName) = UPPER(:operatorName) AND :amount >= t.minAmount AND :amount <= t.maxAmount ORDER BY t.minAmount DESC")
    List<TarifMobileMoneyEntity> findTarifMobileMoney(@Param("operatorName") String operatorName, @Param("amount") BigDecimal amount);

    List<TarifMobileMoneyEntity> findByOperatorNameIgnoreCase(String operatorName);
}
