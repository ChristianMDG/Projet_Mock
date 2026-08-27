package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CategoryEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Category extends BaseDto<CategoryEntity> {

    private String name;
    private String description;
    private String slug;
    private Boolean isActive;
    private Integer displayOrder;
    private List<ProductCategory> subcategories;

    public static Category fromEntity(CategoryEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Category();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setSlug(entity.getSlug());
        model.setIsActive(entity.getIsActive());
        model.setDisplayOrder(entity.getDisplayOrder());
        return model;
    }

    public static Category fromEntityWithSubcategories(CategoryEntity entity) {
        if (entity == null) {
            return null;
        }
        Category model = fromEntity(entity);
        if (entity.getSubcategories() != null && !entity.getSubcategories().isEmpty()) {
            model.setSubcategories(mapEntities(entity.getSubcategories(), ProductCategory::fromEntity));
        }
        return model;
    }

    public static CategoryBuilder<?, ?> toBuilder(CategoryEntity entity) {
        if (entity == null) {
            return Category.builder();
        }
        return Category.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .description(entity.getDescription())
                .slug(entity.getSlug())
                .isActive(entity.getIsActive())
                .displayOrder(entity.getDisplayOrder());
    }

    public static Category fromEntityLight(CategoryEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CategoryEntity toEntity(CategoryEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, CategoryEntity::new);
        setBaseEntity(entity);
        entity.setName(name);
        entity.setDescription(description);
        entity.setSlug(slug);
        entity.setIsActive(isActive);
        entity.setDisplayOrder(displayOrder);
        return entity;
    }
}
