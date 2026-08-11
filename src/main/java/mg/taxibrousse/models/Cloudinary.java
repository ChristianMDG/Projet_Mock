package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CloudinaryEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Cloudinary extends BaseDto<CloudinaryEntity> {

    private String publicId;
    private String url;
    private String format;
    private String resourceType;
    private Long bytes;
    private Integer width;
    private Integer height;

    public static Cloudinary fromEntity(CloudinaryEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Cloudinary();
        model.setBaseDto(entity);
        model.setPublicId(entity.getPublicId());
        model.setUrl(entity.getUrl());
        model.setFormat(entity.getFormat());
        model.setResourceType(entity.getResourceType());
        model.setBytes(entity.getBytes());
        model.setWidth(entity.getWidth());
        model.setHeight(entity.getHeight());
        return model;
    }

    public static CloudinaryBuilder<?, ?> toBuilder(CloudinaryEntity entity) {
        if (entity == null) {
            return Cloudinary.builder();
        }
        return Cloudinary.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .publicId(entity.getPublicId())
                .url(entity.getUrl())
                .format(entity.getFormat())
                .resourceType(entity.getResourceType())
                .bytes(entity.getBytes())
                .width(entity.getWidth())
                .height(entity.getHeight());
    }

    public static Cloudinary fromEntityLight(CloudinaryEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CloudinaryEntity toEntity(CloudinaryEntity entity) {
        entity = Objects.requireNonNullElse(entity, new CloudinaryEntity());
        setBaseEntity(entity);
        entity.setPublicId(publicId);
        entity.setUrl(url);
        entity.setFormat(format);
        entity.setResourceType(resourceType);
        entity.setBytes(bytes);
        entity.setWidth(width);
        entity.setHeight(height);
        return entity;
    }
}
