package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ColisEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.entities.enums.ColisTypeEnum;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
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
        var model = fromEntityLight(entity);
        model.setCrafter(Optional.ofNullable(entity.getCrafter()).map(Crafter::fromEntity).orElse(null));
        model.setReservation(Optional.ofNullable(entity.getReservation()).map(Reservation::fromEntity).orElse(null));
        model.setVoyageId(Optional.ofNullable(entity.getVoyage()).map(VoyageEntity::getId).orElse(null));
        return model;
    }

    public static Colis fromEntityLight(ColisEntity entity) {
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
        return model;
    }

    @Override
    public ColisEntity toEntity(ColisEntity entity) {
        ColisEntity targetEntity = Objects.requireNonNullElseGet(entity, ColisEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setSenderName(senderName);
        targetEntity.setSenderPhone(senderPhone);
        targetEntity.setRecipientName(recipientName);
        targetEntity.setRecipientPhone(recipientPhone);
        targetEntity.setDescription(description);
        targetEntity.setType(type);
        targetEntity.setContent(content);
        targetEntity.setEstimatedValue(estimatedValue);
        targetEntity.setWeight(weight);
        targetEntity.setPrice(price);
        targetEntity.setStatus(status);
        targetEntity.setCrafter(Optional.ofNullable(crafter).map(BaseDto::toEntity).orElse(null));
        targetEntity.setReservation(Optional.ofNullable(reservation).map(BaseDto::toEntity).orElse(null));
        Optional.ofNullable(voyageId).ifPresent(id -> {
            VoyageEntity voyage = new VoyageEntity();
            voyage.setId(id);
            targetEntity.setVoyage(voyage);
        });
        return targetEntity;
    }
}
