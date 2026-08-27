package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ProductVariant")
@Table(name = "product_variants")
public class ProductVariantEntity extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 80)
    private String sku;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> attributes = new HashMap<>();

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal priceOverride;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stock = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinTable(name = "product_variants_product_lnk", joinColumns = @JoinColumn(name = "product_variant_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private ProductEntity product;
}
