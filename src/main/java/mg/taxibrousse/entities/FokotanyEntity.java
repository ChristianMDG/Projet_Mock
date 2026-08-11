package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "Fokotany")
@Table(name = "fokotany", indexes = {
    @Index(name = "fokotany_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "fokotany_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "fokotany_documents_idx", columnList = "document_id, locale, published_at"),
    @Index(name = "fokotany_ville_id_fk", columnList = "ville_id")
})
@NoArgsConstructor
public class FokotanyEntity extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String commune;

    @Column(nullable = false, length = 100)
    private String fokontany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VilleEntity ville;
}
