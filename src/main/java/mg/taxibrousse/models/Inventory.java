package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Inventory extends BaseDto<InventoryEntity> {

    @Override
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public java.time.LocalDateTime getCreatedAt() {
        return super.getCreatedAt();
    }

    @Override
    @JsonProperty("updatedAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public java.time.LocalDateTime getUpdatedAt() {
        return super.getUpdatedAt();
    }

    private Long productId;
    private String productName;
    private String productSku;
    private Long variantId;
    private String variantSku;
    private Integer quantity;
    private Integer reserved;
    private Integer available;
    private Long version;

    public static Inventory fromEntity(InventoryEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Inventory();
        model.setBaseDto(entity);
        int qty = entity.getQuantity() != null ? entity.getQuantity() : 0;
        int reserved = entity.getReserved() != null ? entity.getReserved() : 0;
        model.setQuantity(qty);
        model.setReserved(reserved);
        model.setAvailable(Math.max(0, qty - reserved));
        model.setVersion(entity.getVersion());
        if (entity.getProduct() != null) {
            model.setProductId(entity.getProduct().getId());
            model.setProductName(entity.getProduct().getName());
            model.setProductSku(entity.getProduct().getSku());
        }
        if (entity.getVariant() != null) {
            model.setVariantId(entity.getVariant().getId());
            model.setVariantSku(entity.getVariant().getSku());
        }
        return model;
    }

    public static InventoryBuilder<?, ?> toBuilder(InventoryEntity entity) {
        if (entity == null) {
            return Inventory.builder();
        }
        int qty = entity.getQuantity() != null ? entity.getQuantity() : 0;
        int reserved = entity.getReserved() != null ? entity.getReserved() : 0;
        return Inventory.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .productName(entity.getProduct() != null ? entity.getProduct().getName() : null)
                .productSku(entity.getProduct() != null ? entity.getProduct().getSku() : null)
                .variantId(entity.getVariant() != null ? entity.getVariant().getId() : null)
                .variantSku(entity.getVariant() != null ? entity.getVariant().getSku() : null)
                .quantity(qty)
                .reserved(reserved)
                .available(Math.max(0, qty - reserved))
                .version(entity.getVersion());
    }

    public static Inventory fromEntityLight(InventoryEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public InventoryEntity toEntity(InventoryEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, InventoryEntity::new);
        setBaseEntity(entity);
        entity.setQuantity(quantity);
        entity.setReserved(reserved);
        if (productId != null) {
            ProductEntity product = new ProductEntity();
            product.setId(productId);
            entity.setProduct(product);
        }
        if (variantId != null) {
            ProductVariantEntity variant = new ProductVariantEntity();
            variant.setId(variantId);
            entity.setVariant(variant);
        }
        return entity;
    }
}
