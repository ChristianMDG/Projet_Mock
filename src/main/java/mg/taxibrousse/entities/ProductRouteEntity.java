package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ProductRoute")
@Table(name = "product_route", uniqueConstraints = {@UniqueConstraint(name = "uk_product_route_product_route", columnNames = {"product_id", "route_id"})}, indexes = {
        @Index(name = "idx_product_route_product_id", columnList = "product_id"), @Index(name = "idx_product_route_route_id", columnList = "route_id"),
        @Index(name = "product_route_created_by_id_fk", columnList = "created_by_id"), @Index(name = "product_route_updated_by_id_fk", columnList = "updated_by_id"),
        @Index(name = "product_route_documents_idx", columnList = "documentId, locale, publishedAt")})
public class ProductRouteEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private RouteEntity route;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;
}
