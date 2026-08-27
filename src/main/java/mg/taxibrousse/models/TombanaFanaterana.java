package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.TombanaFanateranaEntity;
import mg.taxibrousse.entities.VilleEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class TombanaFanaterana extends BaseDto<TombanaFanateranaEntity> {

    private BigDecimal minWeight;
    private BigDecimal maxWeight;
    private BigDecimal frais;
    private DeliveryMethodEnum deliveryMethod;
    private Long villeId;
    private String villeName;

    public static TombanaFanaterana fromEntity(TombanaFanateranaEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new TombanaFanaterana();
        model.setBaseDto(entity);
        model.setMinWeight(entity.getMinWeight());
        model.setMaxWeight(entity.getMaxWeight());
        model.setFrais(entity.getFrais());
        model.setDeliveryMethod(entity.getDeliveryMethod());
        if (entity.getVille() != null) {
            model.setVilleId(entity.getVille().getId());
            model.setVilleName(entity.getVille().getName());
        }
        return model;
    }

    public static TombanaFanateranaBuilder<?, ?> toBuilder(TombanaFanateranaEntity entity) {
        if (entity == null) {
            return TombanaFanaterana.builder();
        }
        TombanaFanateranaBuilder<?, ?> builder = TombanaFanaterana.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .minWeight(entity.getMinWeight())
                .maxWeight(entity.getMaxWeight())
                .frais(entity.getFrais())
                .deliveryMethod(entity.getDeliveryMethod());
        if (entity.getVille() != null) {
            builder.villeId(entity.getVille().getId())
                   .villeName(entity.getVille().getName());
        }
        return builder;
    }

    public static TombanaFanaterana fromEntityLight(TombanaFanateranaEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public TombanaFanateranaEntity toEntity(TombanaFanateranaEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, TombanaFanateranaEntity::new);
        setBaseEntity(entity);
        if (entity.getId() != null && entity.getId() <= 0L) {
            entity.setId(null);
        }
        entity.setMinWeight(minWeight);
        entity.setMaxWeight(maxWeight);
        entity.setFrais(frais);
        entity.setDeliveryMethod(deliveryMethod);
        if (villeId != null) {
            VilleEntity v = new VilleEntity();
            v.setId(villeId);
            entity.setVille(v);
        }
        return entity;
    }
}
