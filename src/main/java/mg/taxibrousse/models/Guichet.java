package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.GuichetEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Guichet extends BaseDto<GuichetEntity> {

    private String name;
    private String phones;
    private String smsPhone;
    private String numeroMvola;
    private String numeroAirtelMoney;
    private String numeroOrangeMoney;
    private Boolean isActive;
    private Boolean paymentAutomatique;
    private String openingHours;

    private Gare gare;
    private Koperative koperative;
    private List<UserOperator> operateurs;
    private List<Gare> destinations;

    public static Guichet fromEntity(GuichetEntity entity) {
        return fromEntity(entity, true);
    }

    public static Guichet fromEntity(GuichetEntity entity, boolean includeOperateurs) {
        return fromEntity(entity, includeOperateurs, false);
    }

    public static Guichet fromEntity(GuichetEntity entity, boolean includeOperateurs, boolean includeDestinations) {
        if (entity == null) {
            return null;
        }
        var model = new Guichet();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setPhones(entity.getPhones());
        model.setSmsPhone(entity.getSmsPhone());
        model.setNumeroMvola(entity.getNumeroMvola());
        model.setNumeroAirtelMoney(entity.getNumeroAirtelMoney());
        model.setNumeroOrangeMoney(entity.getNumeroOrangeMoney());
        model.setIsActive(entity.getIsActive());
        model.setPaymentAutomatique(entity.getPaymentAutomatique());
        model.setOpeningHours(entity.getOpeningHours());
        model.setGare(Gare.fromEntity(entity.getGare()));
        model.setKoperative(entity.getKoperative() != null ? Koperative.fromEntity(entity.getKoperative(), false) : null);

        if (includeOperateurs) {
            model.setOperateurs(BaseDto.mapEntities(entity.getOperateurs(), operateur -> UserOperator.fromEntity(operateur, false)));
        }

        if (includeDestinations) {
            model.setDestinations(BaseDto.mapEntities(entity.getDestinations(), Gare::fromEntity));
        }

        return model;
    }

    public static GuichetBuilder<?, ?> toBuilder(GuichetEntity entity) {
        return Guichet.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .phones(entity.getPhones())
                .smsPhone(entity.getSmsPhone())
                .numeroMvola(entity.getNumeroMvola())
                .numeroAirtelMoney(entity.getNumeroAirtelMoney())
                .numeroOrangeMoney(entity.getNumeroOrangeMoney())
                .isActive(entity.getIsActive())
                .paymentAutomatique(entity.getPaymentAutomatique())
                .openingHours(entity.getOpeningHours());
    }

    public static Guichet fromEntityLight(GuichetEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public GuichetEntity toEntity(GuichetEntity entity) {
        entity = Objects.requireNonNullElse(entity, new GuichetEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setPhones(phones);
        entity.setSmsPhone(smsPhone);
        entity.setNumeroMvola(numeroMvola);
        entity.setNumeroAirtelMoney(numeroAirtelMoney);
        entity.setNumeroOrangeMoney(numeroOrangeMoney);
        entity.setIsActive(Boolean.TRUE.equals(isActive));
        entity.setPaymentAutomatique(Boolean.TRUE.equals(paymentAutomatique));
        entity.setOpeningHours(openingHours);
        entity.setGare(gare != null ? gare.toEntity() : null);
        entity.setKoperative(koperative != null ? koperative.toEntity() : null);
        entity.setOperateurs(BaseDto.mapModels(operateurs, UserOperator::toEntity));
        entity.setDestinations(BaseDto.mapModels(destinations, gareDestination -> gareDestination.toEntity()));
        return entity;
    }
}
