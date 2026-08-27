package mg.taxibrousse.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.models.Reservation;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class DashboardStatsResponse {

    // Reservation stats
    private long totalReservations;
    private long confirmedCount;
    private long pendingCount;
    private long cancelledCount;
    private long completedCount;
    private long noShowCount;
    private BigDecimal totalRevenue;
    private List<Reservation> recentReservations;

    // Voyage stats
    private long totalVoyages;
    private long scheduledVoyages;
    private long ongoingVoyages;
    private long completedVoyages;
    private long cancelledVoyages;

    // Koperative stats
    private long totalKoperatives;
    private long activeKoperatives;

    // User statistics
    private Integer connectedWebSocketUsers;

    // Status distributions for charts
    private Map<String, Long> reservationStatusDistribution;
    private Map<String, Long> voyageStatusDistribution;

    // Top routes
    private List<RouteStats> routeStats;

    @Getter
    @Setter
    @Builder
    public static class RouteStats {

        private String name;
        private long count;
        private BigDecimal revenue;
    }
}
