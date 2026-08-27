package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.GareEntity;
import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.UserOperatorEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserOperator extends UserInfo {

    private boolean withKoperative;
    private Koperative koperative;
    private List<Guichet> guichets;
    private List<Koperative> assignedKoperatives;
    private Gare departureGare;

    public static UserOperator fromEntity(UserOperatorEntity entity) {
        return fromEntity(entity, true);
    }

    public static UserOperator fromEntity(UserOperatorEntity entity, boolean includeRelations) {
        if (entity == null) {
            return null;
        }

        UserOperator model = new UserOperator();
        model.setBaseUserInfoFields(entity, model);
        model.setKoperative(Koperative.fromEntity(entity.getKoperative(), false));
        model.setDepartureGare(Gare.fromEntity(entity.getDepartureGare()));

        if (includeRelations) {
            model.setGuichets(BaseDto.mapEntities(entity.getGuichets(), guichet -> Guichet.fromEntity(guichet, false)));
            model.setAssignedKoperatives(BaseDto.mapEntities(entity.getAssignedKoperatives(), k -> Koperative.fromEntity(k, false)));
        }

        return model;
    }

    public static UserOperatorBuilder<?, ?> toBuilder(UserOperatorEntity entity) {
        if (entity == null) {
            return UserOperator.builder();
        }
        return UserOperator.builder()
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
                .isActive(entity.getIsActive())
                .koperative(Koperative.fromEntity(entity.getKoperative(), false))
                .departureGare(Gare.fromEntity(entity.getDepartureGare()))
                .guichets(BaseDto.mapEntities(entity.getGuichets(), guichet -> Guichet.fromEntity(guichet, false)))
                .assignedKoperatives(BaseDto.mapEntities(entity.getAssignedKoperatives(), k -> Koperative.fromEntity(k, false)));
    }

    public static UserOperator fromEntityLight(UserOperatorEntity entity) {
        return toBuilder(entity).build();
    }

    public UserOperatorEntity toEntity(UserOperatorEntity entity) {
        entity = Objects.requireNonNullElse(entity, new UserOperatorEntity());
        setBaseUserInfoFields(entity);
        entity.setKoperative(BaseDto.toIdentity(KoperativeEntity.class, koperative));
        entity.setGuichets(BaseDto.toIdentities(GuichetEntity.class, guichets));
        entity.setDepartureGare(BaseDto.toIdentity(GareEntity.class, departureGare));
        entity.setAssignedKoperatives(BaseDto.toIdentities(KoperativeEntity.class, assignedKoperatives) != null
                ? new java.util.HashSet<>(BaseDto.toIdentities(KoperativeEntity.class, assignedKoperatives))
                : null);
        return entity;
    }

    @Override
    public UserOperatorEntity toEntity() {
        return toEntity(new UserOperatorEntity());
    }

    public boolean hasKoperative() {
        return koperative != null && koperative.getId() != null && koperative.getId() > 0;
    }

    public boolean isCreation() {
        return id == null || id == 0;
    }
}
