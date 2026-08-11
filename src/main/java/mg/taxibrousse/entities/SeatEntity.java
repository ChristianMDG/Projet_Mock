package mg.taxibrousse.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.SeatStatusEnum;

/**
 * Entity representing a seat in a vehicle (crafter) for a specific voyage
 */
@Getter
@Setter
@Table(name = "Seat", uniqueConstraints = @UniqueConstraint(columnNames = { "voyage_id", "seat_number" }))
@Entity(name = "Seat")
@NoArgsConstructor
public class SeatEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voyage_id", nullable = false)
    @NotNull(message = "Voyage is required")
    private VoyageEntity voyage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crafter_id", nullable = true)
    private CrafterEntity crafter;

    @Column(nullable = false)
    @NotNull(message = "Seat number is required")
    @Min(value = 1, message = "Seat number must be at least 1")
    @Max(value = 50, message = "Seat number cannot exceed 50")
    private Integer seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Seat status is required")
    private SeatStatusEnum seatStatus = SeatStatusEnum.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationEntity reservation;

    @Column(length = 2)
    private String position;

    @Column(length = 100)
    private String notes;

    /**
     * Check if the seat is available for booking
     */
    public boolean isAvailable() {
        return this.seatStatus == SeatStatusEnum.AVAILABLE;
    }

    /**
     * Check if the seat is reserved
     */
    public boolean isReserved() {
        return this.seatStatus == SeatStatusEnum.RESERVED;
    }

    /**
     * Check if the seat is blocked or damaged
     */
    public boolean isUnavailable() {
        return (this.seatStatus == SeatStatusEnum.BLOCKED || this.seatStatus == SeatStatusEnum.DAMAGED);
    }
}
