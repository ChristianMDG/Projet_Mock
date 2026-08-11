package mg.taxibrousse.services;

import mg.taxibrousse.dto.PaymentTransactionRequest;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.models.PaymentTransaction;

import java.util.List;

public interface IPaymentTransactionService extends IBaseService {
    PaymentTransaction create(PaymentTransactionRequest request);
    PaymentTransaction updateStatus(Long id, PaymentTransactionStatusEnum status);
    PaymentTransaction findById(Long id);
    PaymentTransaction findByReference(String reference);
    List<PaymentTransaction> findByFacturationId(Long facturationId);
}
