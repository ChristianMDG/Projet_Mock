package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "DeliveryZone")
@Table(name = "shop_delivery_zone", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_delivery_zone_name", columnNames = "name")}, indexes = {
        @Index(name = "idx_shop_delivery_zone_active", columnList = "is_active"), @Index(name = "shop_delivery_zone_documents_idx", columnList = "documentId, locale, publishedAt")})
public class DeliveryZoneEntity extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shop_delivery_zone_ville", joinColumns = @JoinColumn(name = "zone_id"), inverseJoinColumns = @JoinColumn(name = "ville_id"))
    private Set<VilleEntity> villes = new HashSet<>();

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shop_delivery_zone_fokotany", joinColumns = @JoinColumn(name = "zone_id"), inverseJoinColumns = @JoinColumn(name = "fokotany_id"))
    private Set<FokotanyEntity> fokotanys = new HashSet<>();
}
