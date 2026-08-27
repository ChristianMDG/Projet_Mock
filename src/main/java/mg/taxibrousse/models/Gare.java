package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CloudinaryEntity;
import mg.taxibrousse.entities.GareEntity;
import mg.taxibrousse.entities.VilleEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Gare extends BaseDto<GareEntity> {

    private String name;
    private String address;
    private String description;
    private Boolean isClosed;
    private Integer frequence;
    private Ville ville;
    private Cloudinary photo;
    private List<Guichet> guichets;
    private List<Cloudinary> photos;

    public static Gare fromEntity(GareEntity entity) {
        return fromEntity(entity, false);
    }

    public static Gare fromEntity(GareEntity entity, boolean withDetails) {
        if (entity == null) {
            return null;
        }
        var model = new Gare();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setAddress(entity.getAddress());
        model.setDescription(entity.getDescription());
        model.setIsClosed(entity.getIsClosed());
        model.setFrequence(entity.getFrequence());

        if (entity.getVille() != null) {
            model.setVille(Ville.fromEntity(entity.getVille()));
        }

        if (entity.getPhoto() != null) {
            model.setPhoto(Cloudinary.fromEntity(entity.getPhoto()));
        }

        if (withDetails && entity.getPhotos() != null) {
            model.setPhotos(entity.getPhotos().stream().map(Cloudinary::fromEntity).toList());
        }

        if (withDetails && entity.getGuichets() != null) {
            model.setGuichets(entity.getGuichets().stream().map(guichet -> Guichet.fromEntity(guichet, false)).toList());
        }

        return model;
    }

    public static GareBuilder<?, ?> toBuilder(GareEntity entity) {
        if (entity == null) {
            return Gare.builder();
        }
        return Gare.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .address(entity.getAddress())
                .description(entity.getDescription())
                .isClosed(entity.getIsClosed())
                .frequence(entity.getFrequence());
    }

    public static Gare fromEntityLight(GareEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public GareEntity toEntity(GareEntity entity) {
        entity = Objects.requireNonNullElse(entity, new GareEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setAddress(address);
        entity.setDescription(description);
        entity.setIsClosed(isClosed);
        entity.setFrequence(frequence != null ? frequence : 0);

        if (ville != null) {
            VilleEntity villeEntity = new VilleEntity();
            villeEntity.setId(ville.getId());
            entity.setVille(villeEntity);
        }

        if (photo != null) {
            CloudinaryEntity photoEntity = new CloudinaryEntity();
            photoEntity.setId(photo.getId());
            entity.setPhoto(photoEntity);
        }

        if (photos != null && !photos.isEmpty()) {
            List<CloudinaryEntity> photoEntities = photos.stream().map(img -> {
                CloudinaryEntity photoEntity = new CloudinaryEntity();
                photoEntity.setId(img.getId());
                return photoEntity;
            }).toList();
            entity.setPhotos(photoEntities);
        }

        return entity;
    }
}
