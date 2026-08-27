package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.entities.enums.VoyageTypeEnum;

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
    protected BigDecimal priceKoperative;
    protected VoyageStatusEnum status;
    protected VoyageTypeEnum typeVoyage;
    protected String description;
    protected Double pourcentageMinimumAvance;

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
        return toBuilder(entity).koperative(Koperative.fromEntity(entity.getKoperative(), false))
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
                .priceKoperative(entity.getPriceKoperative())
                .status(entity.getStatus())
                .typeVoyage(entity.getTypeVoyage())
                .description(entity.getDescription())
                .pourcentageMinimumAvance(entity.getPourcentageMinimumAvance())
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
        return toBuilder(entity).koperative(Koperative.fromEntity(entity.getKoperative(), false)).build();
    }

    /**
     * Search-page projection: koperative (id, name, phone, logoUrl, status),
     * departureGare and arrivalGare (id, name only — no nested ville).
     */
    public static Voyage fromEntityForSearch(VoyageEntity entity) {
        return toBuilder(entity).koperative(Koperative.fromEntityForSearch(entity.getKoperative()))
                .departureGare(Gare.fromEntityLight(entity.getDepartureGare()))
                .arrivalGare(Gare.fromEntityLight(entity.getArrivalGare()))
                .build();
    }

    public static Voyage fromEntityForGrouped(VoyageEntity entity) {
        return toBuilder(entity).koperative(Koperative.fromEntityForSearch(entity.getKoperative()))
                .departureGare(Gare.fromEntity(entity.getDepartureGare(), false))
                .arrivalGare(Gare.fromEntity(entity.getArrivalGare(), false))
                .classe(Classe.fromEntityLight(entity.getClasse()))
                .crafter(Crafter.fromEntityLight(entity.getCrafter()))
                .chauffeur(Chauffeur.fromEntityWithUser(entity.getChauffeur()))
                .build();
    }

    public String getKoperativeDepartureDateKey() {
        // Group by koperativeId, departureGareId, arrivalGareId, and departureTime to the minute
        String formattedDepartureTime = departureTime != null ? departureTime.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")) : "null";
        return "%s-%s-%s-%s".formatted(koperative != null ? koperative.getId() : "null",
                departureGare != null ? departureGare.getId() : "null",
                arrivalGare != null ? arrivalGare.getId() : "null",
                formattedDepartureTime);
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
        if (classe != null) {
            target.setClasse(classe.getId() != 0 ? classe.toEntity() : null);
        }
        target.setDepartureTime(departureTime);
        target.setEstimatedArrivalTime(estimatedArrivalTime);
        target.setActualArrivalTime(actualArrivalTime);
        target.setAvailableSeats(availableSeats);
        target.setPricePerSeat(pricePerSeat);
        target.setPriceKoperative(priceKoperative);
        Optional.ofNullable(status).ifPresent(target::setStatus);
        Optional.ofNullable(typeVoyage).ifPresent(target::setTypeVoyage);
        target.setDescription(description);
        target.setPourcentageMinimumAvance(getPourcentageMinimumAvance());

        // Map recurrence fields
        Optional.ofNullable(recurrenceType).ifPresent(target::setRecurrenceType);
        target.setCustomInterval(customInterval);
        target.setWeekdays(weekdays);
        target.setMonthlyDates(monthlyDates);
        target.setRecurrenceStartDate(recurrenceStartDate);
        target.setRecurrenceEndDate(recurrenceEndDate);
        Optional.ofNullable(isTemplate).ifPresent(target::setIsTemplate);
        target.setParentTemplate(parentTemplate != null ? parentTemplate.toEntity() : null);
        // generatedInstances not set here to avoid recursion

        return target;
    }
}
