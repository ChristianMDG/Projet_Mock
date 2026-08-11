package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class PaymentTransaction extends BaseDto<PaymentTransactionEntity> {

    private Long facturationId;
    private String transactionReference;
    private String operatorName;
    private BigDecimal amount;
    private PaymentTransactionStatusEnum status;
    private String phoneNumber;
    private String serverCorrelationId;
    private String operatorResponse;
    private String failureReason;
    private String paymentUrl;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime initiatedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime completedAt;
    
    private Integer otpAttempts;

    public static PaymentTransaction fromEntity(PaymentTransactionEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new PaymentTransaction();
        model.setBaseDto(entity);
        model.setFacturationId(entity.getFacturation() != null ? entity.getFacturation().getId() : null);
        model.setTransactionReference(entity.getTransactionReference());
        model.setOperatorName(entity.getOperatorName());
        model.setAmount(entity.getAmount());
        model.setStatus(entity.getStatus());
        model.setPhoneNumber(entity.getPhoneNumber());
        model.setServerCorrelationId(entity.getServerCorrelationId());
        model.setOperatorResponse(entity.getOperatorResponse());
        model.setFailureReason(resolveFailureReason(entity));
        model.setInitiatedAt(entity.getInitiatedAt());
        model.setCompletedAt(entity.getCompletedAt());
        model.setOtpAttempts(entity.getOtpAttempts());
        return model;
    }

    public static PaymentTransactionBuilder<?, ?> toBuilder(PaymentTransactionEntity entity) {
        return PaymentTransaction.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .facturationId(entity.getFacturation() != null ? entity.getFacturation().getId() : null)
                .transactionReference(entity.getTransactionReference())
                .operatorName(entity.getOperatorName())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .phoneNumber(entity.getPhoneNumber())
                .serverCorrelationId(entity.getServerCorrelationId())
                .operatorResponse(entity.getOperatorResponse())
                .failureReason(resolveFailureReason(entity))
                .initiatedAt(entity.getInitiatedAt())
                .completedAt(entity.getCompletedAt())
                .otpAttempts(entity.getOtpAttempts());
    }

    public static PaymentTransaction fromEntityLight(PaymentTransactionEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public PaymentTransactionEntity toEntity(PaymentTransactionEntity entity) {
        entity = Objects.requireNonNullElse(entity, new PaymentTransactionEntity());
        setBaseEntity(entity);
        entity.setTransactionReference(transactionReference);
        entity.setOperatorName(operatorName);
        entity.setAmount(amount);
        entity.setStatus(status);
        entity.setPhoneNumber(phoneNumber);
        entity.setServerCorrelationId(serverCorrelationId);
        entity.setOperatorResponse(operatorResponse);
        entity.setInitiatedAt(initiatedAt);
        entity.setCompletedAt(completedAt);
        entity.setOtpAttempts(otpAttempts);
        return entity;
    }

    private static String resolveFailureReason(PaymentTransactionEntity entity) {
        if (entity.getStatus().isTerminal() && entity.getStatus() != PaymentTransactionStatusEnum.COMPLETED) {
            var response = entity.getOperatorResponse();
            if (response != null && response.startsWith("payment_error_")) {
                return response;
            }
        }
        return null;
    }
}
