package mg.taxibrousse.models;

import lombok.*;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchedulerStats {

    private Long koperativeId;
    private int totalTemplates;
    private int activeTemplates;
    private int totalInstances;
    private int upcomingInstances;
    private int cancelledInstances;
    private LocalDate oldestTemplate;
    private LocalDate newestTemplate;
    private Map<String, Integer> instancesByRecurrenceType;
    private Map<String, Integer> instancesByStatus;
    private int resourceConflicts;
    private double averageInstancesPerTemplate;

    public static SchedulerStats empty() {
        return SchedulerStats.builder().totalTemplates(0).activeTemplates(0).totalInstances(0).upcomingInstances(0).cancelledInstances(0).resourceConflicts(0).averageInstancesPerTemplate(0.0).build();
    }
}
