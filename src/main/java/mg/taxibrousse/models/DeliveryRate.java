package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.DeliveryRateEntity;
import mg.taxibrousse.entities.DeliveryZoneEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class DeliveryRate extends BaseDto<DeliveryRateEntity> {

    private Long zoneId;
    private DeliveryMethodEnum method;
    private BigDecimal baseFee;
    private BigDecimal perKgFee;
    private Integer estimatedDaysMin;
    private Integer estimatedDaysMax;

    public static DeliveryRate fromEntity(DeliveryRateEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new DeliveryRate();
        model.setBaseDto(entity);
        if (entity.getZone() != null) {
            model.setZoneId(entity.getZone().getId());
        }
        model.setMethod(entity.getMethod());
        model.setBaseFee(entity.getBaseFee());
        model.setPerKgFee(entity.getPerKgFee());
        model.setEstimatedDaysMin(entity.getEstimatedDaysMin());
        model.setEstimatedDaysMax(entity.getEstimatedDaysMax());
        return model;
    }

    public static DeliveryRateBuilder<?, ?> toBuilder(DeliveryRateEntity entity) {
        if (entity == null) {
            return DeliveryRate.builder();
        }
        return DeliveryRate.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .zoneId(entity.getZone() != null ? entity.getZone().getId() : null)
                .method(entity.getMethod())
                .baseFee(entity.getBaseFee())
                .perKgFee(entity.getPerKgFee())
                .estimatedDaysMin(entity.getEstimatedDaysMin())
                .estimatedDaysMax(entity.getEstimatedDaysMax());
    }

    public static DeliveryRate fromEntityLight(DeliveryRateEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public DeliveryRateEntity toEntity(DeliveryRateEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, DeliveryRateEntity::new);
        setBaseEntity(entity);
        entity.setMethod(method);
        entity.setBaseFee(baseFee);
        entity.setPerKgFee(perKgFee);
        entity.setEstimatedDaysMin(estimatedDaysMin);
        entity.setEstimatedDaysMax(estimatedDaysMax);
        if (zoneId != null) {
            DeliveryZoneEntity zone = new DeliveryZoneEntity();
            zone.setId(zoneId);
            entity.setZone(zone);
        }
        return entity;
    }
}
