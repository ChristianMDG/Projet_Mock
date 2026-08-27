package mg.taxibrousse.models;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductRouteEntity;
import mg.taxibrousse.entities.RouteEntity;

import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ProductRoute extends BaseDto<ProductRouteEntity> {

    @NotNull(message = "Product ID is required")
    private Long productId;
    @NotNull(message = "Route ID is required")
    private Long routeId;
    private Integer displayOrder;
    private Boolean isActive;
    private Product product;
    private Route route;

    public static ProductRoute fromEntity(ProductRouteEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new ProductRoute();
        model.setBaseDto(entity);
        Optional.ofNullable(entity.getProduct()).ifPresent(p -> {
            model.setProductId(p.getId());
            model.setProduct(Product.fromEntityLight(p));
        });
        Optional.ofNullable(entity.getRoute()).ifPresent(r -> {
            model.setRouteId(r.getId());
            model.setRoute(Route.fromEntityLight(r));
        });
        model.setDisplayOrder(entity.getDisplayOrder());
        model.setIsActive(entity.getIsActive());
        return model;
    }

    public static ProductRouteBuilder<?, ?> toBuilder(ProductRouteEntity entity) {
        if (entity == null) {
            return ProductRoute.builder();
        }
        ProductRouteBuilder<?, ?> b = ProductRoute.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive());
        Optional.ofNullable(entity.getProduct()).ifPresent(p -> b.productId(p.getId()));
        Optional.ofNullable(entity.getRoute()).ifPresent(r -> b.routeId(r.getId()));
        return b;
    }

    public static ProductRoute fromEntityLight(ProductRouteEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ProductRouteEntity toEntity(ProductRouteEntity entity) {
        ProductRouteEntity targetEntity = Objects.requireNonNullElseGet(entity, ProductRouteEntity::new);
        setBaseEntity(targetEntity);
        Optional.ofNullable(productId).ifPresent(id -> {
            ProductEntity p = new ProductEntity();
            p.setId(id);
            targetEntity.setProduct(p);
        });
        Optional.ofNullable(routeId).ifPresent(id -> {
            RouteEntity r = new RouteEntity();
            r.setId(id);
            targetEntity.setRoute(r);
        });
        Optional.ofNullable(displayOrder).ifPresent(targetEntity::setDisplayOrder);
        Optional.ofNullable(isActive).ifPresent(targetEntity::setIsActive);
        return targetEntity;
    }
}
