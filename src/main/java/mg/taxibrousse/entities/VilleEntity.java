package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity(name = "Ville")
@Table(name = "Ville", indexes = {@Index(name = "ville_created_by_id_fk", columnList = "created_by_id"), @Index(name = "ville_updated_by_id_fk", columnList = "updated_by_id"),
        @Index(name = "ville_documents_idx", columnList = "document_id, locale, published_at")})
@NoArgsConstructor
public class VilleEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String province;

    @Column(length = 8)
    private String code;

    @Column
    private Boolean isActive = true;

    @Column(length = 8)
    private String rn;

    @Column(columnDefinition = "int default 0")
    private Integer frequence = 0;

    @Column(columnDefinition = "text")
    private String keywords;

    @Column(name = "detail_id")
    private Long detailId;

    @OneToMany(mappedBy = "ville")
    private List<FokotanyEntity> fokotanies;
}
