package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Table(name = "Moto")
@Entity(name = "Moto")
@NoArgsConstructor
public class MotoEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String registrationNumber;

    @Column(length = 100)
    private String model;

    @Column
    private Integer yearManufactured;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChauffeurEntity chauffeur;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private LocalDate lastMaintenance;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity photo;
}
