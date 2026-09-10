package mg.taxibrousse.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchResponse implements Serializable {
    @Builder.Default
    private List<GlobalSearchHitDto> voyages = new ArrayList<>();

    @Builder.Default
    private List<GlobalSearchHitDto> products = new ArrayList<>();

    @Builder.Default
    private List<GlobalSearchHitDto> categories = new ArrayList<>();

    private long totalVoyages;
    private long totalProducts;
    private long totalCategories;
    private long totalMatches;
    private long tookMs;
}
