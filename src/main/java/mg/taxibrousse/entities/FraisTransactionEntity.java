package mg.taxibrousse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "FraisTransaction")
@Table(name = "frais_transaction", indexes = {@Index(name = "idx_frais_transaction_operator", columnList = "operator_name"),
        @Index(name = "frais_transaction_documents_idx", columnList = "documentId, locale, publishedAt")})
public class FraisTransactionEntity extends BaseEntity {

    @Column(name = "operator_name", nullable = false, length = 50)
    private String operatorName;

    @Column(name = "pourcentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal pourcentage = BigDecimal.ZERO;
}
