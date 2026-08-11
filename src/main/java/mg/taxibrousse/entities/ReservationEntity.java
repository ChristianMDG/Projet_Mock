package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    @JoinColumn(nullable = true)  // Nullable pour les réservations PENDING_PAYMENT
    private VoyageurEntity voyageur;

    @ManyToOne(fetch = FetchType.EAGER)
    private ClasseEntity classe;

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

    @Column
    private String notes;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private FacturationEntity facturation;
}
