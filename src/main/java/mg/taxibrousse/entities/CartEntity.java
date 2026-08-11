package mg.taxibrousse.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Table(name = "Cart")
@Entity(name = "Cart")
@NoArgsConstructor
public class CartEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    private UserAccountEntity userAccount;
}
