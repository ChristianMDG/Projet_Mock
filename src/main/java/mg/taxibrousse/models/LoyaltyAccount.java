package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.LoyaltyAccountEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class LoyaltyAccount extends BaseDto<LoyaltyAccountEntity> {

    private Long voyageurId;
    private BigDecimal kmEarned;
    private BigDecimal kmRedeemed;

    public static LoyaltyAccount fromEntity(LoyaltyAccountEntity entity) {
        return fromEntityLight(entity);
    }

    public static LoyaltyAccountBuilder<?, ?> toBuilder(LoyaltyAccountEntity entity) {
        if (entity == null) {
            return LoyaltyAccount.builder();
        }
        return LoyaltyAccount.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .voyageurId(entity.getVoyageurId())
                .kmEarned(entity.getKmEarned())
                .kmRedeemed(entity.getKmRedeemed());
    }

    public static LoyaltyAccount fromEntityLight(LoyaltyAccountEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public LoyaltyAccountEntity toEntity(LoyaltyAccountEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, LoyaltyAccountEntity::new);
        setBaseEntity(entity);
        entity.setVoyageurId(voyageurId);
        entity.setKmEarned(kmEarned);
        entity.setKmRedeemed(kmRedeemed);
        return entity;
    }
}
