package mg.taxibrousse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.VoyageEntity;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KoperativeWeeklySummary {
    private Long id;
    private String name;
    private String status;
    private BigDecimal minPrice;
    private Integer voyageCount;
    private List<String> classes;

    public static KoperativeWeeklySummary from(List<VoyageEntity> voyages) {
        KoperativeEntity kop = voyages.get(0).getKoperative();
        BigDecimal minPrice = voyages.stream()
            .map(VoyageEntity::getPricePerSeat)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        List<String> classNames = kop.getClasses() != null
            ? kop.getClasses().stream().map(c -> c.getName()).sorted().toList()
            : List.of();

        return new KoperativeWeeklySummary(
            kop.getId(),
            kop.getName(),
            kop.getStatus().name(),
            minPrice,
            voyages.size(),
            classNames
        );
    }
}
