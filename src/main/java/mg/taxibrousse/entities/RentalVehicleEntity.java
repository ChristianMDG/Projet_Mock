package mg.taxibrousse.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rental_vehicles")
@Getter
@Setter
@NoArgsConstructor
public class RentalVehicleEntity extends BaseEntity {

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category; // e.g. "Voiture", "Utilitaire"

    @Column(nullable = false)
    private Integer seats;

    @Column(nullable = true)
    private Double volumeUtility; // For vans/trucks

    @Column(nullable = false)
    private Double pricePerDay;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(nullable = false)
    private String agencyLocation; // Location where it can be picked up

    @Column(length = 50)
    private String transmission;

    @Column(length = 50)
    private String fuel;
}
