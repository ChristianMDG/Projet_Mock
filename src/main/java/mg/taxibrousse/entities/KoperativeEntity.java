package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Table(name = "koperative", indexes = {
    @Index(name = "idx_koperative_status", columnList = "status")
})
@Entity(name = "Koperative")
@NoArgsConstructor
public class KoperativeEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String registrationNumber;

    @Column(length = 50)
    private String taxId;

    @Column
    private String website;

    @Column
    private String logoUrl;

    private List<String> routes;

    @ManyToOne(fetch = FetchType.EAGER)
    private CloudinaryEntity logo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private KoperativeStatusEnum status = KoperativeStatusEnum.ACTIVE;

    @ManyToOne(fetch = FetchType.EAGER)
    private UserInfoEntity proprietaire;

    @OneToMany(mappedBy = "koperative")
    private Set<GuichetEntity> guichets;

    @OneToMany(mappedBy = "koperative")
    private Set<CrafterEntity> crafters;

    @OneToMany(mappedBy = "koperative")
    private Set<ChauffeurEntity> chauffeurs;

    @OneToMany(mappedBy = "koperative")
    private Set<ContratEntity> contrats;

    @OneToMany(mappedBy = "koperative")
    private Set<VoyageEntity> voyages;

    @OneToMany(mappedBy = "koperative")
    private Set<UserOperatorEntity> operateurs;

    @ManyToMany
    private Set<VilleEntity> villes;

    @OneToMany(mappedBy = "koperative", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClasseEntity> classes;

    @Override
    protected void onCreate() {
        super.onCreate();
        if (status == null) {
            status = KoperativeStatusEnum.ACTIVE;
        }
    }
}
