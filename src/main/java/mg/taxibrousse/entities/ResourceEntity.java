package mg.taxibrousse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Resource")
@Table(name = "resource", indexes = {
    @Index(name = "resource_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "resource_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "resource_documents_idx", columnList = "document_id, locale, published_at"),
    @Index(name = "resource_key_idx", columnList = "`key`")
})
public class ResourceEntity extends BaseEntity {

    @Column(name = "`key`", nullable = false)
    private String key;

    @Column(nullable = false)
    private String fr;

    @Column(nullable = false)
    private String en;

    @Column(nullable = false)
    private String mg;
}
