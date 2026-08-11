package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.PartenaireTypeEnum;

import java.util.List;

@Getter
@Setter
@Table(name = "Partenaire")
@Entity(name = "Partenaire")
@NoArgsConstructor
public class PartenaireEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartenaireTypeEnum type;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity logo;

    @Column(length = 100)
    private String email;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "partenaire", fetch = FetchType.LAZY)
    private List<ContratEntity> contrats;
}
