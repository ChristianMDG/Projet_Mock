package mg.taxibrousse.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "ChauffeurInfo")
@DiscriminatorValue("CHAUFFEUR")
public class ChauffeurInfoEntity extends UserOperatorEntity {
}
