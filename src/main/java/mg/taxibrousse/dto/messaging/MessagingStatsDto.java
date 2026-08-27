package mg.taxibrousse.dto.messaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessagingStatsDto {

    private Long totalActiveRooms;
    private Long totalMessages;
    private Long unreadMessages;
    private Long activeUsers;
    private Long supportTickets;
}
