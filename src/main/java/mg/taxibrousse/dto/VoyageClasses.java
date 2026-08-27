package mg.taxibrousse.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Voyage;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VoyageClasses {

    private Koperative koperative;
    private Gare departureGare;
    private Gare arrivalGare;
    private String departureTime;
    private String estimatedArrivalTime;
    private List<Voyage> voyages;
}
