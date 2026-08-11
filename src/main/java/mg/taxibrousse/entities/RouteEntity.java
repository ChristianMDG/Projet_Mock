package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Table(name = "Route")
@Entity(name = "Route")
@NoArgsConstructor
public class RouteEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_gare_id")
    private GareEntity departureGare;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_gare_id")
    private GareEntity arrivalGare;

    @Column(precision = 5, scale = 2)
    private BigDecimal estimatedDurationHours;

    @Column(precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(precision = 10, scale = 2)
    private BigDecimal fraisTaxibrousse;

    @Column(precision = 10, scale = 2)
    private BigDecimal fraisKoperative;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "route", fetch = FetchType.LAZY)
    private List<RouteStopEntity> routeStops;

    @OneToMany(mappedBy = "route", fetch = FetchType.LAZY)
    private List<VoyageEntity> voyages;
}
