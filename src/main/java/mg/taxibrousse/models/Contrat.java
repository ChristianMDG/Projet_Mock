package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ContratEntity;
import mg.taxibrousse.entities.enums.ContratStatusEnum;
import mg.taxibrousse.entities.enums.ContratTypeEnum;

import java.time.LocalDate;
import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Contrat extends BaseDto<ContratEntity> {

    private ContratTypeEnum type;
    private String title;
    private String terms;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContratStatusEnum status;

    public static Contrat fromEntity(ContratEntity entity) {
        if (entity == null) {
            return null;
        }
        return fromEntityBasic(entity);
    }

    private static Contrat fromEntityBasic(ContratEntity entity) {
        if (entity == null) {
            return null;
        }
        var dto = new Contrat();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setTitle(entity.getTitle());
        dto.setTerms(entity.getTerms());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public static ContratBuilder<?, ?> toBuilder(ContratEntity entity) {
        return Contrat.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .type(entity.getType())
                .title(entity.getTitle())
                .terms(entity.getTerms())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus());
    }

    public static Contrat fromEntityLight(ContratEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ContratEntity toEntity(ContratEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ContratEntity());
        setBaseEntity(entity);
        entity.setType(type);
        entity.setTitle(title);
        entity.setTerms(terms);
        entity.setStartDate(startDate);
        entity.setEndDate(endDate);
        entity.setStatus(status);
        return entity;
    }
}
