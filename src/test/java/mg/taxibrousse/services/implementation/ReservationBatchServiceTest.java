package mg.taxibrousse.services.implementation;

import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.models.Classe;
import mg.taxibrousse.models.Crafter;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.services.IReservationService;
import mg.taxibrousse.services.ISeatService;
import mg.taxibrousse.services.IVoyageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ReservationBatchServiceTest {

    @Mock
    private IVoyageService voyageService;

    @Mock
    private IReservationService reservationService;

    @Mock
    private ISeatService seatService;

    @InjectMocks
    private ReservationBatchService batchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Demand modifier should increase on peak days (Friday, Sunday)")
    void shouldIncreaseDemandModifierOnPeakDays() {
        // Friday departure at noon, standard class
        Voyage fridayVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 28, 12, 0)) // 2026-08-28 is Friday
                .classe(Classe.builder().name("Standard").build())
                .build();

        // Wednesday departure at noon, standard class
        Voyage wednesdayVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 26, 12, 0)) // 2026-08-26 is Wednesday
                .classe(Classe.builder().name("Standard").build())
                .build();

        double fridayModifier = batchService.computeVoyageDemandModifier(fridayVoyage);
        double wednesdayModifier = batchService.computeVoyageDemandModifier(wednesdayVoyage);

        assertThat(fridayModifier).isGreaterThan(wednesdayModifier);
        assertThat(fridayModifier - wednesdayModifier).isCloseTo(0.10, org.assertj.core.data.Offset.offset(0.001));
    }

    @Test
    @DisplayName("Demand modifier should increase during peak morning/evening hours")
    void shouldIncreaseDemandModifierDuringPeakHours() {
        // Wednesday at 06:00 (morning peak)
        Voyage morningVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 26, 6, 0))
                .classe(Classe.builder().name("Standard").build())
                .build();

        // Wednesday at 12:00 (mid-day lull)
        Voyage middayVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 26, 12, 0))
                .classe(Classe.builder().name("Standard").build())
                .build();

        double morningModifier = batchService.computeVoyageDemandModifier(morningVoyage);
        double middayModifier = batchService.computeVoyageDemandModifier(middayVoyage);

        assertThat(morningModifier).isGreaterThan(middayModifier);
        assertThat(morningModifier).isEqualTo(0.06);
        assertThat(middayModifier).isEqualTo(-0.04);
    }

    @Test
    @DisplayName("Demand modifier should increase for VIP / Premium classes")
    void shouldIncreaseDemandModifierForVipClass() {
        Voyage vipVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 26, 12, 0))
                .classe(Classe.builder().name("VIP").build())
                .build();

        Voyage standardVoyage = Voyage.builder()
                .departureTime(LocalDateTime.of(2026, 8, 26, 12, 0))
                .classe(Classe.builder().name("Standard").build())
                .build();

        double vipModifier = batchService.computeVoyageDemandModifier(vipVoyage);
        double standardModifier = batchService.computeVoyageDemandModifier(standardVoyage);

        assertThat(vipModifier).isGreaterThan(standardModifier);
        assertThat(vipModifier - standardModifier).isCloseTo(0.08, org.assertj.core.data.Offset.offset(0.001));
    }

    @Test
    @DisplayName("Voyage dispersion should be deterministic per voyage ID and bounded in [-0.08, +0.08]")
    void shouldProduceDeterministicDispersionByVoyageId() {
        Voyage voyage1 = Voyage.builder().id(101L).build();
        Voyage voyage2 = Voyage.builder().id(102L).build();

        double dispersion1FirstCall = batchService.computeVoyageDispersion(voyage1);
        double dispersion1SecondCall = batchService.computeVoyageDispersion(voyage1);
        double dispersion2 = batchService.computeVoyageDispersion(voyage2);

        // Deterministic check
        assertThat(dispersion1FirstCall).isEqualTo(dispersion1SecondCall);

        // Bounded check
        assertThat(dispersion1FirstCall).isBetween(-0.08, 0.08);
        assertThat(dispersion2).isBetween(-0.08, 0.08);
    }

    @Test
    @DisplayName("Target occupancy should vary across different voyages on the same departure day")
    void shouldVaryTargetOccupancyAcrossDifferentVoyagesOnSameDay() {
        int seatCapacity = 18;
        int daysUntilDeparture = 2;

        Voyage earlyVipFriday = Voyage.builder()
                .id(1L)
                .departureTime(LocalDateTime.of(2026, 8, 28, 6, 30))
                .classe(Classe.builder().name("VIP").build())
                .crafter(Crafter.builder().seatCapacity(18).build())
                .build();

        Voyage middayStandardWednesday = Voyage.builder()
                .id(2L)
                .departureTime(LocalDateTime.of(2026, 8, 26, 12, 30))
                .classe(Classe.builder().name("Standard").build())
                .crafter(Crafter.builder().seatCapacity(18).build())
                .build();

        int targetEarlyVip = batchService.calculateTargetOccupancy(earlyVipFriday, daysUntilDeparture, seatCapacity);
        int targetMiddayStandard = batchService.calculateTargetOccupancy(middayStandardWednesday, daysUntilDeparture, seatCapacity);

        assertThat(targetEarlyVip).isGreaterThan(targetMiddayStandard);
        assertThat(targetEarlyVip).isLessThanOrEqualTo(seatCapacity);
        assertThat(targetMiddayStandard).isGreaterThanOrEqualTo(0);
    }

    @Test
    @DisplayName("Target occupancy must stay bounded in [0, seatCapacity] for any input")
    void shouldStayWithinCapacityBounds() {
        int seatCapacity = 18;
        Voyage voyage = Voyage.builder()
                .id(50L)
                .departureTime(LocalDateTime.of(2026, 8, 28, 7, 0))
                .classe(Classe.builder().name("VIP").build())
                .build();

        for (int day = 0; day <= 10; day++) {
            for (int repetition = 0; repetition < 20; repetition++) {
                int target = batchService.calculateTargetOccupancy(voyage, day, seatCapacity);
                assertThat(target)
                        .isGreaterThanOrEqualTo(0)
                        .isLessThanOrEqualTo(seatCapacity);
            }
        }
    }

    @Test
    @DisplayName("executeBatch should reserve missing seats when current occupancy is below target")
    void shouldReserveSeatsWhenCurrentOccupiedIsLessThanTarget() {
        LocalDate today = LocalDate.now();
        LocalDate maxDate = today.plusDays(7);

        Voyage voyage = Voyage.builder()
                .id(10L)
                .departureTime(today.plusDays(1).atTime(6, 30))
                .classe(Classe.builder().id(1L).name("VIP").build())
                .crafter(Crafter.builder().id(2L).seatCapacity(18).configName("18places.json").build())
                .build();

        when(voyageService.findVoyagesByDateRange(today, maxDate)).thenReturn(List.of(voyage));
        // Currently 2 occupied seats
        List<Seat> existingSeats = new ArrayList<>();
        existingSeats.add(Seat.builder().seatNum("3").build());
        existingSeats.add(Seat.builder().seatNum("4").build());
        when(seatService.findByVoyageId(10L)).thenReturn(existingSeats);

        Reservation mockReservation = Reservation.builder().id(100L).build();
        when(reservationService.confirmReservationWithoutVoyageur(any(ReservationWithoutVoyageurRequest.class)))
                .thenReturn(mockReservation);

        batchService.executeBatch();

        verify(reservationService, times(1)).confirmReservationWithoutVoyageur(any(ReservationWithoutVoyageurRequest.class));
    }

    @Test
    @DisplayName("executeBatch should skip voyage when already at or above target occupancy")
    void shouldSkipReservationWhenAlreadyFullyOccupied() {
        LocalDate today = LocalDate.now();
        LocalDate maxDate = today.plusDays(7);

        Voyage voyage = Voyage.builder()
                .id(20L)
                .departureTime(today.plusDays(6).atTime(12, 0)) // 6 days ahead = low target occupancy
                .classe(Classe.builder().id(1L).name("Standard").build())
                .crafter(Crafter.builder().id(2L).seatCapacity(18).configName("18places.json").build())
                .build();

        when(voyageService.findVoyagesByDateRange(today, maxDate)).thenReturn(List.of(voyage));

        // 16 existing occupied seats out of 18
        List<Seat> existingSeats = new ArrayList<>();
        for (int i = 3; i <= 18; i++) {
            existingSeats.add(Seat.builder().seatNum(String.valueOf(i)).build());
        }
        when(seatService.findByVoyageId(20L)).thenReturn(existingSeats);

        batchService.executeBatch();

        verify(reservationService, never()).confirmReservationWithoutVoyageur(any(ReservationWithoutVoyageurRequest.class));
    }

    @Test
    @DisplayName("pauseBatch and playBatch should control batch execution")
    void shouldPauseAndResumeBatch() {
        assertThat(batchService.isBatchEnabled()).isTrue();

        batchService.pauseBatch();
        assertThat(batchService.isBatchEnabled()).isFalse();

        // Run scheduled daily batch while paused -> should do nothing
        LocalDate today = LocalDate.now();
        LocalDate maxDate = today.plusDays(7);
        batchService.runDailyBatch();
        verify(voyageService, never()).findVoyagesByDateRange(today, maxDate);

        // Resume batch
        batchService.playBatch();
        assertThat(batchService.isBatchEnabled()).isTrue();
    }
}
