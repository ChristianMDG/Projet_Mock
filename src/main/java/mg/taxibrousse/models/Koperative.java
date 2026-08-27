package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ClasseEntity;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;
import mg.taxibrousse.entities.enums.KoperativeTypeEnum;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Koperative extends BaseDto<KoperativeEntity> {

    private String name;
    private String slug;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String registrationNumber;
    private String taxId;
    private String website;
    private String logoUrl;
    private List<String> routes;
    private KoperativeStatusEnum status;
    private KoperativeTypeEnum type;
    private UserInfo proprietaire;

    private List<Guichet> guichets;
    private List<Crafter> crafters;
    private List<Ville> villes;

    public static Koperative fromEntity(KoperativeEntity entity, boolean withRelations) {
        if (entity == null) {
            return null;
        }
        var model = fromEntityBasic(entity);
        if (withRelations) {
            model.setProprietaire(UserInfo.fromEntity(entity.getProprietaire()));
            model.setGuichets(BaseDto.mapEntities(entity.getGuichets(), guichet -> Guichet.fromEntity(guichet, false)));
            model.setCrafters(BaseDto.mapEntities(entity.getCrafters(), Crafter::fromEntity));
            model.setVilles(BaseDto.mapEntities(entity.getVilles(), Ville::fromEntity));
        }
        return model;
    }

    public static Koperative fromEntity(KoperativeEntity entity) {
        return fromEntity(entity, true);
    }

    /** Search-page projection: only id, name, phone, logoUrl and status. */
    public static Koperative fromEntityForSearch(KoperativeEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Koperative();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setPhone(entity.getPhone());
        model.setLogoUrl(entity.getLogoUrl());
        model.setStatus(entity.getStatus());
        model.setType(entity.getType());
        return model;
    }

    private static Koperative fromEntityBasic(KoperativeEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Koperative();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setSlug(toSlug(entity.getName()));
        model.setDescription(entity.getDescription());
        model.setAddress(entity.getAddress());
        model.setPhone(entity.getPhone());
        model.setEmail(entity.getEmail());
        model.setRegistrationNumber(entity.getRegistrationNumber());
        model.setTaxId(entity.getTaxId());
        model.setWebsite(entity.getWebsite());
        model.setLogoUrl(entity.getLogoUrl());
        model.setStatus(entity.getStatus());
        model.setType(entity.getType());
        return model;
    }

    public static KoperativeBuilder<?, ?> toBuilder(KoperativeEntity entity) {
        if (entity == null) {
            return Koperative.builder();
        }
        return Koperative.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .slug(toSlug(entity.getName()))
                .description(entity.getDescription())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .registrationNumber(entity.getRegistrationNumber())
                .taxId(entity.getTaxId())
                .website(entity.getWebsite())
                .logoUrl(entity.getLogoUrl())
                .status(entity.getStatus())
                .type(entity.getType());
    }

    public static String toSlug(String value) {
        if (StringUtils.hasText(value)) {
            return value.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-)|(-$)", "");
        }

        return "";
    }

    @Override
    public KoperativeEntity toEntity(KoperativeEntity entity) {
        entity = Objects.requireNonNullElse(entity, new KoperativeEntity());

        // Preserve classes collection when updating (classes are managed separately)
        Set<ClasseEntity> existingClasses = entity.getClasses();

        // Map model lists to entity sets (mapModels returns an empty list when input is null)
        entity.setGuichets(new HashSet<>(BaseDto.mapModels(guichets, BaseDto::toEntity)));
        entity.setCrafters(new HashSet<>(BaseDto.mapModels(crafters, BaseDto::toEntity)));
        entity.setVilles(new HashSet<>(BaseDto.mapModels(villes, BaseDto::toEntity)));

        setBaseEntity(entity);
        entity.setName(name);
        entity.setSlug(toSlug(name));
        entity.setDescription(description);
        entity.setAddress(address);
        entity.setPhone(phone);
        entity.setEmail(email);
        entity.setRegistrationNumber(registrationNumber);
        entity.setTaxId(taxId);
        entity.setWebsite(website);
        entity.setLogoUrl(logoUrl);
        entity.setStatus(status);
        entity.setType(type);

        // Restore classes collection
        entity.setClasses(existingClasses);

        return entity;
    }
}
