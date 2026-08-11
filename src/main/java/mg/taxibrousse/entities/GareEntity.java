package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Table(name = "Gare")
@Entity(name = "Gare")
@NoArgsConstructor
public class GareEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 150)
    private String address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private VilleEntity ville;

    @Column(length = 150)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    private CloudinaryEntity photo;

    @Column(nullable = false)
    private Boolean isClosed = false;

    @Column(columnDefinition = "int default 0")
    private Integer frequence = 0;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "gare")
    private List<GuichetEntity> guichets;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "gare_cloudinary", joinColumns = @JoinColumn(name = "gare_id"), inverseJoinColumns = @JoinColumn(name = "cloudinary_id"))
    private List<CloudinaryEntity> photos;
}
