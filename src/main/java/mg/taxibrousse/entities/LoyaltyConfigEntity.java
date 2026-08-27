package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Singleton configuration for the loyalty program.
 * Values are tunable from the admin dashboard. Only one row is expected.
 */
@Getter
@Setter
@Table(name = "LoyaltyConfig")
@Entity(name = "LoyaltyConfig")
@NoArgsConstructor
public class LoyaltyConfigEntity extends BaseEntity {

    /**
     * Number of kilometres required to earn one free voyage reward.
     * Default: 10000 km.
     */
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal kmPerFreeVoyage = new BigDecimal("10000");

    /**
     * Multiplier applied to the route distance when crediting a completed
     * reservation (e.g. 1.0 = 1 km earned per km travelled, 2.0 = double).
     */
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal earnMultiplier = BigDecimal.ONE;

    /**
     * Whether the loyalty program is active.
     */
    @Column(nullable = false)
    private Boolean isActive = true;
}
