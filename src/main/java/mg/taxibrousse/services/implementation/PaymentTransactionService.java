package mg.taxibrousse.services.implementation;

import mg.taxibrousse.dto.PaymentTransactionRequest;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.exceptions.PaymentException;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IPaymentTransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static java.text.MessageFormat.*;

@Service
public class PaymentTransactionService implements IPaymentTransactionService {

    private final IPaymentTransactionRepository paymentTransactionRepository;
    private final IFacturationRepository facturationRepository;

    public PaymentTransactionService(
            IPaymentTransactionRepository paymentTransactionRepository,
            IFacturationRepository facturationRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.facturationRepository = facturationRepository;
    }

    @Override
    @Transactional
    public PaymentTransaction create(PaymentTransactionRequest request) {
        FacturationEntity facturation = facturationRepository.findById(request.getFacturationId())
                .orElseThrow(() -> new PaymentException("FACTURATION_NOT_FOUND", "exception_facturation_not_found"));

        PaymentTransactionEntity entity = new PaymentTransactionEntity();
        entity.setFacturation(facturation);
        entity.setTransactionReference(generateTransactionReference());
        entity.setOperatorName(request.getOperatorName());
        entity.setAmount(request.getAmount());
        entity.setStatus(PaymentTransactionStatusEnum.INITIATED);
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setInitiatedAt(LocalDateTime.now());
        entity.setOtpAttempts(0);

        PaymentTransactionEntity saved = paymentTransactionRepository.save(entity);
        return PaymentTransaction.fromEntity(saved);
    }

    @Override
    @Transactional
    public PaymentTransaction updateStatus(Long id, PaymentTransactionStatusEnum status) {
        PaymentTransactionEntity entity = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));

        entity.setStatus(status);
        
        if (isTerminalStatus(status)) {
            entity.setCompletedAt(LocalDateTime.now());
        }

        PaymentTransactionEntity saved = paymentTransactionRepository.save(entity);
        return PaymentTransaction.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentTransaction findById(Long id) {
        return paymentTransactionRepository.findById(id)
                .map(PaymentTransaction::fromEntity)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentTransaction findByReference(String reference) {
        return paymentTransactionRepository.findByTransactionReference(reference)
                .map(PaymentTransaction::fromEntity)
                .orElseThrow(() -> new PaymentException("TRANSACTION_NOT_FOUND", "exception_transaction_not_found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransaction> findByFacturationId(Long facturationId) {
        return paymentTransactionRepository.findByFacturationIdOrderByInitiatedAtDesc(facturationId)
                .stream()
                .map(PaymentTransaction::fromEntity)
                .toList();
    }

    private String generateTransactionReference() {
        return format("TXN{0}", UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }

    private boolean isTerminalStatus(PaymentTransactionStatusEnum status) {
        return status == PaymentTransactionStatusEnum.COMPLETED
                || status == PaymentTransactionStatusEnum.FAILED
                || status == PaymentTransactionStatusEnum.TIMEOUT
                || status == PaymentTransactionStatusEnum.CANCELLED;
    }
}
