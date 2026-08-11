package mg.taxibrousse.services;

import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.models.PaymentTransaction;

import java.io.IOException;

public interface IPaymentService {

    PaymentTransaction initPayment(PaymentRequest request) throws IOException, InterruptedException;

    PaymentTransaction getPaymentStatus(String transactionReference);

    PaymentTransaction checkAndUpdateTransactionStatus(String transactionReference) throws IOException, InterruptedException;
}
