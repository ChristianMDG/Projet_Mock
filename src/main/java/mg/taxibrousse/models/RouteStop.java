package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.RouteStopEntity;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class RouteStop extends BaseDto<RouteStopEntity> {

    private Integer stopOrder;
    private LocalDateTime estimatedArrival;
    private LocalDateTime estimatedDeparture;
    private Boolean isMandatory;

    public static RouteStop fromEntity(RouteStopEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new RouteStop();
        model.setBaseDto(entity);
        model.setStopOrder(entity.getStopOrder());
        model.setEstimatedArrival(entity.getEstimatedArrival());
        model.setEstimatedDeparture(entity.getEstimatedDeparture());
        model.setIsMandatory(entity.getIsMandatory());
        return model;
    }

    public static RouteStopBuilder<?, ?> toBuilder(RouteStopEntity entity) {
        return RouteStop.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .stopOrder(entity.getStopOrder())
                .estimatedArrival(entity.getEstimatedArrival())
                .estimatedDeparture(entity.getEstimatedDeparture())
                .isMandatory(entity.getIsMandatory());
    }

    public static RouteStop fromEntityLight(RouteStopEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public RouteStopEntity toEntity(RouteStopEntity entity) {
        entity = Objects.requireNonNullElse(entity, new RouteStopEntity());
        setBaseEntity(entity);
        entity.setStopOrder(stopOrder);
        entity.setEstimatedArrival(estimatedArrival);
        entity.setEstimatedDeparture(estimatedDeparture);
        entity.setIsMandatory(isMandatory);
        return entity;
    }
}
