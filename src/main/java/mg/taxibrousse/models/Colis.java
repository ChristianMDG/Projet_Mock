package mg.taxibrousse.models;

import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.ColisEntity;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.entities.enums.ColisTypeEnum;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
public class Colis extends BaseDto<ColisEntity> {

    private String senderName;
    private String senderPhone;
    private String recipientName;
    private String recipientPhone;
    private String description;
    private ColisTypeEnum type;
    private String content;
    private BigDecimal estimatedValue;
    private Double weight;
    private BigDecimal price;
    private ColisStatusEnum status;
    private Crafter crafter;
    private Reservation reservation;
    private Long voyageId;

    public static Colis fromEntity(ColisEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Colis();
        model.setBaseDto(entity);
        model.setSenderName(entity.getSenderName());
        model.setSenderPhone(entity.getSenderPhone());
        model.setRecipientName(entity.getRecipientName());
        model.setRecipientPhone(entity.getRecipientPhone());
        model.setDescription(entity.getDescription());
        model.setType(entity.getType());
        model.setContent(entity.getContent());
        model.setEstimatedValue(entity.getEstimatedValue());
        model.setWeight(entity.getWeight());
        model.setPrice(entity.getPrice());
        model.setStatus(entity.getStatus());
        model.setCrafter(Crafter.fromEntity(entity.getCrafter()));
        model.setReservation(Reservation.fromEntity(entity.getReservation()));
        model.setVoyageId(entity.getVoyage() != null ? entity.getVoyage().getId() : null);
        return model;
    }

    @Override
    public ColisEntity toEntity(ColisEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ColisEntity());
        setBaseEntity(entity);
        entity.setSenderName(senderName);
        entity.setSenderPhone(senderPhone);
        entity.setRecipientName(recipientName);
        entity.setRecipientPhone(recipientPhone);
        entity.setDescription(description);
        entity.setType(type);
        entity.setContent(content);
        entity.setEstimatedValue(estimatedValue);
        entity.setWeight(weight);
        entity.setPrice(price);
        entity.setStatus(status);
        entity.setCrafter(crafter != null ? crafter.toEntity() : null);
        entity.setReservation(reservation != null ? reservation.toEntity() : null);
        // Voyage is set in ColisService
        // entity.setVoyage(voyageId != null ? VoyageEntity.builder().id(voyageId).build() : null);
        return entity;
    }
}
