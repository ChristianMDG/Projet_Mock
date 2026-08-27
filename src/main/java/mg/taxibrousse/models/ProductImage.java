package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductImageEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ProductImage extends BaseDto<ProductImageEntity> {

    private Long productId;
    private String url;
    private String altText;
    private Integer displayOrder;
    private Boolean isPrimary;

    public static ProductImage fromEntity(ProductImageEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new ProductImage();
        model.setBaseDto(entity);
        model.setUrl(entity.getUrl());
        model.setAltText(entity.getAltText());
        model.setDisplayOrder(entity.getDisplayOrder());
        model.setIsPrimary(entity.getIsPrimary());
        if (entity.getProduct() != null) {
            model.setProductId(entity.getProduct().getId());
        }
        return model;
    }

    public static ProductImageBuilder<?, ?> toBuilder(ProductImageEntity entity) {
        if (entity == null) {
            return ProductImage.builder();
        }
        return ProductImage.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .url(entity.getUrl())
                .altText(entity.getAltText())
                .displayOrder(entity.getDisplayOrder())
                .isPrimary(entity.getIsPrimary())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null);
    }

    public static ProductImage fromEntityLight(ProductImageEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ProductImageEntity toEntity(ProductImageEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, ProductImageEntity::new);
        setBaseEntity(entity);
        entity.setUrl(url);
        entity.setAltText(altText);
        entity.setDisplayOrder(displayOrder);
        entity.setIsPrimary(isPrimary);
        if (productId != null) {
            ProductEntity product = new ProductEntity();
            product.setId(productId);
            entity.setProduct(product);
        }
        return entity;
    }
}
