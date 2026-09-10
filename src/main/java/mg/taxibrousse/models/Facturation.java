package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Facturation extends BaseDto<FacturationEntity> {

    private String invoiceNumber;
    private BigDecimal amount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BigDecimal remainingAmount;
    private BigDecimal advanceAmount;
    private BigDecimal commission;
    private String paymentReference;
    private PaymentStatusEnum paymentStatus;
    private LocalDateTime paymentDate;
    private LocalDateTime dueDate;
    private Reservation reservation;
    private String paymentMethodIdentifier;
    private String paymentPhoneNumber;
    private BigDecimal fraisRetrait;
    private BigDecimal fraisTransfert;
    private BigDecimal fraisTotal;
    private BigDecimal fraisTransaction;
    private BigDecimal commissionSeats;
    private BigDecimal commissionFee;
    private BigDecimal montantTransfert;

    public static Facturation fromEntity(FacturationEntity entity) {
        return fromEntity(entity, false);
    }

    public static Facturation fromEntity(FacturationEntity entity, boolean includeReservation) {
        if (entity == null) {
            return null;
        }
        var model = new Facturation();
        model.setBaseDto(entity);
        model.setInvoiceNumber(entity.getInvoiceNumber());
        model.setAmount(entity.getAmount());
        model.setTaxAmount(entity.getTaxAmount());
        model.setTotalAmount(entity.getTotalAmount());
        model.setRemainingAmount(entity.getRemainingAmount());
        model.setAdvanceAmount(entity.getAdvanceAmount());
        model.setCommission(entity.getCommission());
        model.setPaymentReference(entity.getPaymentReference());
        model.setPaymentStatus(entity.getPaymentStatus());
        model.setPaymentDate(entity.getPaymentDate());
        model.setDueDate(entity.getDueDate());
        model.setPaymentMethodIdentifier(entity.getPaymentMethodIdentifier());

        if (includeReservation && entity.getReservation() != null) {
            model.setReservation(mapReservation(entity.getReservation()));
        }

        return model;
    }

    private static Reservation mapReservation(mg.taxibrousse.entities.ReservationEntity reservationEntity) {
        var reservation = Reservation.fromEntityLight(reservationEntity);

        Optional.ofNullable(reservationEntity.getSeats()).filter(seats -> !seats.isEmpty()).ifPresent(seats -> reservation.setSeats(seats.stream().map(Seat::fromEntityLight).toList()));

        Optional.ofNullable(reservationEntity.getVoyage()).ifPresent(voyage -> reservation.setVoyage(mapVoyage(voyage)));

        return reservation;
    }

    private static Voyage mapVoyage(mg.taxibrousse.entities.VoyageEntity voyageEntity) {
        var voyage = Voyage.fromEntityLight(voyageEntity);
        Optional.ofNullable(voyageEntity.getKoperative()).ifPresent(k -> voyage.setKoperative(Koperative.fromEntity(k, false)));
        Optional.ofNullable(voyageEntity.getDepartureGare()).ifPresent(g -> voyage.setDepartureGare(Gare.fromEntity(g, false)));
        Optional.ofNullable(voyageEntity.getArrivalGare()).ifPresent(g -> voyage.setArrivalGare(Gare.fromEntity(g, false)));
        return voyage;
    }

    public static FacturationBuilder<?, ?> toBuilder(FacturationEntity entity) {
        return Facturation.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .invoiceNumber(entity.getInvoiceNumber())
                .amount(entity.getAmount())
                .taxAmount(entity.getTaxAmount())
                .totalAmount(entity.getTotalAmount())
                .remainingAmount(entity.getRemainingAmount())
                .advanceAmount(entity.getAdvanceAmount())
                .commission(entity.getCommission())
                .paymentReference(entity.getPaymentReference())
                .paymentStatus(entity.getPaymentStatus())
                .paymentDate(entity.getPaymentDate())
                .dueDate(entity.getDueDate())
                .paymentMethodIdentifier(entity.getPaymentMethodIdentifier());
    }

    public static Facturation fromEntityLight(FacturationEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public FacturationEntity toEntity(FacturationEntity entity) {
        entity = Objects.requireNonNullElse(entity, new FacturationEntity());
        setBaseEntity(entity);
        entity.setInvoiceNumber(invoiceNumber);
        entity.setAmount(amount);
        entity.setTaxAmount(taxAmount);
        entity.setTotalAmount(totalAmount);
        entity.setRemainingAmount(remainingAmount);
        entity.setAdvanceAmount(advanceAmount);
        entity.setCommission(commission);
        entity.setPaymentReference(paymentReference);
        entity.setPaymentStatus(paymentStatus);
        entity.setPaymentDate(paymentDate);
        entity.setDueDate(dueDate);
        return entity;
    }
}
