package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CartEntity;

import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true, builderMethodName = "cartBuilder")
@NoArgsConstructor
public class Cart extends BaseDto<CartEntity> {

    public static Cart fromEntity(CartEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Cart();
        model.setBaseDto(entity);
        return model;
    }

    public static CartBuilder<?, ?> toBuilder(CartEntity entity) {
        // Cart has no primitive fields other than those inherited from BaseDto
        return Cart.cartBuilder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt());
    }

    public static Cart fromEntityLight(CartEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CartEntity toEntity(CartEntity entity) {
        entity = Objects.requireNonNullElse(entity, new CartEntity());
        setBaseEntity(entity);
        return entity;
    }
}
