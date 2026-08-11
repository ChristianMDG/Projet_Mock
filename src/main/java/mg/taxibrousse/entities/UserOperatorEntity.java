package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity(name = "UserOperator")
@DiscriminatorValue("OPERATOR")
public class UserOperatorEntity extends UserInfoEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    private KoperativeEntity koperative;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "proprietaire")
    private Set<KoperativeEntity> koperatives;

    @ManyToMany(mappedBy = "operateurs", fetch = FetchType.LAZY)
    private Set<GuichetEntity> guichets;

    /** Many koperatives directly assigned to this operator (not ownership). */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "operator_koperatives",
        joinColumns = @JoinColumn(name = "operator_id"),
        inverseJoinColumns = @JoinColumn(name = "koperative_id")
    )
    private Set<KoperativeEntity> assignedKoperatives;

    /** Single departure gare for this operator. */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "departure_gare_id")
    private GareEntity departureGare;
}
