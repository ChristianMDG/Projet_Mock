package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.LoyaltyConfigEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class LoyaltyConfig extends BaseDto<LoyaltyConfigEntity> {

    private BigDecimal kmPerFreeVoyage;
    private BigDecimal earnMultiplier;
    private Boolean isActive;

    public static LoyaltyConfig fromEntity(LoyaltyConfigEntity entity) {
        return fromEntityLight(entity);
    }

    public static LoyaltyConfigBuilder<?, ?> toBuilder(LoyaltyConfigEntity entity) {
        if (entity == null) {
            return LoyaltyConfig.builder();
        }
        return LoyaltyConfig.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .kmPerFreeVoyage(entity.getKmPerFreeVoyage())
                .earnMultiplier(entity.getEarnMultiplier())
                .isActive(entity.getIsActive());
    }

    public static LoyaltyConfig fromEntityLight(LoyaltyConfigEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public LoyaltyConfigEntity toEntity(LoyaltyConfigEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, LoyaltyConfigEntity::new);
        setBaseEntity(entity);
        entity.setKmPerFreeVoyage(kmPerFreeVoyage);
        entity.setEarnMultiplier(earnMultiplier);
        entity.setIsActive(isActive);
        return entity;
    }
}
