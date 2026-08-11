package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ResourceEntity;

import java.util.Objects;

@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Resource extends BaseDto<ResourceEntity> {

    private String key;
    private String fr;
    private String en;
    private String mg;

    public static Resource fromEntity(ResourceEntity entity) {
        if (entity == null) {
            return null;
        }
        Resource model = new Resource();
        model.setBaseDto(entity);
        model.setKey(entity.getKey());
        model.setFr(entity.getFr());
        model.setEn(entity.getEn());
        model.setMg(entity.getMg());
        return model;
    }

    public static ResourceBuilder<?, ?> toBuilder(ResourceEntity entity) {
        return Resource.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .key(entity.getKey())
                .fr(entity.getFr())
                .en(entity.getEn())
                .mg(entity.getMg());
    }

    @Override
    public ResourceEntity toEntity(ResourceEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ResourceEntity());
        setBaseEntity(entity);
        entity.setKey(this.key);
        entity.setFr(this.fr);
        entity.setEn(this.en);
        entity.setMg(this.mg);
        return entity;
    }
}
