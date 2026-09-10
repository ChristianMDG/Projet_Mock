package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "PaymentTransaction", indexes = {@Index(name = "payment_tx_created_by_id_fk", columnList = "created_by_id"), @Index(name = "payment_tx_updated_by_id_fk", columnList = "updated_by_id"),
        @Index(name = "payment_tx_documents_idx", columnList = "documentId, locale, publishedAt"), @Index(name = "payment_tx_reference_idx", columnList = "transactionReference"),
        @Index(name = "payment_tx_facturation_idx", columnList = "facturation_id"), @Index(name = "payment_tx_order_idx", columnList = "order_id"),
        @Index(name = "payment_tx_rental_reservation_idx", columnList = "rental_reservation_id")})
@Entity(name = "PaymentTransaction")
@NoArgsConstructor
public class PaymentTransactionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facturation_id")
    private FacturationEntity facturation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_reservation_id")
    private RentalReservationEntity rentalReservation;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethodEnum paymentMethod;

    @Column(nullable = false, length = 50)
    private String operatorName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 10, nullable = false, columnDefinition = "varchar(10) default 'MGA'")
    private String currency = "MGA";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentTransactionStatusEnum status;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 100)
    private String serverCorrelationId;

    @Column(columnDefinition = "TEXT")
    private String operatorResponse;

    @Column
    private LocalDateTime initiatedAt;

    @Column
    private LocalDateTime completedAt;

    @Column
    private Integer otpAttempts = 0;

    @Column(name = "frais_retrait", precision = 10, scale = 2)
    private BigDecimal fraisRetrait = BigDecimal.ZERO;

    @Column(name = "frais_transfert", precision = 10, scale = 2)
    private BigDecimal fraisTransfert = BigDecimal.ZERO;

    @Column(name = "frais_total", precision = 10, scale = 2)
    private BigDecimal fraisTotal = BigDecimal.ZERO;

    @Column(name = "frais_transaction", precision = 10, scale = 2)
    private BigDecimal fraisTransaction = BigDecimal.ZERO;

    @Column(name = "commission_seats", precision = 10, scale = 2, columnDefinition = "numeric(10,2) default 0")
    private BigDecimal commissionSeats = BigDecimal.ZERO;

    @Column(name = "commission_fee", precision = 10, scale = 2, columnDefinition = "numeric(10,2) default 0")
    private BigDecimal commissionFee = BigDecimal.ZERO;

    @Column(name = "montant_transfert", precision = 10, scale = 2, columnDefinition = "numeric(10,2) default 0")
    private BigDecimal montantTransfert = BigDecimal.ZERO;
}
