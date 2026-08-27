package mg.taxibrousse.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Aggregated read-only view of a voyageur's loyalty status, suitable for the
 * account / dashboard tile. Combines the persisted account balance with the
 * current loyalty config to expose derived values (available km, free voyage
 * count, progress to next free voyage).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyView {

    private Long voyageurId;

    private BigDecimal kmEarned;
    private BigDecimal kmRedeemed;
    private BigDecimal kmAvailable;

    private BigDecimal kmPerFreeVoyage;
    private BigDecimal earnMultiplier;
    private Boolean programActive;

    private Integer freeVoyagesAvailable;
    private BigDecimal kmToNextFreeVoyage;

    /**
     * Progress towards the next free voyage, expressed as a value between 0
     * and 1 (0 = just claimed, 1 = ready to redeem).
     */
    private BigDecimal progressToNextFreeVoyage;
}
