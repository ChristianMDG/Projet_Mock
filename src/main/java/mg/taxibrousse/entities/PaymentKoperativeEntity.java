package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;

import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "PaymentKoperative")
@Entity(name = "PaymentKoperative")
@NoArgsConstructor
public class PaymentKoperativeEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voyage_id", nullable = false, unique = true)
    private VoyageEntity voyage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatusEnum status = PaymentStatusEnum.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
}
