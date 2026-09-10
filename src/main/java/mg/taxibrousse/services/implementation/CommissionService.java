package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.CommissionEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.models.Commission;
import mg.taxibrousse.models.FraisTransaction;
import mg.taxibrousse.models.TarifMobileMoney;
import mg.taxibrousse.repositories.ICommissionRepository;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.services.ICommissionService;
import mg.taxibrousse.services.IFraisTransactionService;
import mg.taxibrousse.services.ITarifMobileMoneyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService implements ICommissionService {

    private final ICommissionRepository repository;
    private final IKoperativeRepository koperativeRepository;
    private final IFraisTransactionService fraisTransactionService;
    private final ITarifMobileMoneyService tarifMobileMoneyService;

    private static final BigDecimal COMMISSION_FEE_RATE = new BigDecimal("0.05");

    @Override
    @Transactional(readOnly = true)
    public List<Commission> findAll(Long koperativeId) {
        if (koperativeId != null) {
            return repository.findByKoperativeId(koperativeId).stream()
                    .map(Commission::fromEntity)
                    .toList();
        }
        return repository.findAll().stream()
                .map(Commission::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Commission> findAll(Long koperativeId, Pageable pageable) {
        if (koperativeId != null) {
            return repository.findByKoperativeId(koperativeId, pageable).map(Commission::fromEntity);
        }
        return repository.findAll(pageable).map(Commission::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Commission> findById(Long id) {
        return Optional.ofNullable(id).flatMap(repository::findById).map(Commission::fromEntity);
    }

    @Override
    @Transactional
    public Commission save(Commission commission) {
        if (commission == null) {
            throw new IllegalArgumentException("Commission cannot be null");
        }

        CommissionEntity entity = Optional.ofNullable(commission.getId()).flatMap(repository::findById).orElseGet(CommissionEntity::new);

        entity = commission.toEntity(entity);
        if (commission.getKoperativeId() != null) {
            var koperative = koperativeRepository.findById(commission.getKoperativeId()).orElseThrow(() -> new IllegalArgumentException("Cooperative not found with id: " + commission.getKoperativeId()));
            entity.setKoperative(koperative);
        }

        CommissionEntity saved = repository.save(entity);
        log.info("Saved Commission with id: {}", saved.getId());

        return Commission.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (id != null) {
            repository.deleteById(id);
            log.info("Deleted Commission with id: {}", id);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Commission> findByKoperativeIdAndAmount(Long koperativeId, BigDecimal amount) {
        return repository.findCommission(koperativeId, amount)
            .stream().findFirst()
            .map(Commission::fromEntity);
    }

    @Override
    @Transactional
    public void computeCommission(PaymentTransactionEntity transaction, ReservationEntity reservation) {
        Integer seatCount = reservation.getSeatCount();
        if (seatCount > 0) {
            BigDecimal totalAmount = reservation.getTotalAmount();
            BigDecimal paidAmount = transaction.getAmount();
            boolean isPartialPayment = paidAmount.compareTo(totalAmount) < 0;

            BigDecimal commissionFee = isPartialPayment
                    ? totalAmount.multiply(COMMISSION_FEE_RATE).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            transaction.setCommissionFee(commissionFee);

            Long koperativeId = reservation.getVoyage().getKoperative().getId();
            BigDecimal pricePerSeat = reservation.getVoyage().getPricePerSeat();

            BigDecimal commissionSeats = findByKoperativeIdAndAmount(koperativeId, pricePerSeat)
                    .map(commission -> commission.getFrais().multiply(BigDecimal.valueOf(seatCount)).setScale(2, RoundingMode.HALF_UP))
                    .orElse(BigDecimal.ZERO);
            transaction.setCommissionSeats(commissionSeats);

            BigDecimal montantTransfert = paidAmount.subtract(commissionSeats).max(BigDecimal.ZERO);
            transaction.setMontantTransfert(montantTransfert);

            log.info("Commission computed for transaction {}: commissionSeats={}, commissionFee={}, montantTransfert={}",
                    transaction.getTransactionReference(), commissionSeats, commissionFee, montantTransfert);
        }
    }

    @Override
    @Transactional
    public void computeFrais(PaymentTransactionEntity transaction) {
        String operatorName = transaction.getOperatorName();
        BigDecimal amount = transaction.getAmount();

        BigDecimal percentage = Optional.ofNullable(operatorName)
                .filter(StringUtils::hasText)
                .flatMap(fraisTransactionService::findByOperatorName)
                .map(FraisTransaction::getPourcentage)
                .orElse(BigDecimal.ZERO);

        BigDecimal fraisTransaction = amount.multiply(percentage).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        transaction.setFraisTransaction(fraisTransaction);

        BigDecimal fraisRetrait = BigDecimal.ZERO;
        BigDecimal fraisTransfert = BigDecimal.ZERO;

        if (StringUtils.hasText(operatorName)) {
            BigDecimal commissionSeats = transaction.getCommissionSeats();
            BigDecimal commissionFee = transaction.getCommissionFee();

            // fraisRetrait based on: totalAmount - (commissionFee + commissionSeats)
            BigDecimal retraitBase = amount.subtract(commissionFee.add(commissionSeats));
            Optional<TarifMobileMoney> retraitTarif = tarifMobileMoneyService.findTarifMobileMoney(operatorName, retraitBase);
            fraisRetrait = retraitTarif.map(TarifMobileMoney::getFraisRetrait).orElse(BigDecimal.ZERO);
            transaction.setFraisRetrait(fraisRetrait);

            // fraisTransfert based on: totalAmount - (commissionFee + commissionSeats) + fraisRetrait
            BigDecimal transfertBase = retraitBase.add(fraisRetrait);
            Optional<TarifMobileMoney> transfertTarif = tarifMobileMoneyService.findTarifMobileMoney(operatorName, transfertBase);
            fraisTransfert = transfertTarif.map(TarifMobileMoney::getFraisTransfert).orElse(BigDecimal.ZERO);
            transaction.setFraisTransfert(fraisTransfert);
        }

        // fraisTotal = fraisTransaction + fraisRetrait + fraisTransfert
        BigDecimal fraisTotal = fraisTransaction.add(fraisRetrait).add(fraisTransfert);
        transaction.setFraisTotal(fraisTotal);

        log.info("Frais computed for transaction {}: fraisTotal={}, fraisTransaction={}, fraisRetrait={}, fraisTransfert={}",
                transaction.getTransactionReference(), fraisTotal, fraisTransaction, fraisRetrait, fraisTransfert);

        // facturation.commission = (commissionSeats + commissionFee) - fraisTotal, computed last
        // because it depends on fraisTotal which is only known after computeFrais runs.
        Optional.ofNullable(transaction.getFacturation()).ifPresent(facturation -> {
            BigDecimal facturationCommission = transaction.getCommissionSeats().add(transaction.getCommissionFee()).subtract(fraisTotal);
            facturation.setCommission(facturationCommission);
            log.info("Facturation commission computed for transaction {}: commission={}", transaction.getTransactionReference(), facturationCommission);
        });
    }
}
