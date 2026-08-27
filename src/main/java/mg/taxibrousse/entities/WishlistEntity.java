package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ShopWishlist")
@Table(name = "shop_wishlist", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_wishlist_user", columnNames = "user_account_id")}, indexes = {
        @Index(name = "idx_shop_wishlist_user", columnList = "user_account_id"), @Index(name = "shop_wishlist_documents_idx", columnList = "documentId, locale, publishedAt")})
public class WishlistEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_account_id", nullable = false)
    private UserAccountEntity userAccount;

    @JsonIgnore
    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WishlistItemEntity> items = new ArrayList<>();
}
