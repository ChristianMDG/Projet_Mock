package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ShopWishlistItem")
@Table(name = "shop_wishlist_item", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_wishlist_item_wishlist_product", columnNames = {"wishlist_id", "product_id"})}, indexes = {
        @Index(name = "idx_shop_wishlist_item_wishlist", columnList = "wishlist_id"), @Index(name = "idx_shop_wishlist_item_product", columnList = "product_id"),
        @Index(name = "shop_wishlist_item_documents_idx", columnList = "documentId, locale, publishedAt")})
public class WishlistItemEntity extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private WishlistEntity wishlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}
