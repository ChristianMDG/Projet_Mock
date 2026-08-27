package mg.taxibrousse.dto.shop;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryReorderRequest {

    private List<CategoryOrderItem> items;

    @Getter
    @Setter
    public static class CategoryOrderItem {

        private Long id;
        private Integer displayOrder;
        private Long parentId;
    }
}
