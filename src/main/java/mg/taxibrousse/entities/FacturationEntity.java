package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "Facturation")
@Entity(name = "Facturation")
@NoArgsConstructor
public class FacturationEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private ReservationEntity reservation;

    @Column(nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal remainingAmount;

    @Column(name = "advance_amount", precision = 10, scale = 2)
    private BigDecimal advanceAmount = BigDecimal.ZERO;

    @Column(name = "commission", precision = 10, scale = 2)
    private BigDecimal commission;

    @Column(length = 50)
    private String paymentMethodIdentifier;

    @Column(length = 100)
    private String paymentReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatusEnum paymentStatus = PaymentStatusEnum.PENDING;

    @Column
    private LocalDateTime paymentDate;

    @Column
    private LocalDateTime dueDate;
}
