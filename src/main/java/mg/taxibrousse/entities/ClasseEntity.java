package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Set;

@Getter
@Setter
@Table(name = "Classe")
@Entity(name = "Classe")
@NoArgsConstructor
public class ClasseEntity extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String name;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private CloudinaryEntity icon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "koperative_id")
    private KoperativeEntity koperative;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "classe")
    private Set<ReservationEntity> reservations;
}
