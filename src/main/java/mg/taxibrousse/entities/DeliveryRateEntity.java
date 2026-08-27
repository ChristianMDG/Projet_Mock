package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "DeliveryRate")
@Table(name = "shop_delivery_rate", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_delivery_rate_zone_method", columnNames = {"zone_id", "method"})}, indexes = {
        @Index(name = "idx_shop_delivery_rate_zone", columnList = "zone_id"), @Index(name = "shop_delivery_rate_documents_idx", columnList = "documentId, locale, publishedAt")})
public class DeliveryRateEntity extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private DeliveryZoneEntity zone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryMethodEnum method;

    @Column(name = "base_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseFee = BigDecimal.ZERO;

    @Column(name = "per_kg_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal perKgFee = BigDecimal.ZERO;

    @Column(name = "estimated_days_min")
    private Integer estimatedDaysMin;

    @Column(name = "estimated_days_max")
    private Integer estimatedDaysMax;
}
