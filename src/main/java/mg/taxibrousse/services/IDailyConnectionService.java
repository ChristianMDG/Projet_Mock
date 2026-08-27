package mg.taxibrousse.services;

import mg.taxibrousse.models.DailyConnectionStats;

import java.util.List;

public interface IDailyConnectionService {

    void recordConnection(String senderId, String username, boolean isGuichet);

    List<DailyConnectionStats> getConnectionTrend(int days);
}
