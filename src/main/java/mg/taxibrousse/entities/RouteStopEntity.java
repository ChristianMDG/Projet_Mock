package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "RouteStop")
@Entity(name = "RouteStop")
@NoArgsConstructor
public class RouteStopEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private RouteEntity route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VilleEntity ville;

    @ManyToOne(fetch = FetchType.LAZY)
    private GareEntity gare;

    @Column(nullable = false)
    private Integer stopOrder;

    @Column
    private LocalDateTime estimatedArrival;

    @Column
    private LocalDateTime estimatedDeparture;

    @Column(nullable = false)
    private Boolean isMandatory = true;
}
