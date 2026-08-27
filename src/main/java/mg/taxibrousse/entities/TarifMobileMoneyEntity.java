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
@Entity(name = "TarifMobileMoney")
@Table(name = "tarif_mobile_money", indexes = {@Index(name = "idx_tarif_mobile_money_operator", columnList = "operator_name"),
        @Index(name = "tarif_mobile_money_documents_idx", columnList = "documentId, locale, publishedAt")})
public class TarifMobileMoneyEntity extends BaseEntity {

    @Column(name = "min_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal minAmount = BigDecimal.ZERO;

    @Column(name = "max_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxAmount = BigDecimal.ZERO;

    @Column(name = "frais_retrait", nullable = false, precision = 10, scale = 2)
    private BigDecimal fraisRetrait = BigDecimal.ZERO;

    @Column(name = "frais_transfert", nullable = false, precision = 10, scale = 2)
    private BigDecimal fraisTransfert = BigDecimal.ZERO;

    @Column(name = "operator_name", nullable = false, length = 50)
    private String operatorName;
}
