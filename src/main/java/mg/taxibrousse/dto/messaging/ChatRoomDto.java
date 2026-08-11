package mg.taxibrousse.dto.messaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ChatRoomType;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private String roomId;
    private ChatRoomType type;
    private String participants;
    private Boolean isActive;
    private String title;
    private String lastMessage;
    private String lastMessageSender;
    private LocalDateTime lastActivity;
    private String metadata;
    private Long unreadCount;
}