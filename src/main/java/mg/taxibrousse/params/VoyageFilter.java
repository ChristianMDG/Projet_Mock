package mg.taxibrousse.params;

import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
public class VoyageFilter {

    private Long koperativeId;
    private Long departureVilleId;
    private Long arrivalVilleId;
    private Long departureGareId;
    private Long arrivalGareId;
    private LocalDate departureDate;
    private VoyageStatusEnum status = VoyageStatusEnum.SCHEDULED;
    private List<String> statuses;
    private String language = "en";
    private Integer passengers;

    public LocalDate getDepartureDate() {
        return departureDate == null ? LocalDate.now() : departureDate;
    }

    public String getLanguage() {
        return language == null ? "en" : language;
    }

    public Integer getPassengers() {
        return passengers != null && passengers > 0 ? passengers : null;
    }
}
