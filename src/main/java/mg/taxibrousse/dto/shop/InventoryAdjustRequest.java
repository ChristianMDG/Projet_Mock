package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryAdjustRequest {

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    @Size(min = 1, max = 500)
    private String reason;
}
