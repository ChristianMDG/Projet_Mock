package mg.taxibrousse.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatistics {

    private long totalVoyageurs;
    private long activeVoyageurs;
    private long inactiveVoyageurs;
    private int connectedWebSocketUsers;
    private Set<String> connectedUsernames;
    private int connectedGuichetUsers;
    private Set<String> connectedGuichetUsernames;
    private long totalSessions;
}
