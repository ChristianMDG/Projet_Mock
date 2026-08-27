package mg.taxibrousse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class VoyageWeeklyResponse {

    private Long resultId;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private LocalDate currentDate;
    private List<VoyageWeeklyResult> weeklyResults;
    private List<KoperativeWeeklySummary> koperativeSummaries;
}
