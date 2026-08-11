package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "PaymentTransaction", indexes = {
    @Index(name = "payment_tx_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "payment_tx_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "payment_tx_documents_idx", columnList = "documentId, locale, publishedAt"),
    @Index(name = "payment_tx_reference_idx", columnList = "transactionReference"),
    @Index(name = "payment_tx_facturation_idx", columnList = "facturation_id")
})
@Entity(name = "PaymentTransaction")
@NoArgsConstructor
public class PaymentTransactionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facturation_id", nullable = false)
    private FacturationEntity facturation;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionReference;

    @Column(nullable = false, length = 50)
    private String operatorName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

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
}
