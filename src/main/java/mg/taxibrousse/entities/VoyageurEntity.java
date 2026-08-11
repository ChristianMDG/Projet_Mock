package mg.taxibrousse.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity(name = "Voyageur")
@DiscriminatorValue("VOYAGEUR")
@NoArgsConstructor
public class VoyageurEntity extends UserInfoEntity {

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "voyageur")
    private List<ReservationEntity> reservations;
}
