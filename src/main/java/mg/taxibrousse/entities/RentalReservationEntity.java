package mg.taxibrousse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.RentalReservationStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "rental_reservations")
@Getter
@Setter
@NoArgsConstructor
public class RentalReservationEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_id")
    private UserAccountEntity user; // nullable - guest bookings

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private RentalVehicleEntity vehicle;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RentalReservationStatusEnum status = RentalReservationStatusEnum.PENDING;

    @Column(length = 20, unique = true)
    private String bookingReference; // nullable - non-blocking generation

    @Column(nullable = false, length = 150)
    private String driverName;

    @Column(nullable = false, length = 30)
    private String driverPhone;

    @Column(nullable = false, length = 150)
    private String driverEmail;
}
