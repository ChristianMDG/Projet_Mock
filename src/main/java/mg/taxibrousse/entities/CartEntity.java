package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.CartStatusEnum;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Cart")
@Table(name = "cart", indexes = {@Index(name = "idx_cart_user", columnList = "user_account_id"), @Index(name = "idx_cart_session", columnList = "session_token"),
        @Index(name = "idx_cart_status", columnList = "status"), @Index(name = "cart_documents_idx", columnList = "documentId, locale, publishedAt")})
public class CartEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_id")
    private UserAccountEntity userAccount;

    @Column(name = "session_token", length = 100)
    private String sessionToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CartStatusEnum status = CartStatusEnum.ACTIVE;

    @JsonIgnore
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItemEntity> items = new ArrayList<>();
}
