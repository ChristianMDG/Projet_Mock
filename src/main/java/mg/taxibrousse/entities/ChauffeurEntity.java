package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Table(name = "Chauffeur")
@Entity(name = "Chauffeur")
@NoArgsConstructor
public class ChauffeurEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private ChauffeurInfoEntity user;

    @Column(nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Column(length = 100)
    private String licenseAuthority;

    @Column
    private LocalDate licenseExpiry;

    @Column
    private Integer experienceYears;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity photo;

    @ManyToOne(fetch = FetchType.LAZY)
    private KoperativeEntity koperative;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chauffeur")
    private List<CrafterEntity> crafterAssigned;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chauffeur")
    private List<MotoEntity> motos;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chauffeur", cascade = CascadeType.REMOVE)
    private List<ContratEntity> contrats;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "chauffeur")
    private List<VoyageEntity> voyages;

    public String getFullName() {
        return user == null ? "" : "%s %s".formatted(user.getFirstName(), user.getLastName());
    }
}
