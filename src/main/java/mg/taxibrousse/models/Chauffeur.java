package mg.taxibrousse.models;

import jakarta.persistence.EntityNotFoundException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ChauffeurEntity;
import mg.taxibrousse.entities.ChauffeurInfoEntity;
import org.hibernate.Hibernate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Chauffeur extends BaseDto<ChauffeurEntity> {

    private ChauffeurInfo user;
    private String licenseNumber;
    private String licenseAuthority;
    private LocalDate licenseExpiry;
    private Integer experienceYears;
    private BigDecimal rating;
    private Boolean isAvailable;
    private Cloudinary photo;
    private List<Crafter> craftersAssigned;
    private List<Moto> motos;
    private List<Contrat> contrats;
    private List<Voyage> voyages;
    private Long koperativeId;

    public static Chauffeur fromEntity(ChauffeurEntity entity) {
        if (entity == null) {
            return null;
        }

        var model = new Chauffeur();
        model.setBaseDto(entity);

        // Safely load user - handles orphan references where ChauffeurInfoEntity was deleted
        ChauffeurInfoEntity userEntity = safelyLoadUser(entity);
        model.setUser(Optional.ofNullable(userEntity).map(ChauffeurInfo::fromEntity).orElse(null));
        model.setLicenseNumber(entity.getLicenseNumber());
        model.setLicenseAuthority(entity.getLicenseAuthority());
        model.setLicenseExpiry(entity.getLicenseExpiry());
        model.setExperienceYears(entity.getExperienceYears());
        model.setRating(entity.getRating());
        model.setIsAvailable(entity.getIsAvailable());
        model.setPhoto(Optional.ofNullable(entity.getPhoto()).map(Cloudinary::fromEntity).orElse(null));

        model.setKoperativeId(Optional.ofNullable(userEntity).filter(u -> u.getKoperative() != null).map(u -> u.getKoperative().getId()).orElse(null));

        return model;
    }

    private static ChauffeurInfoEntity safelyLoadUser(ChauffeurEntity entity) {
        try {
            ChauffeurInfoEntity user = entity.getUser();
            if (user != null) {
                Hibernate.initialize(user);
            }
            return user;
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    public static ChauffeurBuilder<?, ?> toBuilder(ChauffeurEntity entity) {
        if (entity == null) {
            return Chauffeur.builder();
        }
        return Chauffeur.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .licenseNumber(entity.getLicenseNumber())
                .licenseAuthority(entity.getLicenseAuthority())
                .licenseExpiry(entity.getLicenseExpiry())
                .experienceYears(entity.getExperienceYears())
                .rating(entity.getRating())
                .isAvailable(entity.getIsAvailable());
    }

    public static Chauffeur fromEntityLight(ChauffeurEntity entity) {
        return toBuilder(entity).build();
    }

    /**
     * Lightweight projection that includes user info (firstName/lastName)
     * without loading collections (crafters, motos, contrats, voyages).
     * Used in voyage grouped/search projections.
     */
    public static Chauffeur fromEntityWithUser(ChauffeurEntity entity) {
        if (entity == null) {
            return null;
        }
        ChauffeurInfoEntity userEntity = safelyLoadUser(entity);
        return toBuilder(entity).user(Optional.ofNullable(userEntity).map(ChauffeurInfo::fromEntity).orElse(null)).build();
    }

    @Override
    public ChauffeurEntity toEntity(ChauffeurEntity entity) {
        var result = Objects.requireNonNullElseGet(entity, ChauffeurEntity::new);
        setBaseEntity(result);

        result.setUser(Optional.ofNullable(user).map(u -> u.toEntity(null)).orElse(null));
        result.setLicenseNumber(licenseNumber);
        result.setLicenseAuthority(licenseAuthority);
        result.setLicenseExpiry(licenseExpiry);
        result.setExperienceYears(experienceYears);
        result.setRating(rating);
        result.setIsAvailable(isAvailable);
        result.setPhoto(Optional.ofNullable(photo).map(Cloudinary::toEntity).orElse(null));

        return result;
    }
}
