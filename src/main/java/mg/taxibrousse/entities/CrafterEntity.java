package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Table(name = "Crafter")
@Entity(name = "Crafter")
@NoArgsConstructor
public class CrafterEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String registrationNumber;

    @Column(length = 100)
    private String model;

    @Column
    private Integer kilometrage;

    @Column(nullable = false)
    private Integer seatCapacity = 18;

    @Column(length = 25)
    private String configName = "18places.json";

    @Basic(fetch = FetchType.LAZY)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String seatConfig;

    @ManyToOne(fetch = FetchType.LAZY)
    private KoperativeEntity koperative;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChauffeurEntity chauffeur;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private LocalDate dateVisite;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity photo;

    @OneToMany(mappedBy = "crafter", fetch = FetchType.LAZY)
    private List<SeatEntity> seats;
}
