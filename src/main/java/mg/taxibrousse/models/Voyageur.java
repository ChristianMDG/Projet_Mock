package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.VoyageurEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Voyageur extends UserInfo {

    private List<Reservation> reservations;

    public static Voyageur fromEntity(VoyageurEntity entity) {
        return fromEntity(entity, true);
    }

    public static Voyageur fromEntity(VoyageurEntity entity, boolean withDependencies) {
        if (entity == null) {
            return null;
        }

        Voyageur model = new Voyageur();
        model.setBaseUserInfoFields(entity, model);
        
        try {
            model.setPhoto(Cloudinary.fromEntity(entity.getPhoto()));
        } catch (Exception e) {
            model.setPhoto(null);
        }

        if (withDependencies) {
            try {
                model.setReservations(BaseDto.mapEntities(entity.getReservations(), Reservation::fromEntity));
            } catch (Exception e) {
                model.setReservations(null);
            }
        }

        return model;
    }

    public static VoyageurBuilder<?, ?> toBuilder(VoyageurEntity entity) {
        if (entity == null) {
            return Voyageur.builder();
        }
        return Voyageur.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .username(entity.getUsername())
                .isAdmin(entity.isAdmin())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .idNumber(entity.getIdNumber())
                .idType(entity.getIdType())
                .isActive(entity.getIsActive());
    }

    public VoyageurEntity toEntity(VoyageurEntity entity) {
        entity = Objects.requireNonNullElse(entity, new VoyageurEntity());
        setBaseUserInfoFields(entity);
        if (reservations != null) {
            entity.setReservations(BaseDto.mapModels(reservations, BaseDto::toEntity));
        }
        return entity;
    }

    @Override
    public VoyageurEntity toEntity() {
        return toEntity(new VoyageurEntity());
    }
}
