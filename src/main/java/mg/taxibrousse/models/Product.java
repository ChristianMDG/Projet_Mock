package mg.taxibrousse.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ProductCategoryEntity;
import mg.taxibrousse.entities.ProductEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Product extends BaseDto<ProductEntity> {

    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private String shortDescription;
    @NotNull(message = "Price is required")
    private BigDecimal price;
    private BigDecimal originalPrice;
    @NotBlank(message = "SKU is required")
    private String sku;
    @NotBlank(message = "Slug is required")
    private String slug;
    private String currency;
    private Integer stock;
    private BigDecimal weight;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isNew;
    private Boolean isBestSeller;
    private BigDecimal rating;
    private Integer ratingCount;
    private Integer discountPercentage;
    private Long categoryId;
    private String categoryName;
    private ProductCategory category;
    private List<ProductImage> images;
    private List<ProductVariant> variants;

    public static Product fromEntity(ProductEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Product();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setShortDescription(entity.getShortDescription());
        model.setPrice(entity.getPrice());
        model.setOriginalPrice(entity.getOriginalPrice());
        model.setSku(entity.getSku());
        model.setSlug(entity.getSlug());
        model.setCurrency(entity.getCurrency());
        model.setStock(entity.getStock());
        model.setWeight(entity.getWeight());
        model.setIsActive(entity.getIsActive());
        model.setIsFeatured(entity.getIsFeatured());
        model.setIsNew(entity.getIsNew());
        model.setIsBestSeller(entity.getIsBestSeller());
        model.setRating(entity.getRating());
        model.setRatingCount(entity.getRatingCount());
        model.setDiscountPercentage(computeDiscountPercentage(entity.getPrice(), entity.getOriginalPrice()));
        if (entity.getCategory() != null) {
            model.setCategoryId(entity.getCategory().getId());
            model.setCategoryName(entity.getCategory().getName());
            model.setCategory(ProductCategory.fromEntityLight(entity.getCategory()));
        }
        if (entity.getImages() != null) {
            model.setImages(mapEntities(entity.getImages(), ProductImage::fromEntity));
        }
        if (entity.getVariants() != null) {
            model.setVariants(mapEntities(entity.getVariants(), ProductVariant::fromEntity));
        }
        return model;
    }

    public static ProductBuilder<?, ?> toBuilder(ProductEntity entity) {
        if (entity == null) {
            return Product.builder();
        }
        ProductBuilder<?, ?> b = Product.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .description(entity.getDescription())
                .shortDescription(entity.getShortDescription())
                .price(entity.getPrice())
                .originalPrice(entity.getOriginalPrice())
                .sku(entity.getSku())
                .slug(entity.getSlug())
                .currency(entity.getCurrency())
                .stock(entity.getStock())
                .weight(entity.getWeight())
                .isActive(entity.getIsActive())
                .isFeatured(entity.getIsFeatured())
                .isNew(entity.getIsNew())
                .isBestSeller(entity.getIsBestSeller())
                .rating(entity.getRating())
                .ratingCount(entity.getRatingCount())
                .discountPercentage(computeDiscountPercentage(entity.getPrice(), entity.getOriginalPrice()));
        if (entity.getCategory() != null) {
            b.categoryId(entity.getCategory().getId()).categoryName(entity.getCategory().getName()).category(ProductCategory.fromEntityLight(entity.getCategory()));
        }
        return b;
    }

    public static Product fromEntityLight(ProductEntity entity) {
        return toBuilder(entity).build();
    }

    private static Integer computeDiscountPercentage(BigDecimal price, BigDecimal originalPrice) {
        if (price == null || originalPrice == null) {
            return null;
        }
        if (originalPrice.signum() <= 0) {
            return null;
        }
        if (originalPrice.compareTo(price) <= 0) {
            return null;
        }
        int percent = originalPrice.subtract(price).multiply(BigDecimal.valueOf(100)).divide(originalPrice, 0, RoundingMode.HALF_UP).intValue();
        if (percent < 0) {
            return null;
        }
        if (percent > 100) {
            return 100;
        }
        return percent;
    }

    @Override
    public ProductEntity toEntity(ProductEntity entity) {
        ProductEntity targetEntity = Objects.requireNonNullElseGet(entity, ProductEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setName(name);
        targetEntity.setDescription(description);
        targetEntity.setShortDescription(shortDescription);
        targetEntity.setPrice(price);
        targetEntity.setOriginalPrice(originalPrice);
        targetEntity.setSku(sku);
        targetEntity.setSlug(slug);
        targetEntity.setCurrency(currency);
        targetEntity.setStock(stock);
        targetEntity.setWeight(weight);
        targetEntity.setIsActive(isActive);
        targetEntity.setIsFeatured(isFeatured);
        targetEntity.setIsNew(isNew);
        targetEntity.setIsBestSeller(isBestSeller);
        targetEntity.setRating(rating);
        targetEntity.setRatingCount(ratingCount);
        Optional.ofNullable(categoryId).ifPresent(id -> {
            ProductCategoryEntity cat = new ProductCategoryEntity();
            cat.setId(id);
            targetEntity.setCategory(cat);
        });
        return targetEntity;
    }
}
