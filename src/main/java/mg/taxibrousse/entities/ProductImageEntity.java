package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ProductImage")
@Table(name = "product_image", indexes = {@Index(name = "idx_product_image_product", columnList = "product_id"), @Index(name = "idx_product_image_primary", columnList = "product_id, is_primary"),
        @Index(name = "product_image_documents_idx", columnList = "documentId, locale, publishedAt")})
public class ProductImageEntity extends BaseEntity {

    @Column(nullable = false, length = 1024)
    private String url;

    @Column(name = "alt_text", length = 255)
    private String altText;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = Boolean.FALSE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;
}
