package mg.taxibrousse.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.entities.enums.DepartureTimeGroupEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VoyageWeeklyResult {

    private Long resultId;
    private LocalDate date;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal avgPrice;
    private Integer totalVoyages;
    private Integer totalAvailableSeats;
    private Boolean hasVoyages;
    private List<Koperative> koperatives;
    private List<Voyage> voyages;
    private List<DepartureTimeGroupEnum> availableTimeGroups;
}
