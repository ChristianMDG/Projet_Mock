package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Facturation extends BaseDto<FacturationEntity> {

    private String invoiceNumber;
    private BigDecimal amount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BigDecimal remainingAmount;
    private String paymentReference;
    private PaymentStatusEnum paymentStatus;
    private LocalDateTime paymentDate;
    private LocalDateTime dueDate;

    public static Facturation fromEntity(FacturationEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Facturation();
        model.setBaseDto(entity);
        model.setInvoiceNumber(entity.getInvoiceNumber());
        model.setAmount(entity.getAmount());
        model.setTaxAmount(entity.getTaxAmount());
        model.setTotalAmount(entity.getTotalAmount());
        model.setRemainingAmount(entity.getRemainingAmount());
        model.setPaymentReference(entity.getPaymentReference());
        model.setPaymentStatus(entity.getPaymentStatus());
        model.setPaymentDate(entity.getPaymentDate());
        model.setDueDate(entity.getDueDate());
        return model;
    }

    public static FacturationBuilder<?, ?> toBuilder(FacturationEntity entity) {
        return Facturation.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .invoiceNumber(entity.getInvoiceNumber())
                .amount(entity.getAmount())
                .taxAmount(entity.getTaxAmount())
                .totalAmount(entity.getTotalAmount())
                .remainingAmount(entity.getRemainingAmount())
                .paymentReference(entity.getPaymentReference())
                .paymentStatus(entity.getPaymentStatus())
                .paymentDate(entity.getPaymentDate())
                .dueDate(entity.getDueDate());
    }

    public static Facturation fromEntityLight(FacturationEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public FacturationEntity toEntity(FacturationEntity entity) {
        entity = Objects.requireNonNullElse(entity, new FacturationEntity());
        setBaseEntity(entity);
        entity.setInvoiceNumber(invoiceNumber);
        entity.setAmount(amount);
        entity.setTaxAmount(taxAmount);
        entity.setTotalAmount(totalAmount);
        entity.setRemainingAmount(remainingAmount);
        entity.setPaymentReference(paymentReference);
        entity.setPaymentStatus(paymentStatus);
        entity.setPaymentDate(paymentDate);
        entity.setDueDate(dueDate);
        return entity;
    }
}
