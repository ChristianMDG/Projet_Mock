package mg.taxibrousse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Commission")
@Table(name = "commission", indexes = {@Index(name = "idx_commission_koperative", columnList = "koperative_id"),
        @Index(name = "commission_documents_idx", columnList = "documentId, locale, publishedAt")})
public class CommissionEntity extends BaseEntity {

    @Column(name = "min_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal minAmount = BigDecimal.ZERO;

    @Column(name = "max_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxAmount = BigDecimal.ZERO;

    @Column(name = "frais", nullable = false, precision = 10, scale = 2)
    private BigDecimal frais = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "koperative_id", nullable = false)
    private KoperativeEntity koperative;
}
