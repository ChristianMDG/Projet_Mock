package mg.taxibrousse.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchHitDto implements Serializable {
    private String id;
    private String type;
    private String title;
    private String subtitle;
    private String badge;
    private String extraInfo;
    private String imageUrl;
    private String departureVilleName;
    private String arrivalVilleName;
    private String departureDate;
    private String slug;
    private BigDecimal price;
    private Integer availableSeats;
}
