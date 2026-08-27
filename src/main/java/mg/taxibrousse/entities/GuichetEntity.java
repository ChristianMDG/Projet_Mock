package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Table(name = "Guichet")
@Entity(name = "Guichet")
@NoArgsConstructor
public class GuichetEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private GareEntity gare;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private KoperativeEntity koperative;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "guichet_operateurs", joinColumns = @JoinColumn(name = "guichet_id"), inverseJoinColumns = @JoinColumn(name = "operateur_id"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<UserOperatorEntity> operateurs;

    @Column
    private String phones;

    @Column
    private String smsPhone;

    @Column
    private String numeroMvola;

    @Column
    private String numeroAirtelMoney;

    @Column
    private String numeroOrangeMoney;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean paymentAutomatique = false;

    @Column(length = 100)
    private String openingHours;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity photo;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "guichet_destinations", joinColumns = @JoinColumn(name = "guichet_id"), inverseJoinColumns = @JoinColumn(name = "gare_id"))
    private List<GareEntity> destinations;
}
