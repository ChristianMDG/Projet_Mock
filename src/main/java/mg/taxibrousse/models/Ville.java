package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.VilleEntity;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Ville extends BaseDto<VilleEntity> {

    private String name;
    private String region;
    private String province;
    private String code;
    private Boolean isActive;
    private String rn;
    private Integer frequence;
    private String keywords;
    private Long detailId;

    public static Ville fromEntity(VilleEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Ville();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        model.setRegion(entity.getRegion());
        model.setProvince(entity.getProvince());
        model.setCode(entity.getCode());
        model.setIsActive(entity.getIsActive());
        model.setRn(entity.getRn());
        model.setFrequence(entity.getFrequence());
        model.setKeywords(entity.getKeywords());
        model.setDetailId(entity.getDetailId());
        return model;
    }

    public static VilleBuilder<?, ?> toBuilder(VilleEntity entity) {
        if (entity == null) {
            return Ville.builder();
        }
        return Ville.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .region(entity.getRegion())
                .province(entity.getProvince())
                .code(entity.getCode())
                .isActive(entity.getIsActive())
                .rn(entity.getRn())
                .frequence(entity.getFrequence())
                .keywords(entity.getKeywords())
                .detailId(entity.getDetailId());
    }

    public static Ville fromEntityLight(VilleEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public VilleEntity toEntity(VilleEntity entity) {
        entity = Objects.requireNonNullElse(entity, new VilleEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setRegion(region);
        entity.setProvince(province);
        entity.setCode(code);
        entity.setIsActive(isActive);
        entity.setRn(rn);
        entity.setFrequence(frequence != null ? frequence : 0);
        entity.setKeywords(keywords);
        entity.setDetailId(detailId);
        return entity;
    }
}
