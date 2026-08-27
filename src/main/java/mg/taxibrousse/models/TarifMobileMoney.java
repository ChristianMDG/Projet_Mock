package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.TarifMobileMoneyEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class TarifMobileMoney extends BaseDto<TarifMobileMoneyEntity> {

    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private BigDecimal fraisRetrait;
    private BigDecimal fraisTransfert;
    private String operatorName;

    public static TarifMobileMoney fromEntity(TarifMobileMoneyEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new TarifMobileMoney();
        model.setBaseDto(entity);
        model.setMinAmount(entity.getMinAmount());
        model.setMaxAmount(entity.getMaxAmount());
        model.setFraisRetrait(entity.getFraisRetrait());
        model.setFraisTransfert(entity.getFraisTransfert());
        model.setOperatorName(entity.getOperatorName());
        return model;
    }

    public static TarifMobileMoneyBuilder<?, ?> toBuilder(TarifMobileMoneyEntity entity) {
        if (entity == null) {
            return TarifMobileMoney.builder();
        }
        return TarifMobileMoney.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .minAmount(entity.getMinAmount())
                .maxAmount(entity.getMaxAmount())
                .fraisRetrait(entity.getFraisRetrait())
                .fraisTransfert(entity.getFraisTransfert())
                .operatorName(entity.getOperatorName());
    }

    public static TarifMobileMoney fromEntityLight(TarifMobileMoneyEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public TarifMobileMoneyEntity toEntity(TarifMobileMoneyEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, TarifMobileMoneyEntity::new);
        setBaseEntity(entity);
        entity.setMinAmount(minAmount);
        entity.setMaxAmount(maxAmount);
        entity.setFraisRetrait(fraisRetrait);
        entity.setFraisTransfert(fraisTransfert);
        entity.setOperatorName(operatorName);
        return entity;
    }
}
