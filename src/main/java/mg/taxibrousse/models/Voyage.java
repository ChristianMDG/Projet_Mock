package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Voyage extends BaseDto<VoyageEntity> {

    protected Koperative koperative;
    protected Classe classe;
    protected Route route;
    protected Gare departureGare;
    protected Gare arrivalGare;
    protected Crafter crafter;
    protected Chauffeur chauffeur;
    protected LocalDateTime departureTime;
    protected LocalDateTime estimatedArrivalTime;
    protected LocalDateTime actualArrivalTime;
    protected Integer availableSeats;
    protected BigDecimal pricePerSeat;
    protected VoyageStatusEnum status;
    protected String description;

    // Recurrence fields
    protected RecurrenceTypeEnum recurrenceType;
    protected Integer customInterval;
    protected String weekdays;
    protected String monthlyDates;
    protected LocalDate recurrenceStartDate;
    protected LocalDate recurrenceEndDate;
    protected Boolean isTemplate;
    protected Voyage parentTemplate;
    protected List<Voyage> generatedInstances;

    public static Voyage fromEntity(VoyageEntity entity) {
        if (entity == null) {
            return null;
        }
        return toBuilder(entity)
                .koperative(Koperative.fromEntity(entity.getKoperative(), false))
                .classe(Classe.fromEntity(entity.getClasse()))
                .route(Route.fromEntity(entity.getRoute()))
                .departureGare(Gare.fromEntity(entity.getDepartureGare(), false))
                .arrivalGare(Gare.fromEntity(entity.getArrivalGare(), false))
                .crafter(Crafter.fromEntity(entity.getCrafter()))
                .chauffeur(Chauffeur.fromEntity(entity.getChauffeur()))
                .build();
    }

    public static VoyageBuilder<?, ?> toBuilder(VoyageEntity entity) {
        if (entity == null) {
            return Voyage.builder();
        }
        return Voyage.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .departureTime(entity.getDepartureTime())
                .estimatedArrivalTime(entity.getEstimatedArrivalTime())
                .actualArrivalTime(entity.getActualArrivalTime())
                .availableSeats(entity.getAvailableSeats())
                .pricePerSeat(entity.getPricePerSeat())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .recurrenceType(entity.getRecurrenceType())
                .customInterval(entity.getCustomInterval())
                .weekdays(entity.getWeekdays())
                .monthlyDates(entity.getMonthlyDates())
                .recurrenceStartDate(entity.getRecurrenceStartDate())
                .recurrenceEndDate(entity.getRecurrenceEndDate())
                .isTemplate(entity.getIsTemplate());
    }

    public static Voyage fromEntityLight(VoyageEntity entity) {
        return toBuilder(entity).build();
    }

    public static Voyage fromEntityLightWithKoperative(VoyageEntity entity) {
        return toBuilder(entity)
                .koperative(Koperative.fromEntity(entity.getKoperative(), false))
                .build();
    }

    @Override
    public VoyageEntity toEntity(VoyageEntity entity) {
        final VoyageEntity target = Objects.requireNonNullElse(entity, new VoyageEntity());
        setBaseEntity(target);
        Optional.ofNullable(koperative).ifPresent(k -> target.setKoperative(k.toEntity()));
        Optional.ofNullable(route).ifPresent(r -> target.setRoute(r.toEntity()));
        Optional.ofNullable(departureGare).ifPresent(g -> target.setDepartureGare(g.toEntity()));
        Optional.ofNullable(arrivalGare).ifPresent(g -> target.setArrivalGare(g.toEntity()));
        Optional.ofNullable(crafter).ifPresent(c -> target.setCrafter(c.toEntity()));
        Optional.ofNullable(chauffeur).ifPresent(c -> target.setChauffeur(c.toEntity()));
        Optional.ofNullable(classe).ifPresent(cl -> target.setClasse(cl.toEntity()));
        target.setDepartureTime(departureTime);
        target.setEstimatedArrivalTime(estimatedArrivalTime);
        target.setActualArrivalTime(actualArrivalTime);
        target.setAvailableSeats(availableSeats);
        target.setPricePerSeat(pricePerSeat);
        Optional.ofNullable(status).ifPresent(target::setStatus);
        target.setDescription(description);

        // Map recurrence fields
        Optional.ofNullable(recurrenceType).ifPresent(target::setRecurrenceType);
        target.setCustomInterval(customInterval);
        target.setWeekdays(weekdays);
        target.setMonthlyDates(monthlyDates);
        target.setRecurrenceStartDate(recurrenceStartDate);
        target.setRecurrenceEndDate(recurrenceEndDate);
        target.setIsTemplate(isTemplate);
        target.setParentTemplate(parentTemplate != null ? parentTemplate.toEntity() : null);
        // generatedInstances not set here to avoid recursion

        return target;
    }
}
