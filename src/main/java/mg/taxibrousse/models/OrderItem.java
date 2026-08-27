package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.OrderItemEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class OrderItem extends BaseDto<OrderItemEntity> {

    private Long orderId;
    private Long productId;
    private Long variantId;
    private String productName;
    private String productSku;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    public static OrderItem fromEntity(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new OrderItem();
        model.setBaseDto(entity);
        Optional.ofNullable(entity.getOrder()).ifPresent(o -> model.setOrderId(o.getId()));
        Optional.ofNullable(entity.getProduct()).ifPresent(p -> model.setProductId(p.getId()));
        Optional.ofNullable(entity.getVariant()).ifPresent(v -> model.setVariantId(v.getId()));
        model.setProductName(entity.getProductName());
        model.setProductSku(entity.getProductSku());
        model.setQuantity(entity.getQuantity());
        model.setUnitPrice(entity.getUnitPrice());
        model.setLineTotal(entity.getLineTotal());
        return model;
    }

    public static OrderItemBuilder<?, ?> toBuilder(OrderItemEntity entity) {
        if (entity == null) {
            return OrderItem.builder();
        }
        return OrderItem.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .orderId(Optional.ofNullable(entity.getOrder()).map(OrderEntity::getId).orElse(null))
                .productId(Optional.ofNullable(entity.getProduct()).map(ProductEntity::getId).orElse(null))
                .variantId(Optional.ofNullable(entity.getVariant()).map(ProductVariantEntity::getId).orElse(null))
                .productName(entity.getProductName())
                .productSku(entity.getProductSku())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .lineTotal(entity.getLineTotal());
    }

    public static OrderItem fromEntityLight(OrderItemEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public OrderItemEntity toEntity(OrderItemEntity entity) {
        OrderItemEntity targetEntity = Objects.requireNonNullElseGet(entity, OrderItemEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setProductName(productName);
        targetEntity.setProductSku(productSku);
        targetEntity.setQuantity(quantity);
        targetEntity.setUnitPrice(unitPrice);
        targetEntity.setLineTotal(lineTotal);
        Optional.ofNullable(orderId).ifPresent(id -> {
            OrderEntity order = new OrderEntity();
            order.setId(id);
            targetEntity.setOrder(order);
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
