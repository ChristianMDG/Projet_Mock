package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.DashboardStatsResponse;
import mg.taxibrousse.dto.DashboardStatsResponse.RouteStats;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.repositories.IReservationRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.IDashboardService;
import mg.taxibrousse.services.IWebSocketSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService implements IDashboardService {

    private final IReservationRepository reservationRepository;
    private final IVoyageRepository voyageRepository;
    private final IKoperativeRepository koperativeRepository;
    private final IWebSocketSessionService webSocketSessionService;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        Map<String, Long> reservationDistribution = buildReservationStatusDistribution();
        Map<String, Long> voyageDistribution = buildVoyageStatusDistribution();

        return DashboardStatsResponse.builder()
                // Reservation stats
                .totalReservations(reservationRepository.count())
                .confirmedCount(countConfirmedPaidReservations())
                .pendingCount(reservationRepository.countPendingReservations())
                .completedCount(getCount(reservationDistribution, ReservationStatusEnum.COMPLETED))
                .cancelledCount(countCancelledReservations(reservationDistribution))
                .noShowCount(getCount(reservationDistribution, ReservationStatusEnum.NO_SHOW))
                .totalRevenue(reservationRepository.sumTotalAmount())
                .recentReservations(findRecentReservations())
                // Voyage stats
                .totalVoyages(voyageRepository.countNonTemplateVoyages())
                .scheduledVoyages(getCount(voyageDistribution, VoyageStatusEnum.SCHEDULED))
                .ongoingVoyages(getCount(voyageDistribution, VoyageStatusEnum.ONGOING))
                .completedVoyages(getCount(voyageDistribution, VoyageStatusEnum.COMPLETED))
                .cancelledVoyages(getCount(voyageDistribution, VoyageStatusEnum.CANCELLED))
                // Koperative stats
                .totalKoperatives(koperativeRepository.count())
                .activeKoperatives(countActiveKoperatives())
                // Chart data
                .reservationStatusDistribution(reservationDistribution)
                .voyageStatusDistribution(voyageDistribution)
                .routeStats(findTopRoutes())
                // Live stats
                .connectedWebSocketUsers(webSocketSessionService.getActiveUserCount())
                .build();
    }

    // -------------------------------------------------------------------------
    // Reservation helpers
    // -------------------------------------------------------------------------

    /**
     * Builds the reservation status distribution for the chart.
     * <p>
     * CONFIRMED is overridden with the paid-only count, and PENDING_PAYMENT is
     * overridden with the extended pending count (which includes CONFIRMED
     * reservations whose payment is still pending). This mirrors the business
     * intent displayed in the dashboard pie chart.
     */
    private Map<String, Long> buildReservationStatusDistribution() {
        long confirmedPaidCount = countConfirmedPaidReservations();
        long pendingCount = reservationRepository.countPendingReservations();

        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Object[] row : reservationRepository.countReservationsByStatusDistribution()) {
            ReservationStatusEnum status = (ReservationStatusEnum) row[0];
            long chartCount = resolveReservationChartCount(status, row, confirmedPaidCount, pendingCount);
            if (chartCount > 0) {
                distribution.put(status.name(), chartCount);
            }
        }

        // PENDING_PAYMENT may be absent from the GROUP BY when all pending
        // reservations are stored with status=CONFIRMED (payment not yet received).
        if (pendingCount > 0) {
            distribution.put(ReservationStatusEnum.PENDING_PAYMENT.name(), pendingCount);
        }

        return distribution;
    }

    /**
     * Returns the chart count for a given reservation status, applying business
     * overrides for CONFIRMED and PENDING_PAYMENT.
     */
    private long resolveReservationChartCount(ReservationStatusEnum status, Object[] groupByRow, long confirmedPaidCount, long pendingCount) {
        return switch (status) {
            case CONFIRMED -> confirmedPaidCount;
            case PENDING_PAYMENT -> pendingCount;
            default -> ((Number) groupByRow[1]).longValue();
        };
    }

    private long countConfirmedPaidReservations() {
        return reservationRepository.countByStatusAndFacturationPaymentStatusIn(ReservationStatusEnum.CONFIRMED, List.of(PaymentStatusEnum.PAID, PaymentStatusEnum.PARTIALLY_PAID));
    }

    private long countCancelledReservations(Map<String, Long> distribution) {
        return getCount(distribution, ReservationStatusEnum.CANCELLED_BY_USER) + getCount(distribution, ReservationStatusEnum.CANCELLED_BY_OPERATOR);
    }

    private List<Reservation> findRecentReservations() {
        List<ReservationEntity> entities = reservationRepository.findTop5ByOrderByBookingDateDesc();
        return entities.stream().map(Reservation::fromEntity).toList();
    }

    // -------------------------------------------------------------------------
    // Voyage helpers
    // -------------------------------------------------------------------------

    private Map<String, Long> buildVoyageStatusDistribution() {
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Object[] row : voyageRepository.countVoyagesByStatusDistribution()) {
            VoyageStatusEnum status = (VoyageStatusEnum) row[0];
            long count = ((Number) row[1]).longValue();
            if (count > 0) {
                distribution.put(status.name(), count);
            }
        }
        return distribution;
    }

    // -------------------------------------------------------------------------
    // Koperative helpers
    // -------------------------------------------------------------------------

    private long countActiveKoperatives() {
        return koperativeRepository.countByStatus(KoperativeStatusEnum.ACTIVE) + koperativeRepository.countByStatus(KoperativeStatusEnum.CONFIRMED);
    }

    // -------------------------------------------------------------------------
    // Route helpers
    // -------------------------------------------------------------------------

    private List<RouteStats> findTopRoutes() {
        return reservationRepository.findTopRoutesByReservationCount().stream().map(this::toRouteStats).toList();
    }

    private RouteStats toRouteStats(Object[] row) {
        return RouteStats.builder().name((String) row[0]).count(((Number) row[1]).longValue()).revenue(new BigDecimal(row[2].toString())).build();
    }

    // -------------------------------------------------------------------------
    // Generic helpers
    // -------------------------------------------------------------------------

    private long getCount(Map<String, Long> distribution, Enum<?> status) {
        return distribution.getOrDefault(status.name(), 0L);
    }
}
