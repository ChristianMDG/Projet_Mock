package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.DeliveryZoneEntity;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class DeliveryZone extends BaseDto<DeliveryZoneEntity> {

    private String name;
    private Boolean isActive;
    private Set<Long> villeIds;
    private Set<Long> fokotanyIds;
    private List<DeliveryRate> rates;

    public static DeliveryZone fromEntity(DeliveryZoneEntity entity) {
        return fromEntity(entity, null);
    }

    public static DeliveryZone fromEntity(DeliveryZoneEntity entity, List<DeliveryRate> rates) {
        if (entity == null) {
            return null;
        }
        var model = new DeliveryZone();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setIsActive(entity.getIsActive());
        model.setVilleIds(entity.getVilles() == null ? Set.of() : entity.getVilles().stream().map(v -> v.getId()).collect(Collectors.toSet()));
        model.setFokotanyIds(entity.getFokotanys() == null ? Set.of() : entity.getFokotanys().stream().map(f -> f.getId()).collect(Collectors.toSet()));
        model.setRates(rates);
        return model;
    }

    public static DeliveryZoneBuilder<?, ?> toBuilder(DeliveryZoneEntity entity) {
        if (entity == null) {
            return DeliveryZone.builder();
        }
        return DeliveryZone.builder().id(entity.getId()).createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt()).name(entity.getName()).isActive(entity.getIsActive());
    }

    public static DeliveryZone fromEntityLight(DeliveryZoneEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public DeliveryZoneEntity toEntity(DeliveryZoneEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, DeliveryZoneEntity::new);
        setBaseEntity(entity);
        entity.setName(name);
        entity.setIsActive(isActive);
        return entity;
    }
}
