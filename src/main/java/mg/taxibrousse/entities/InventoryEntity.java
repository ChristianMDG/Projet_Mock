package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Inventory")
@Table(name = "inventory", indexes = {@Index(name = "idx_inventory_product", columnList = "product_id"), @Index(name = "idx_inventory_variant", columnList = "variant_id"),
        @Index(name = "inventory_documents_idx", columnList = "documentId, locale, publishedAt")})
public class InventoryEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariantEntity variant;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0 CHECK (quantity >= 0)")
    private Integer quantity = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0 CHECK (reserved >= 0)")
    private Integer reserved = 0;

    @Version
    private Long version;
}
