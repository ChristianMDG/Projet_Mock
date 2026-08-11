package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static java.util.Optional.ofNullable;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Reservation extends BaseDto<ReservationEntity> {

    private Voyage voyage;
    private Voyageur voyageur;
    private Classe classe;
    private String bookingReference;
    private String status;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private String notes;
    private Facturation facturation;

    @lombok.Builder.Default
    private List<Seat> seats = new ArrayList<>();

    public static Reservation fromEntity(ReservationEntity entity) {
        if (entity == null) {
            return null;
        }

        var model = new Reservation();
        model.setBaseDto(entity);
        model.bookingReference = entity.getBookingReference();
        model.status = ofNullable(entity.getStatus()).map(Enum::name).orElse(null);
        model.bookingDate = entity.getBookingDate();
        model.totalAmount = entity.getTotalAmount();
        model.notes = entity.getNotes();

        model.classe = Classe.fromEntity(entity.getClasse());
        model.voyageur = Voyageur.fromEntity(entity.getVoyageur(), false);
        model.facturation = Facturation.fromEntity(entity.getFacturation());
        model.voyage = Voyage.fromEntity(entity.getVoyage());

        return model;
    }

    public static ReservationBuilder<?, ?> toBuilder(ReservationEntity entity) {
        if (entity == null) {
            return Reservation.builder();
        }
        return Reservation.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .bookingReference(entity.getBookingReference())
                .status(ofNullable(entity.getStatus()).map(Enum::name).orElse(null))
                .bookingDate(entity.getBookingDate())
                .totalAmount(entity.getTotalAmount())
                .notes(entity.getNotes());
    }

    public static Reservation fromEntityLight(ReservationEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ReservationEntity toEntity(ReservationEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ReservationEntity());
        setBaseEntity(entity);
        entity.setNotes(notes);
        entity.setBookingDate(bookingDate);
        entity.setTotalAmount(totalAmount);
        entity.setBookingReference(bookingReference);

        entity.setVoyage(ofNullable(voyage).map(Voyage::toEntity).orElse(null));
        entity.setVoyageur(ofNullable(voyageur).map(Voyageur::toEntity).orElse(null));
        entity.setClasse(ofNullable(classe).map(Classe::toEntity).orElse(null));
        entity.setStatus(
            ofNullable(status).map(ReservationStatusEnum::valueOf).orElse(ReservationStatusEnum.PENDING_PAYMENT)
        );
        entity.setFacturation(ofNullable(facturation).map(Facturation::toEntity).orElse(null));
        if (entity.getFacturation() != null) 
            entity.getFacturation().setReservation(entity);

        return entity;
    }
}
