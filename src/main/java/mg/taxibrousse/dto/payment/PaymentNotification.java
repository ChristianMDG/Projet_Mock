package mg.taxibrousse.dto.payment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.BaseEntity;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.utils.Labels;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@Setter
@Builder
public class PaymentNotification {

    private String transactionReference;
    private String serverCorrelationId;
    private PaymentTransactionStatusEnum status;
    private BigDecimal amount;
    private String operatorName;
    private String message;
    private String failureReason;
    private LocalDateTime timestamp;
    private Long reservationId;

    public static PaymentNotification fromEntity(PaymentTransactionEntity transaction) {
        return PaymentNotification.builder()
                .transactionReference(transaction.getTransactionReference())
                .serverCorrelationId(transaction.getServerCorrelationId())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .operatorName(transaction.getOperatorName())
                .message(buildMessage(transaction))
                .failureReason(buildFailureReason(transaction))
                .timestamp(LocalDateTime.now())
                .reservationId(getReservationId(transaction))
                .build();
    }

    private static String buildMessage(PaymentTransactionEntity transaction) {
        return switch (transaction.getStatus()) {
            case COMPLETED -> Labels.PAYMENT_STATUS_MSG_COMPLETED;
            case FAILED -> Labels.PAYMENT_STATUS_MSG_FAILED;
            case TIMEOUT -> Labels.PAYMENT_STATUS_MSG_TIMEOUT;
            case CANCELLED -> Labels.PAYMENT_STATUS_MSG_CANCELLED;
            case PENDING_OTP -> Labels.PAYMENT_STATUS_MSG_PENDING_OTP;
            case INITIATED -> Labels.PAYMENT_STATUS_MSG_PENDING;
            case OTP_VERIFIED, PROCESSING -> Labels.PAYMENT_STATUS_MSG_PROCESSING;
        };
    }

    private static Long getReservationId(PaymentTransactionEntity transaction) {
        return Optional.ofNullable(transaction.getFacturation()).map(FacturationEntity::getReservation).map(BaseEntity::getId).orElse(null);
    }

    private static String buildFailureReason(PaymentTransactionEntity transaction) {
        if (transaction.getStatus().isTerminal() && transaction.getStatus() != PaymentTransactionStatusEnum.COMPLETED) {
            var response = transaction.getOperatorResponse();
            if (response != null && response.startsWith("payment_error_")) {
                return response;
            }
        }
        return null;
    }
}
