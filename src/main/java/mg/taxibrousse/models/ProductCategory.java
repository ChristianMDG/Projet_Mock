package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CategoryEntity;
import mg.taxibrousse.entities.ProductCategoryEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ProductCategory extends BaseDto<ProductCategoryEntity> {

    private String name;
    private String description;
    private String slug;
    private Boolean isActive;
    private Integer displayOrder;
    private Long parentId;
    private Category category;

    public static ProductCategory fromEntity(ProductCategoryEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new ProductCategory();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setSlug(entity.getSlug());
        model.setIsActive(entity.getIsActive());
        model.setDisplayOrder(entity.getDisplayOrder());
        if (entity.getCategory() != null) {
            model.setParentId(entity.getCategory().getId());
            model.setCategory(Category.fromEntityLight(entity.getCategory()));
        }
        return model;
    }

    public static ProductCategoryBuilder<?, ?> toBuilder(ProductCategoryEntity entity) {
        if (entity == null) {
            return ProductCategory.builder();
        }
        return ProductCategory.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .description(entity.getDescription())
                .slug(entity.getSlug())
                .isActive(entity.getIsActive())
                .displayOrder(entity.getDisplayOrder())
                .parentId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .category(entity.getCategory() != null ? Category.fromEntityLight(entity.getCategory()) : null);
    }

    public static ProductCategory fromEntityLight(ProductCategoryEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ProductCategoryEntity toEntity(ProductCategoryEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, ProductCategoryEntity::new);
        setBaseEntity(entity);
        entity.setName(name);
        entity.setDescription(description);
        entity.setSlug(slug);
        entity.setIsActive(isActive);
        entity.setDisplayOrder(displayOrder);
        Category target = Objects.requireNonNullElseGet(category, () -> Category.builder().id(parentId).build());
        entity.setCategory(toIdentity(CategoryEntity.class, target));
        return entity;
    }
}
