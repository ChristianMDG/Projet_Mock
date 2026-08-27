package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.InventoryLogEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class InventoryLog extends BaseDto<InventoryLogEntity> {

    @Override
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public java.time.LocalDateTime getCreatedAt() {
        return super.getCreatedAt();
    }

    private Long inventoryId;
    private Integer delta;
    private String reason;
    private Long userId;

    public static InventoryLog fromEntity(InventoryLogEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new InventoryLog();
        model.setBaseDto(entity);
        if (entity.getInventory() != null) {
            model.setInventoryId(entity.getInventory().getId());
        }
        model.setDelta(entity.getDelta());
        model.setReason(entity.getReason());
        model.setUserId(entity.getUserId());
        return model;
    }

    public static InventoryLogBuilder<?, ?> toBuilder(InventoryLogEntity entity) {
        if (entity == null) {
            return InventoryLog.builder();
        }
        return InventoryLog.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .inventoryId(entity.getInventory() != null ? entity.getInventory().getId() : null)
                .delta(entity.getDelta())
                .reason(entity.getReason())
                .userId(entity.getUserId());
    }

    public static InventoryLog fromEntityLight(InventoryLogEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public InventoryLogEntity toEntity(InventoryLogEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, InventoryLogEntity::new);
        setBaseEntity(entity);
        entity.setDelta(delta);
        entity.setReason(reason);
        entity.setUserId(userId);
        if (inventoryId != null) {
            InventoryEntity inv = new InventoryEntity();
            inv.setId(inventoryId);
            entity.setInventory(inv);
        }
        return entity;
    }
}
