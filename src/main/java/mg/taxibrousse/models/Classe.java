package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ClasseEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Classe extends BaseDto<ClasseEntity> {

    private String name;
    private String description;
    private Long koperativeId;

    public static Classe fromEntity(ClasseEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Classe();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setKoperativeId(entity.getKoperative() != null ? entity.getKoperative().getId() : null);
        return model;
    }

    public static ClasseBuilder<?, ?> toBuilder(ClasseEntity entity) {
        if (entity == null) {
            return Classe.builder();
        }
        return Classe.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .description(entity.getDescription())
                .koperativeId(entity.getKoperative() != null ? entity.getKoperative().getId() : null);
    }

    public static Classe fromEntityLight(ClasseEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ClasseEntity toEntity(ClasseEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ClasseEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setDescription(description);
        return entity;
    }
}
