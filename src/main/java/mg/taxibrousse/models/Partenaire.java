package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.PartenaireEntity;
import mg.taxibrousse.entities.enums.PartenaireTypeEnum;

import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Partenaire extends BaseDto<PartenaireEntity> {

    private String name;
    private PartenaireTypeEnum type;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private Boolean isActive;

    public static Partenaire fromEntity(PartenaireEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Partenaire();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setType(entity.getType());
        model.setContactPerson(entity.getContactPerson());
        model.setPhone(entity.getPhone());
        model.setEmail(entity.getEmail());
        model.setAddress(entity.getAddress());
        model.setIsActive(entity.getIsActive());
        return model;
    }

    public static PartenaireBuilder<?, ?> toBuilder(PartenaireEntity entity) {
        if (entity == null) {
            return Partenaire.builder();
        }
        return Partenaire.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .type(entity.getType())
                .contactPerson(entity.getContactPerson())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .address(entity.getAddress())
                .isActive(entity.getIsActive());
    }

    public static Partenaire fromEntityLight(PartenaireEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public PartenaireEntity toEntity(PartenaireEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, PartenaireEntity::new);
        setBaseEntity(entity);
        entity.setName(name);
        entity.setType(type);
        entity.setContactPerson(contactPerson);
        entity.setPhone(phone);
        entity.setEmail(email);
        entity.setAddress(address);
        entity.setIsActive(isActive);
        return entity;
    }
}
