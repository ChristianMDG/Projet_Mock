package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CommissionEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Commission extends BaseDto<CommissionEntity> {

    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private BigDecimal frais;
    private Long koperativeId;

    public static Commission fromEntity(CommissionEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Commission();
        model.setBaseDto(entity);
        model.setMinAmount(entity.getMinAmount());
        model.setMaxAmount(entity.getMaxAmount());
        model.setFrais(entity.getFrais());
        model.setKoperativeId(entity.getKoperative() != null ? entity.getKoperative().getId() : null);
        return model;
    }

    public static CommissionBuilder<?, ?> toBuilder(CommissionEntity entity) {
        if (entity == null) {
            return Commission.builder();
        }
        return Commission.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .minAmount(entity.getMinAmount())
                .maxAmount(entity.getMaxAmount())
                .frais(entity.getFrais())
                .koperativeId(entity.getKoperative() != null ? entity.getKoperative().getId() : null);
    }

    public static Commission fromEntityLight(CommissionEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CommissionEntity toEntity(CommissionEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, CommissionEntity::new);
        setBaseEntity(entity);
        entity.setMinAmount(minAmount);
        entity.setMaxAmount(maxAmount);
        entity.setFrais(frais);
        return entity;
    }
}
