package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, Long> {

    @Query("SELECT p FROM PaymentTransaction p " +
           "LEFT JOIN FETCH p.facturation f " +
           "LEFT JOIN FETCH f.reservation r " +
           "WHERE p.transactionReference = :reference")
    Optional<PaymentTransactionEntity> findByTransactionReference(@Param("reference") String reference);

    @Query("SELECT p FROM PaymentTransaction p " +
           "LEFT JOIN FETCH p.facturation f " +
           "LEFT JOIN FETCH f.reservation r " +
           "WHERE p.serverCorrelationId = :serverCorrelationId")
    Optional<PaymentTransactionEntity> findByServerCorrelationId(@Param("serverCorrelationId") String serverCorrelationId);

    List<PaymentTransactionEntity> findByFacturationId(Long facturationId);

    List<PaymentTransactionEntity> findByFacturationIdOrderByInitiatedAtDesc(Long facturationId);
}
