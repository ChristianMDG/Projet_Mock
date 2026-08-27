package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Product")
@Table(name = "products")
public class ProductEntity extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, length = 80)
    private String sku;

    @Column(nullable = false, length = 220)
    private String slug;

    @Column(length = 10, nullable = false)
    private String currency = "MGA";

    @Column(name = "stock_quantity", nullable = false)
    private Integer stock = 0;

    @Column(precision = 8, scale = 3)
    private BigDecimal weight;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = Boolean.FALSE;

    @Column(name = "is_new", nullable = false)
    private Boolean isNew = Boolean.FALSE;

    @Column(name = "is_best_seller", nullable = false)
    private Boolean isBestSeller = Boolean.FALSE;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "review_count", nullable = false)
    private Integer ratingCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "products_category_lnk", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "product_category_id"))
    private ProductCategoryEntity category;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductImageEntity> images = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductVariantEntity> variants = new ArrayList<>();
}
