package mg.taxibrousse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "TombanaFanaterana")
@Table(name = "tombana_fanaterana", indexes = {
        @Index(name = "idx_tombana_fanaterana_ville", columnList = "ville_id"),
        @Index(name = "idx_tombana_fanaterana_weight", columnList = "min_weight, max_weight")
})
public class TombanaFanateranaEntity extends BaseEntity {

    @Column(name = "min_weight", nullable = false, precision = 10, scale = 2)
    private BigDecimal minWeight = BigDecimal.ZERO;

    @Column(name = "max_weight", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxWeight = BigDecimal.ZERO;

    @Column(name = "frais", nullable = false, precision = 10, scale = 2)
    private BigDecimal frais = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_method", nullable = false, length = 20)
    private DeliveryMethodEnum deliveryMethod = DeliveryMethodEnum.STANDARD;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ville_id", nullable = false)
    private VilleEntity ville;
}
