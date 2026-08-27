package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "InventoryLog")
@Table(name = "inventory_log", indexes = {@Index(name = "idx_inventory_log_inventory", columnList = "inventory_id"), @Index(name = "idx_inventory_log_created", columnList = "createdAt"),
        @Index(name = "inventory_log_documents_idx", columnList = "documentId, locale, publishedAt")})
public class InventoryLogEntity extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inventory_id", nullable = false)
    private InventoryEntity inventory;

    @Column(nullable = false)
    private Integer delta;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "user_id")
    private Long userId;
}
