package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, Long> {

    @Query("SELECT p FROM PaymentTransaction p " + "LEFT JOIN FETCH p.facturation f " + "LEFT JOIN FETCH f.reservation r " + "WHERE p.transactionReference = :reference")
    Optional<PaymentTransactionEntity> findByTransactionReference(@Param("reference") String reference);

    @Query("SELECT p FROM PaymentTransaction p " + "LEFT JOIN FETCH p.facturation f " + "LEFT JOIN FETCH f.reservation r " + "WHERE p.serverCorrelationId = :serverCorrelationId")
    Optional<PaymentTransactionEntity> findByServerCorrelationId(@Param("serverCorrelationId") String serverCorrelationId);

    List<PaymentTransactionEntity> findByFacturationId(Long facturationId);

    List<PaymentTransactionEntity> findByFacturationIdOrderByInitiatedAtDesc(Long facturationId);

    @Query("SELECT p FROM PaymentTransaction p WHERE p.facturation.reservation.id = :reservationId ORDER BY p.initiatedAt DESC")
    List<PaymentTransactionEntity> findByReservationIdOrderByInitiatedAtDesc(@Param("reservationId") Long reservationId);

    @Modifying
    @Query("UPDATE PaymentTransaction p SET p.fraisRetrait = 0 WHERE p.facturation.id = :facturationId AND p.status = 'COMPLETED'")
    void resetFraisRetraitByFacturationId(@Param("facturationId") Long facturationId);

    @Query("SELECT p FROM PaymentTransaction p " +
           "LEFT JOIN FETCH p.facturation f " +
           "LEFT JOIN FETCH f.reservation r " +
           "LEFT JOIN FETCH r.voyage v " +
           "LEFT JOIN FETCH v.koperative k " +
           "WHERE (p.completedAt >= :from OR p.initiatedAt >= :from) " +
           "AND (p.completedAt <= :to OR p.initiatedAt <= :to) " +
           "AND (cast(:koperativeId as Long) IS NULL OR k.id = :koperativeId) " +
           "ORDER BY p.initiatedAt ASC")
    List<PaymentTransactionEntity> findTransactionsForStats(
            @Param("from") java.time.LocalDateTime from,
            @Param("to") java.time.LocalDateTime to,
            @Param("koperativeId") Long koperativeId);
}
