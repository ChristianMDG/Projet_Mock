package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.entities.enums.ColisTypeEnum;

import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "Colis")
@Entity(name = "Colis")
@NoArgsConstructor
public class ColisEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String senderName;

    @Column(nullable = false, length = 20)
    private String senderPhone;

    @Column(nullable = false, length = 100)
    private String recipientName;

    @Column(nullable = false, length = 20)
    private String recipientPhone;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ColisTypeEnum type;

    @Column(length = 500)
    private String content;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedValue;

    @Column(precision = 10)
    private Double weight;

    @Column(precision = 10)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ColisStatusEnum status = ColisStatusEnum.REGISTERED;

    @ManyToOne(fetch = FetchType.LAZY)
    private CrafterEntity crafter;

    @ManyToOne(fetch = FetchType.LAZY)
    private ReservationEntity reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    private VoyageEntity voyage;
}
