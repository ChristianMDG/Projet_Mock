package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "CartItem")
@Table(name = "cart_item", indexes = {@Index(name = "idx_cart_item_cart", columnList = "cart_id"), @Index(name = "idx_cart_item_product", columnList = "product_id"),
        @Index(name = "cart_item_documents_idx", columnList = "documentId, locale, publishedAt")})
public class CartItemEntity extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private CartEntity cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariantEntity variant;

    @Min(1)
    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "price_snapshot", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceSnapshot;
}
