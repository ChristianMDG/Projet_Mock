package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.FraisTransactionEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class FraisTransaction extends BaseDto<FraisTransactionEntity> {

    private String operatorName;
    private BigDecimal pourcentage;

    public static FraisTransaction fromEntity(FraisTransactionEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new FraisTransaction();
        model.setBaseDto(entity);
        model.setOperatorName(entity.getOperatorName());
        model.setPourcentage(entity.getPourcentage());
        return model;
    }

    public static FraisTransactionBuilder<?, ?> toBuilder(FraisTransactionEntity entity) {
        if (entity == null) {
            return FraisTransaction.builder();
        }
        return FraisTransaction.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .operatorName(entity.getOperatorName())
                .pourcentage(entity.getPourcentage());
    }

    public static FraisTransaction fromEntityLight(FraisTransactionEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public FraisTransactionEntity toEntity(FraisTransactionEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, FraisTransactionEntity::new);
        setBaseEntity(entity);
        entity.setOperatorName(operatorName);
        entity.setPourcentage(pourcentage);
        return entity;
    }
}
