package mg.taxibrousse.models;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.entities.enums.VoyageTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoyageScheduler {

    private Long koperativeId;
    private Long routeId;
    private Long departureGareId;
    private Long arrivalGareId;
    private Long crafterId;
    private Long chauffeurId;
    private Long classeId;

    private LocalDateTime departureTime;
    private LocalDateTime estimatedArrivalTime;
    private Integer availableSeats;
    private BigDecimal pricePerSeat;
    private BigDecimal priceKoperative;
    private VoyageStatusEnum status;
    @Builder.Default
    private VoyageTypeEnum typeVoyage = VoyageTypeEnum.NATIONAL;
    private String description;
    @Builder.Default
    private Double pourcentageMinimumAvance = VoyageEntity.DEFAULT_POURCENTAGE_MINIMUM_AVANCE;

    // Recurrence settings
    @Builder.Default
    private RecurrenceTypeEnum recurrenceType = RecurrenceTypeEnum.ONE_OFF;
    private Integer customInterval;
    private List<Integer> weekdays; // 1=Monday, 7=Sunday
    private List<Integer> monthlyDates; // 1-31
    private LocalDate recurrenceStartDate;
    private LocalDate recurrenceEndDate;

    public Koperative getKoperative() {
        if (koperativeId == null) {
            return null;
        }
        var k = new Koperative();
        k.setId(koperativeId);
        return k;
    }

    public Route getRoute() {
        if (routeId == null) {
            return null;
        }
        var r = new Route();
        r.setId(routeId);
        return r;
    }

    public Gare getDepartureGare() {
        if (departureGareId == null) {
            return null;
        }
        var g = new Gare();
        g.setId(departureGareId);
        return g;
    }

    public Gare getArrivalGare() {
        if (arrivalGareId == null) {
            return null;
        }
        var g = new Gare();
        g.setId(arrivalGareId);
        return g;
    }

    public Classe getClasse() {
        if (classeId == null) {
            return null;
        }
        var c = new Classe();
        c.setId(classeId);
        return c;
    }

    public Crafter getCrafter() {
        if (crafterId == null) {
            return null;
        }
        var c = new Crafter();
        c.setId(crafterId);
        return c;
    }

    public Chauffeur getChauffeur() {
        if (chauffeurId == null) {
            return null;
        }
        var c = new Chauffeur();
        c.setId(chauffeurId);
        return c;
    }

    public Voyage toVoyage() {
        var voyage = new Voyage();
        voyage.setKoperative(getKoperative());
        voyage.setRoute(getRoute());
        voyage.setDepartureGare(getDepartureGare());
        voyage.setArrivalGare(getArrivalGare());
        voyage.setCrafter(getCrafter());
        voyage.setChauffeur(getChauffeur());
        voyage.setClasse(getClasse());
        voyage.setDepartureTime(departureTime);
        voyage.setEstimatedArrivalTime(estimatedArrivalTime);
        voyage.setAvailableSeats(availableSeats);
        voyage.setPricePerSeat(pricePerSeat);
        voyage.setPriceKoperative(priceKoperative);
        voyage.setStatus(status);
        voyage.setTypeVoyage(typeVoyage);
        voyage.setDescription(description);
        voyage.setPourcentageMinimumAvance(pourcentageMinimumAvance);
        voyage.setRecurrenceType(recurrenceType);
        voyage.setIsTemplate(false);
        return voyage;
    }

    public Voyage toTemplateVoyage(ObjectMapper objectMapper) {
        var template = toVoyage();
        template.setCustomInterval(customInterval);
        template.setRecurrenceStartDate(recurrenceStartDate);
        template.setRecurrenceEndDate(recurrenceEndDate);
        try {
            if (weekdays != null && !weekdays.isEmpty()) {
                template.setWeekdays(objectMapper.writeValueAsString(weekdays));
            }
            if (monthlyDates != null && !monthlyDates.isEmpty()) {
                template.setMonthlyDates(objectMapper.writeValueAsString(monthlyDates));
            }
        } catch (JsonProcessingException e) {
            // Optionally log or handle
        }
        return template;
    }
}
