package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.BatchSize;

@Getter
@Setter
@Table(name = "Reservation")
@Entity(name = "Reservation")
@NoArgsConstructor
public class ReservationEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VoyageEntity voyage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn() // Nullable pour les réservations PENDING_PAYMENT
    private VoyageurEntity voyageur;

    @ManyToOne(fetch = FetchType.EAGER)
    private ClasseEntity classe;

    @BatchSize(size = 50)
    @OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SeatEntity> seats;

    @Column(nullable = false, unique = true, length = 50)
    private String bookingReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatusEnum status = ReservationStatusEnum.PENDING_PAYMENT;

    @Column(nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer seatCount = 0;

    @Column
    private String notes;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column
    private Boolean isDiscounted = false;

    @Column
    private Boolean isProfitAccumulated = false;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    private FacturationEntity facturation;
}
