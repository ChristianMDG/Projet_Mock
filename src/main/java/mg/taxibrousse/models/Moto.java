package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.MotoEntity;

import java.time.LocalDate;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Moto extends BaseDto<MotoEntity> {

    private String registrationNumber;
    private String model;
    private Integer yearManufactured;
    private Boolean isActive;
    private LocalDate lastMaintenance;

    public static Moto fromEntity(MotoEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Moto();
        model.setBaseDto(entity);
        model.setRegistrationNumber(entity.getRegistrationNumber());
        model.setModel(entity.getModel());
        model.setYearManufactured(entity.getYearManufactured());
        model.setIsActive(entity.getIsActive());
        model.setLastMaintenance(entity.getLastMaintenance());
        return model;
    }

    public static MotoBuilder<?, ?> toBuilder(MotoEntity entity) {
        return Moto.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .registrationNumber(entity.getRegistrationNumber())
                .model(entity.getModel())
                .yearManufactured(entity.getYearManufactured())
                .isActive(entity.getIsActive())
                .lastMaintenance(entity.getLastMaintenance());
    }

    public static Moto fromEntityLight(MotoEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public MotoEntity toEntity(MotoEntity entity) {
        entity = Objects.requireNonNullElse(entity, new MotoEntity());
        setBaseEntity(entity);
        entity.setRegistrationNumber(registrationNumber);
        entity.setModel(model);
        entity.setYearManufactured(yearManufactured);
        entity.setIsActive(isActive);
        entity.setLastMaintenance(lastMaintenance);
        return entity;
    }
}
