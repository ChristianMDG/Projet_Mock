package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.PromotionEntity;
import mg.taxibrousse.entities.enums.DiscountTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Promotion extends BaseDto<PromotionEntity> {

    private String code;
    private String name;
    private String description;
    private DiscountTypeEnum discountType;
    private BigDecimal discountValue;
    private Integer buyQuantity;
    private Integer getQuantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private Integer usageCount;
    private Boolean isActive;
    private Set<Long> productIds;
    private Set<Long> categoryIds;

    public static Promotion fromEntity(PromotionEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Promotion();
        model.setBaseDto(entity);
        model.setCode(entity.getCode());
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setDiscountType(entity.getDiscountType());
        model.setDiscountValue(entity.getDiscountValue());
        model.setBuyQuantity(entity.getBuyQuantity());
        model.setGetQuantity(entity.getGetQuantity());
        model.setStartDate(entity.getStartDate());
        model.setEndDate(entity.getEndDate());
        model.setUsageLimit(entity.getUsageLimit());
        model.setUsageCount(entity.getUsageCount());
        model.setIsActive(entity.getIsActive());
        model.setProductIds(entity.getProducts() == null ? Set.of() : entity.getProducts().stream().map(p -> p.getId()).collect(Collectors.toSet()));
        model.setCategoryIds(entity.getCategories() == null ? Set.of() : entity.getCategories().stream().map(c -> c.getId()).collect(Collectors.toSet()));
        return model;
    }

    public static PromotionBuilder<?, ?> toBuilder(PromotionEntity entity) {
        if (entity == null) {
            return Promotion.builder();
        }
        return Promotion.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .discountType(entity.getDiscountType())
                .discountValue(entity.getDiscountValue())
                .buyQuantity(entity.getBuyQuantity())
                .getQuantity(entity.getGetQuantity())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .usageLimit(entity.getUsageLimit())
                .usageCount(entity.getUsageCount())
                .isActive(entity.getIsActive());
    }

    public static Promotion fromEntityLight(PromotionEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public PromotionEntity toEntity(PromotionEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, PromotionEntity::new);
        setBaseEntity(entity);
        entity.setCode(code);
        entity.setName(name);
        entity.setDescription(description);
        entity.setDiscountType(discountType);
        entity.setDiscountValue(discountValue);
        entity.setBuyQuantity(buyQuantity);
        entity.setGetQuantity(getQuantity);
        entity.setStartDate(startDate);
        entity.setEndDate(endDate);
        entity.setUsageLimit(usageLimit);
        entity.setUsageCount(usageCount);
        entity.setIsActive(isActive);
        return entity;
    }
}
