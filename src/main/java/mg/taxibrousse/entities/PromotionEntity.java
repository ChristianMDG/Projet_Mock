package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DiscountTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ShopPromotion")
@Table(name = "shop_promotion", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_promotion_code", columnNames = "code")}, indexes = {
        @Index(name = "idx_shop_promotion_active", columnList = "is_active"), @Index(name = "idx_shop_promotion_dates", columnList = "start_date, end_date"),
        @Index(name = "shop_promotion_documents_idx", columnList = "documentId, locale, publishedAt")})
public class PromotionEntity extends BaseEntity {

    @Column(nullable = false, length = 60)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountTypeEnum discountType;

    @Column(name = "discount_value", precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "buy_quantity")
    private Integer buyQuantity;

    @Column(name = "get_quantity")
    private Integer getQuantity;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "usage_count", nullable = false)
    private Integer usageCount = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shop_promotion_product", joinColumns = @JoinColumn(name = "promotion_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<ProductEntity> products = new HashSet<>();

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shop_promotion_category", joinColumns = @JoinColumn(name = "promotion_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<ProductCategoryEntity> categories = new HashSet<>();
}
