package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Table(name = "Cloudinary")
@Entity(name = "Cloudinary")
@NoArgsConstructor
public class CloudinaryEntity extends BaseEntity {

    @Column(nullable = true, unique = true)
    private String publicId;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 50)
    private String format;

    @Column(length = 50)
    private String resourceType;

    @Column
    private Long bytes;

    @Column
    private Integer width;

    @Column
    private Integer height;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserInfoEntity userinfo;

    @ManyToMany(mappedBy = "photos")
    private List<GareEntity> gares;
}
