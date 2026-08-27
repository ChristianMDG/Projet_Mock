package mg.taxibrousse.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.entities.enums.VoyageTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Table(name = "Voyage")
@Entity(name = "Voyage")
@NoArgsConstructor
public class VoyageEntity extends BaseEntity {

    public static final Double DEFAULT_POURCENTAGE_MINIMUM_AVANCE = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private KoperativeEntity koperative;

    @ManyToOne(fetch = FetchType.LAZY)
    private RouteEntity route;

    @ManyToOne(fetch = FetchType.LAZY)
    private GareEntity departureGare;

    @ManyToOne(fetch = FetchType.LAZY)
    private GareEntity arrivalGare;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Crafter is required")
    private CrafterEntity crafter;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Chauffeur is required")
    private ChauffeurEntity chauffeur;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column
    private LocalDateTime estimatedArrivalTime;

    @Column
    private LocalDateTime actualArrivalTime;

    @Column
    private Integer availableSeats;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Price per seat is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per seat must be positive")
    private BigDecimal pricePerSeat;

    @Column(name = "price_koperative", nullable = false, precision = 10, scale = 2, columnDefinition = "numeric(10,2) default 0")
    @NotNull(message = "Price koperative is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price koperative must be positive")
    private BigDecimal priceKoperative = BigDecimal.ZERO;

    @Column(name = "pourcentage_minimum_avance")
    @DecimalMin(value = "0.0", inclusive = true, message = "Pourcentage minimum d'avance must be greater than or equal to 0")
    @DecimalMax(value = "100.0", inclusive = true, message = "Pourcentage minimum d'avance must be less than or equal to 100")
    private Double pourcentageMinimumAvance = DEFAULT_POURCENTAGE_MINIMUM_AVANCE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoyageStatusEnum status = VoyageStatusEnum.SCHEDULED;

    @Enumerated(EnumType.STRING)
    @Column(name = "TypeVoyage")
    private VoyageTypeEnum typeVoyage = VoyageTypeEnum.NATIONAL;

    @Column(length = 1024)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Recurrence type is required")
    private RecurrenceTypeEnum recurrenceType = RecurrenceTypeEnum.ONE_OFF;

    @Column
    private Integer customInterval;

    @Column
    private String weekdays;

    @Column
    private String monthlyDates;

    @Column
    private LocalDate recurrenceStartDate;

    @Column
    private LocalDate recurrenceEndDate;

    @Column
    private Boolean isTemplate = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean fbScheduled = false;

    @ManyToOne(fetch = FetchType.LAZY)
    private VoyageEntity parentTemplate;

    @OneToMany(mappedBy = "parentTemplate", fetch = FetchType.LAZY)
    private List<VoyageEntity> generatedInstances;

    @OneToMany(mappedBy = "voyage", fetch = FetchType.LAZY)
    private List<ReservationEntity> reservations;

    @ManyToOne(fetch = FetchType.LAZY)
    private ClasseEntity classe;

    @Override
    protected void onCreate() {
        super.onCreate();
        if (status == null) {
            status = VoyageStatusEnum.SCHEDULED;
        }
    }

    public Integer getAvailableSeats() {
        return availableSeats == null ? 0 : availableSeats;
    }

    public Double getPourcentageMinimumAvance() {
        return Objects.requireNonNullElse(pourcentageMinimumAvance, DEFAULT_POURCENTAGE_MINIMUM_AVANCE);
    }
}
