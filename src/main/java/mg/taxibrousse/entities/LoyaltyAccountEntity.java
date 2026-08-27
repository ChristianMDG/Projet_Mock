package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "LoyaltyAccount")
@Entity(name = "LoyaltyAccount")
@NoArgsConstructor
public class LoyaltyAccountEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private Long voyageurId;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal kmEarned = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal kmRedeemed = BigDecimal.ZERO;
}
