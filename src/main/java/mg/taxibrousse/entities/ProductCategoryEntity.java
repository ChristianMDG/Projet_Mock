package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ProductCategory")
@Table(name = "product_categories")
public class ProductCategoryEntity extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 180)
    private String slug;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "product_categories_category_lnk", joinColumns = @JoinColumn(name = "product_category_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private CategoryEntity category;
}
