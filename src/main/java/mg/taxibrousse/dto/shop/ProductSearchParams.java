package mg.taxibrousse.dto.shop;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductSearchParams {

    private String q;
    private Long categoryId;
    private String categorySlug;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStock;
    private BigDecimal minRating;
    private List<String> tags;
    private String sort;
}
