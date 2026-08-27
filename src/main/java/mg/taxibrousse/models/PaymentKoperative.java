package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.PaymentKoperativeEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class PaymentKoperative extends BaseDto<PaymentKoperativeEntity> {

    private Voyage voyage;
    private PaymentStatusEnum status;
    private BigDecimal amount;
    private BigDecimal remainingAmount;
    private BigDecimal totalAmount;

    public static PaymentKoperative fromEntity(PaymentKoperativeEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new PaymentKoperative();
        model.setBaseDto(entity);
        model.setStatus(entity.getStatus());
        model.setAmount(entity.getAmount());
        model.setRemainingAmount(entity.getRemainingAmount());
        model.setTotalAmount(entity.getTotalAmount());
        return model;
    }

    public static PaymentKoperativeBuilder<?, ?> toBuilder(PaymentKoperativeEntity entity) {
        if (entity == null) {
            return PaymentKoperative.builder();
        }
        return PaymentKoperative.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .status(entity.getStatus())
                .amount(entity.getAmount())
                .remainingAmount(entity.getRemainingAmount())
                .totalAmount(entity.getTotalAmount());
    }

    public static PaymentKoperative fromEntityLight(PaymentKoperativeEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public PaymentKoperativeEntity toEntity(PaymentKoperativeEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, PaymentKoperativeEntity::new);
        setBaseEntity(entity);
        entity.setStatus(status);
        entity.setAmount(amount);
        entity.setRemainingAmount(remainingAmount);
        entity.setTotalAmount(totalAmount);
        return entity;
    }
}
