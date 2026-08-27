package mg.taxibrousse.services;

import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.models.Commission;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ICommissionService {

    List<Commission> findAll(Long koperativeId);

    Page<Commission> findAll(Long koperativeId, Pageable pageable);

    Optional<Commission> findById(Long id);

    Commission save(Commission commission);

    void deleteById(Long id);

    Optional<Commission> findByKoperativeIdAndAmount(Long koperativeId, BigDecimal amount);

    void computeCommission(PaymentTransactionEntity transaction, ReservationEntity reservation);

    void computeFrais(PaymentTransactionEntity transaction);
}
