package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "Hotel")
@Entity(name = "Hotel")
@NoArgsConstructor
public class HotelEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VilleEntity ville;

    @Column(length = 500)
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity photo;

    @Column(nullable = false)
    private Boolean isActive = true;
}
