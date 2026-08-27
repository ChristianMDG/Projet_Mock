package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.CartItemEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class CartItem extends BaseDto<CartItemEntity> {

    private Long cartId;
    private Long productId;
    private String productName;
    private String productSku;
    private String productImageUrl;
    private Long variantId;
    private Integer quantity;
    private BigDecimal priceSnapshot;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    public static CartItem fromEntity(CartItemEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new CartItem();
        model.setBaseDto(entity);
        Optional.ofNullable(entity.getCart()).ifPresent(c -> model.setCartId(c.getId()));
        model.setQuantity(entity.getQuantity());
        model.setPriceSnapshot(entity.getPriceSnapshot());
        BigDecimal unit = entity.getPriceSnapshot();
        model.setUnitPrice(unit);
        BigDecimal total = (unit != null && entity.getQuantity() != null) ? unit.multiply(BigDecimal.valueOf(entity.getQuantity())) : BigDecimal.ZERO;
        model.setLineTotal(total);
        Optional.ofNullable(entity.getProduct()).ifPresent(p -> {
            model.setProductId(p.getId());
            model.setProductName(p.getName());
            model.setProductSku(p.getSku());
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                String imageUrl = p.getImages().stream().filter(img -> Boolean.TRUE.equals(img.getIsPrimary())).findFirst().orElse(p.getImages().get(0)).getUrl();
                model.setProductImageUrl(imageUrl);
            }
        });
        Optional.ofNullable(entity.getVariant()).ifPresent(v -> model.setVariantId(v.getId()));
        return model;
    }

    public static CartItemBuilder<?, ?> toBuilder(CartItemEntity entity) {
        if (entity == null) {
            return CartItem.builder();
        }
        return CartItem.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .cartId(Optional.ofNullable(entity.getCart()).map(CartEntity::getId).orElse(null))
                .productId(Optional.ofNullable(entity.getProduct()).map(ProductEntity::getId).orElse(null))
                .variantId(Optional.ofNullable(entity.getVariant()).map(ProductVariantEntity::getId).orElse(null))
                .quantity(entity.getQuantity())
                .priceSnapshot(entity.getPriceSnapshot());
    }

    public static CartItem fromEntityLight(CartItemEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CartItemEntity toEntity(CartItemEntity entity) {
        CartItemEntity targetEntity = Objects.requireNonNullElseGet(entity, CartItemEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setQuantity(quantity);
        targetEntity.setPriceSnapshot(priceSnapshot);
        Optional.ofNullable(cartId).ifPresent(id -> {
            CartEntity cart = new CartEntity();
            cart.setId(id);
            targetEntity.setCart(cart);
        });
        Optional.ofNullable(productId).ifPresent(id -> {
            ProductEntity product = new ProductEntity();
            product.setId(id);
            targetEntity.setProduct(product);
        });
        Optional.ofNullable(variantId).ifPresent(id -> {
            ProductVariantEntity variant = new ProductVariantEntity();
            variant.setId(id);
            targetEntity.setVariant(variant);
        });
        return targetEntity;
    }
}
