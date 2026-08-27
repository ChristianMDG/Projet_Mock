package mg.taxibrousse.dto;

import java.time.LocalDate;

public interface VoyageDescriptionDto {

    String getDepartureTimes();

    String getDescription();

    String getVoyageIds();

    LocalDate getDepartureDate();

    Long getKoperativeId();

    Long getGareId();

    Long getClasseId();

    String getKoperativeName();

    String getDepartureVille();

    String getArrivalVille();

    String getGareName();
}
