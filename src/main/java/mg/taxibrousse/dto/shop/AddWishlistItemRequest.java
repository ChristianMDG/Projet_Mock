package mg.taxibrousse.dto.shop;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddWishlistItemRequest {

    @NotNull
    private Long productId;
}
