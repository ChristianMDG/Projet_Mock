package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.RouteEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Route extends BaseDto<RouteEntity> {

    protected String name;
    protected Gare departureGare;
    protected Gare arrivalGare;
    protected BigDecimal estimatedDurationHours;
    protected BigDecimal distanceKm;
    protected BigDecimal fraisTaxibrousse;
    protected BigDecimal fraisKoperative;
    protected String description;
    protected Boolean isActive;
    protected List<RouteStop> routeStops;
    protected List<Voyage> voyages;

    public static Route fromEntity(RouteEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Route();
        model.setBaseDto(entity);
        model.name = entity.getName();
        model.departureGare = Optional.ofNullable(entity.getDepartureGare()).map(Gare::fromEntity).orElse(null);
        model.arrivalGare = Optional.ofNullable(entity.getArrivalGare()).map(Gare::fromEntity).orElse(null);
        model.estimatedDurationHours = entity.getEstimatedDurationHours();
        model.distanceKm = entity.getDistanceKm();
        model.fraisTaxibrousse = entity.getFraisTaxibrousse();
        model.fraisKoperative = entity.getFraisKoperative();
        model.description = entity.getDescription();
        model.isActive = entity.getIsActive();

        return model;
    }

    public static RouteBuilder<?, ?> toBuilder(RouteEntity entity) {
        if (entity == null) {
            return Route.builder();
        }
        return Route.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .estimatedDurationHours(entity.getEstimatedDurationHours())
                .distanceKm(entity.getDistanceKm())
                .fraisTaxibrousse(entity.getFraisTaxibrousse())
                .fraisKoperative(entity.getFraisKoperative())
                .description(entity.getDescription())
                .isActive(entity.getIsActive());
    }

    public static Route fromEntityLight(RouteEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public RouteEntity toEntity(RouteEntity entity) {
        entity = Objects.requireNonNullElse(entity, new RouteEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setDepartureGare(Optional.ofNullable(departureGare).map(Gare::toEntity).orElse(null));
        entity.setArrivalGare(Optional.ofNullable(arrivalGare).map(Gare::toEntity).orElse(null));
        entity.setEstimatedDurationHours(estimatedDurationHours);
        entity.setDistanceKm(distanceKm);
        entity.setFraisTaxibrousse(fraisTaxibrousse);
        entity.setFraisKoperative(fraisKoperative);
        entity.setDescription(description);
        entity.setIsActive(isActive);
        return entity;
    }
}
