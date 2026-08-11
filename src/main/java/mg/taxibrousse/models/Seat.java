package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.enums.SeatStatusEnum;

import java.util.Objects;

import static java.util.Optional.ofNullable;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Seat extends BaseDto<SeatEntity> {

    private Voyage voyage;
    private Crafter crafter;
    private Reservation reservation;
    private String seatNum;
    private String seatStatus;
    private String position;
    private String notes;

    public static Seat fromEntity(SeatEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Seat();
        model.setBaseDto(entity);
        model.setVoyage(Voyage.fromEntity(entity.getVoyage()));
        model.setCrafter(Crafter.fromEntity(entity.getCrafter()));
        model.setReservation(Reservation.fromEntity(entity.getReservation()));
        model.setSeatNum(ofNullable(entity.getSeatNumber()).map(Object::toString).orElse(null));
        model.setSeatStatus(ofNullable(entity.getSeatStatus()).map(Enum::name).orElse(null));
        model.setPosition(entity.getPosition());
        model.setNotes(entity.getNotes());
        return model;
    }

    public static SeatBuilder<?, ?> toBuilder(SeatEntity entity) {
        if (entity == null) {
            return Seat.builder();
        }
        return Seat.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .seatNum(ofNullable(entity.getSeatNumber()).map(Object::toString).orElse(null))
                .seatStatus(ofNullable(entity.getSeatStatus()).map(Enum::name).orElse(null))
                .position(entity.getPosition())
                .notes(entity.getNotes());
    }

    public static Seat fromEntityLight(SeatEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public SeatEntity toEntity(SeatEntity entity) {
        entity = Objects.requireNonNullElse(entity, new SeatEntity());
        setBaseEntity(entity);

        entity.setVoyage(ofNullable(voyage).map(Voyage::toEntity).orElse(null));
        entity.setCrafter(ofNullable(crafter).map(Crafter::toEntity).orElse(null));
        entity.setReservation(ofNullable(reservation).map(Reservation::toEntity).orElse(null));
        entity.setSeatNumber(ofNullable(seatNum).map(Integer::valueOf).orElse(null));
        entity.setSeatStatus(ofNullable(seatStatus).map(SeatStatusEnum::valueOf).orElse(null));
        entity.setPosition(position);
        entity.setNotes(notes);

        return entity;
    }

    /**
     * Check if the seat is available for booking
     */
    public boolean isAvailable() {
        return ofNullable(seatStatus).map("AVAILABLE"::equals).orElse(false);
    }

    /**
     * Check if the seat is reserved
     */
    public boolean isReserved() {
        return ofNullable(seatStatus).map("RESERVED"::equals).orElse(false);
    }

    /**
     * Check if the seat is blocked or damaged
     */
    public boolean isUnavailable() {
        return ofNullable(seatStatus)
                .map(status -> "BLOCKED".equals(status) || "DAMAGED".equals(status))
                .orElse(false);
    }
}
