package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.WishlistEntity;
import mg.taxibrousse.entities.WishlistItemEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class WishlistItem extends BaseDto<WishlistItemEntity> {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private String productSku;
    private BigDecimal productPrice;
    private Integer productStock;
    private LocalDateTime addedAt;

    public static WishlistItem fromEntity(WishlistItemEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new WishlistItem();
        model.setBaseDto(entity);
        if (entity.getWishlist() != null) {
            model.setWishlistId(entity.getWishlist().getId());
        }
        if (entity.getProduct() != null) {
            model.setProductId(entity.getProduct().getId());
            model.setProductName(entity.getProduct().getName());
            model.setProductSku(entity.getProduct().getSku());
            model.setProductPrice(entity.getProduct().getPrice());
            model.setProductStock(entity.getProduct().getStock());
        }
        model.setAddedAt(entity.getAddedAt());
        return model;
    }

    public static WishlistItemBuilder<?, ?> toBuilder(WishlistItemEntity entity) {
        if (entity == null) {
            return WishlistItem.builder();
        }
        return WishlistItem.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .wishlistId(entity.getWishlist() != null ? entity.getWishlist().getId() : null)
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .addedAt(entity.getAddedAt());
    }

    public static WishlistItem fromEntityLight(WishlistItemEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public WishlistItemEntity toEntity(WishlistItemEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, WishlistItemEntity::new);
        setBaseEntity(entity);
        entity.setAddedAt(addedAt);
        if (wishlistId != null) {
            WishlistEntity wishlist = new WishlistEntity();
            wishlist.setId(wishlistId);
            entity.setWishlist(wishlist);
        }
        if (productId != null) {
            ProductEntity product = new ProductEntity();
            product.setId(productId);
            entity.setProduct(product);
        }
        return entity;
    }
}
