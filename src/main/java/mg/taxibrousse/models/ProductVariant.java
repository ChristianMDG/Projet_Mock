package mg.taxibrousse.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ProductVariant extends BaseDto<ProductVariantEntity> {

    @NotNull(message = "Product ID is required")
    private Long productId;
    @NotBlank(message = "SKU is required")
    private String sku;
    private Map<String, Object> attributes;
    private BigDecimal priceOverride;
    private Integer stock;

    public static ProductVariant fromEntity(ProductVariantEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new ProductVariant();
        model.setBaseDto(entity);
        model.setSku(entity.getSku());
        model.setAttributes(entity.getAttributes());
        model.setPriceOverride(entity.getPriceOverride());
        model.setStock(entity.getStock());
        if (entity.getProduct() != null) {
            model.setProductId(entity.getProduct().getId());
        }
        return model;
    }

    public static ProductVariantBuilder<?, ?> toBuilder(ProductVariantEntity entity) {
        if (entity == null) {
            return ProductVariant.builder();
        }
        return ProductVariant.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .sku(entity.getSku())
                .attributes(entity.getAttributes())
                .priceOverride(entity.getPriceOverride())
                .stock(entity.getStock())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null);
    }

    public static ProductVariant fromEntityLight(ProductVariantEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ProductVariantEntity toEntity(ProductVariantEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, ProductVariantEntity::new);
        setBaseEntity(entity);
        entity.setSku(sku);
        entity.setAttributes(attributes);
        entity.setPriceOverride(priceOverride);
        entity.setStock(stock);
        if (productId != null) {
            ProductEntity product = new ProductEntity();
            product.setId(productId);
            entity.setProduct(product);
        }
        return entity;
    }
}
