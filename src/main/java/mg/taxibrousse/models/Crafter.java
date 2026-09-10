package mg.taxibrousse.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.entities.KoperativeEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import org.springframework.util.StringUtils;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Crafter extends BaseDto<CrafterEntity> {

    private static final ObjectMapper SEAT_CONFIG_MAPPER = new ObjectMapper();

    private String registrationNumber;
    private String model;
    private Integer kilometrage;
    private Integer seatCapacity;
    private String configName;
    private Object seatConfig;
    private Koperative koperative;
    private Chauffeur chauffeur;
    private Boolean isActive;
    private LocalDate dateVisite;
    private Cloudinary photo;
    private List<Seat> seats;

    public static Crafter fromEntity(CrafterEntity entity) {
        return fromEntity(entity, false);
    }

    public static Crafter fromEntity(CrafterEntity entity, boolean withDetails) {
        if (entity == null) {
            return null;
        }
        var model = new Crafter();
        model.setBaseDto(entity);
        model.setRegistrationNumber(entity.getRegistrationNumber());
        model.setModel(entity.getModel());
        model.setKilometrage(entity.getKilometrage());
        model.setSeatCapacity(entity.getSeatCapacity());
        model.setConfigName(entity.getConfigName());
        model.setSeatConfig(deserializeSeatConfig(entity.getSeatConfig()));
        model.setIsActive(entity.getIsActive());
        model.setDateVisite(entity.getDateVisite());

        if (entity.getKoperative() != null) {
            model.setKoperative(Koperative.fromEntity(entity.getKoperative(), false));
        }

        if (entity.getChauffeur() != null) {
            model.setChauffeur(Chauffeur.fromEntity(entity.getChauffeur()));
        }

        if (entity.getPhoto() != null) {
            model.setPhoto(Cloudinary.fromEntity(entity.getPhoto()));
        }

        if (withDetails && entity.getSeats() != null) {
            model.setSeats(entity.getSeats().stream().map(Seat::fromEntity).toList());
        }

        return model;
    }

    public static CrafterBuilder<?, ?> toBuilder(CrafterEntity entity) {
        if (entity == null) {
            return Crafter.builder();
        }
        return Crafter.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .registrationNumber(entity.getRegistrationNumber())
                .model(entity.getModel())
                .kilometrage(entity.getKilometrage())
                .seatCapacity(entity.getSeatCapacity())
                .configName(entity.getConfigName())
                .isActive(entity.getIsActive())
                .dateVisite(entity.getDateVisite());
    }

    public static Crafter fromEntityLight(CrafterEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public CrafterEntity toEntity(CrafterEntity entity) {
        entity = Objects.requireNonNullElse(entity, new CrafterEntity());
        setBaseEntity(entity);
        entity.setRegistrationNumber(registrationNumber);
        entity.setModel(model);
        entity.setKilometrage(kilometrage);
        entity.setSeatCapacity(seatCapacity);
        entity.setConfigName(configName);
        entity.setSeatConfig(serializeSeatConfig(seatConfig));
        entity.setIsActive(isActive);
        entity.setDateVisite(dateVisite);

        if (koperative != null) {
            var koperativeEntity = new KoperativeEntity();
            koperativeEntity.setId(koperative.getId());
            entity.setKoperative(koperativeEntity);
        }

        if (chauffeur != null) {
            entity.setChauffeur(chauffeur.toEntity());
        }

        if (photo != null) {
            entity.setPhoto(photo.toEntity());
        }

        return entity;
    }

    private static Object deserializeSeatConfig(String raw) {
        if (StringUtils.hasText(raw)) {
            try {
                return SEAT_CONFIG_MAPPER.readValue(raw, Object.class);
            } catch (Exception _) {
                return raw;
            }
        }
        return null;
    }

    private static String serializeSeatConfig(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String s) {
            return s;
        }
        try {
            return SEAT_CONFIG_MAPPER.writeValueAsString(value);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid seatConfig payload", e);
        }
    }
}
