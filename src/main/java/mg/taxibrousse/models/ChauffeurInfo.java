package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ChauffeurInfoEntity;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class ChauffeurInfo extends UserOperator {

    public static ChauffeurInfo fromEntity(ChauffeurInfoEntity entity) {
        if (entity == null) {
            return null;
        }
        ChauffeurInfo model = new ChauffeurInfo();
        model.setBaseUserInfoFields(entity, model);
        model.setKoperative(Koperative.fromEntity(entity.getKoperative(), false));
        return model;
    }

    public ChauffeurInfoEntity toEntity(ChauffeurInfoEntity entity) {
        if (entity == null) {
            entity = new ChauffeurInfoEntity();
        }
        super.toEntity(entity);
        return entity;
    }

    @Override
    public ChauffeurInfoEntity toEntity() {
        return toEntity(new ChauffeurInfoEntity());
    }
}
