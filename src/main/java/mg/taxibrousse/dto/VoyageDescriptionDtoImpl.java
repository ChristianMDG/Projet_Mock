package mg.taxibrousse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoyageDescriptionDtoImpl implements VoyageDescriptionDto {

    private String departureTimes;
    private String description;
    private String voyageIds;
    private LocalDate departureDate;
    private Long koperativeId;
    private Long gareId;
    private Long classeId;
    private String koperativeName;
    private String departureVille;
    private String arrivalVille;
    private String gareName;
}
