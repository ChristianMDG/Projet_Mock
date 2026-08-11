package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ContratStatusEnum;
import mg.taxibrousse.entities.enums.ContratTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Table(name = "Contrat")
@Entity(name = "Contrat")
@NoArgsConstructor
public class ContratEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private PartenaireEntity partenaire;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChauffeurEntity chauffeur;

    @ManyToOne(fetch = FetchType.LAZY)
    private KoperativeEntity koperative;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContratTypeEnum type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String terms;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal contractValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContratStatusEnum status = ContratStatusEnum.DRAFT;
}
