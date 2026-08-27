package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.enums.CartStatusEnum;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@SuperBuilder(toBuilder = true, builderMethodName = "cartBuilder")
@NoArgsConstructor
public class Cart extends BaseDto<CartEntity> {

    private Long userAccountId;
    private String sessionToken;
    private CartStatusEnum status;
    private List<CartItem> items;
    private BigDecimal subtotal;
    private Integer itemCount;

    public static Cart fromEntity(CartEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Cart();
        model.setBaseDto(entity);
        Optional.ofNullable(entity.getUserAccount()).ifPresent(user -> model.setUserAccountId(user.getId()));
        model.setSessionToken(entity.getSessionToken());
        model.setStatus(entity.getStatus());
        List<CartItem> items = mapEntities(entity.getItems(), CartItem::fromEntity);
        model.setItems(items);
        BigDecimal subtotal = items.stream().map(CartItem::getLineTotal).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = items.stream().map(CartItem::getQuantity).filter(Objects::nonNull).mapToInt(Integer::intValue).sum();
        model.setSubtotal(subtotal);
        model.setItemCount(count);
        return model;
    }

    public static CartBuilder<?, ?> toBuilder(CartEntity entity) {
        if (entity == null) {
            return Cart.cartBuilder();
        }
        return Cart.cartBuilder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .userAccountId(Optional.ofNullable(entity.getUserAccount()).map(UserAccountEntity::getId).orElse(null))
                .sessionToken(entity.getSessionToken())
                .status(entity.getStatus());
    }

    public static Cart fromEntityLight(CartEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CartEntity toEntity(CartEntity entity) {
        CartEntity targetEntity = Objects.requireNonNullElseGet(entity, CartEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setSessionToken(sessionToken);
        targetEntity.setStatus(status);
        Optional.ofNullable(userAccountId).ifPresent(id -> {
            UserAccountEntity user = new UserAccountEntity();
            user.setId(id);
            targetEntity.setUserAccount(user);
        });
        return targetEntity;
    }
}
