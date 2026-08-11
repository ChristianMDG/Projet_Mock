package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.DashboardStatsResponse;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;
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
import java.util.Comparator;
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
        // --- Reservation stats ---
        long totalReservations = reservationRepository.count();
        long confirmedCount = reservationRepository.countByStatus(ReservationStatusEnum.CONFIRMED);
        long pendingCount = reservationRepository.countByStatus(ReservationStatusEnum.PENDING_PAYMENT);
        long completedCount = reservationRepository.countByStatus(ReservationStatusEnum.COMPLETED);
        long cancelledCount = reservationRepository.countByStatus(ReservationStatusEnum.CANCELLED_BY_USER)
                + reservationRepository.countByStatus(ReservationStatusEnum.CANCELLED_BY_OPERATOR);
        long noShowCount = reservationRepository.countByStatus(ReservationStatusEnum.NO_SHOW);
        BigDecimal totalRevenue = reservationRepository.sumTotalAmount();

        // Reservation status distribution
        Map<String, Long> reservationStatusDistribution = new LinkedHashMap<>();
        for (ReservationStatusEnum status : ReservationStatusEnum.values()) {
            long count = reservationRepository.countByStatus(status);
            if (count > 0) {
                reservationStatusDistribution.put(status.name(), count);
            }
        }

        // Recent reservations
        List<ReservationEntity> recentEntities = reservationRepository.findTop5ByOrderByBookingDateDesc();
        List<Reservation> recentReservations = recentEntities.stream()
                .map(Reservation::fromEntity)
                .toList();

        // --- Voyage stats ---
        long totalVoyages = voyageRepository.countNonTemplateVoyages();
        long scheduledVoyages = voyageRepository.countByStatus(VoyageStatusEnum.SCHEDULED);
        long ongoingVoyages = voyageRepository.countByStatus(VoyageStatusEnum.ONGOING);
        long completedVoyages = voyageRepository.countByStatus(VoyageStatusEnum.COMPLETED);
        long cancelledVoyages = voyageRepository.countByStatus(VoyageStatusEnum.CANCELLED);

        Map<String, Long> voyageStatusDistribution = new LinkedHashMap<>();
        for (VoyageStatusEnum status : VoyageStatusEnum.values()) {
            long count = voyageRepository.countByStatus(status);
            if (count > 0) {
                voyageStatusDistribution.put(status.name(), count);
            }
        }

        // --- Koperative stats ---
        long totalKoperatives = koperativeRepository.count();
        long activeKoperatives = koperativeRepository.countByStatus(KoperativeStatusEnum.ACTIVE) + koperativeRepository.countByStatus(KoperativeStatusEnum.CONFIRMED);

        // --- Top routes from recent reservations ---
        List<ReservationEntity> allReservations = reservationRepository.findAll();
        Map<String, DashboardStatsResponse.RouteStats> routeMap = new LinkedHashMap<>();
        for (ReservationEntity r : allReservations) {
            if (r.getVoyage() != null
                    && r.getVoyage().getDepartureGare() != null
                    && r.getVoyage().getDepartureGare().getVille() != null
                    && r.getVoyage().getArrivalGare() != null
                    && r.getVoyage().getArrivalGare().getVille() != null) {
                String departureName = r.getVoyage().getDepartureGare().getVille().getName();
                String arrivalName = r.getVoyage().getArrivalGare().getVille().getName();
                String routeName = departureName + " → " + arrivalName;
                DashboardStatsResponse.RouteStats existing = routeMap.get(routeName);
                BigDecimal amount = r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO;
                if (existing == null) {
                    routeMap.put(routeName, DashboardStatsResponse.RouteStats.builder()
                            .name(routeName)
                            .count(1)
                            .revenue(amount)
                            .build());
                } else {
                    existing.setCount(existing.getCount() + 1);
                    existing.setRevenue(existing.getRevenue().add(amount));
                }
            }
        }

        List<DashboardStatsResponse.RouteStats> routeStats = routeMap.values().stream()
                .sorted(Comparator.comparingLong(DashboardStatsResponse.RouteStats::getCount).reversed())
                .limit(8)
                .toList();

        return DashboardStatsResponse.builder()
                .totalReservations(totalReservations)
                .confirmedCount(confirmedCount)
                .pendingCount(pendingCount)
                .completedCount(completedCount)
                .cancelledCount(cancelledCount)
                .noShowCount(noShowCount)
                .totalRevenue(totalRevenue)
                .recentReservations(recentReservations)
                .totalVoyages(totalVoyages)
                .scheduledVoyages(scheduledVoyages)
                .ongoingVoyages(ongoingVoyages)
                .completedVoyages(completedVoyages)
                .cancelledVoyages(cancelledVoyages)
                .totalKoperatives(totalKoperatives)
                .activeKoperatives(activeKoperatives)
                .connectedWebSocketUsers(webSocketSessionService.getActiveUserCount())
                .reservationStatusDistribution(reservationStatusDistribution)
                .voyageStatusDistribution(voyageStatusDistribution)
                .routeStats(routeStats)
                .build();
    }
}
