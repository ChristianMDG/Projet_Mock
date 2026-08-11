package mg.taxibrousse.dto.messaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ChatRoomType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateChatRoomRequest {
    private ChatRoomType type;
    private String title;
    private String[] participantIds;
    private String metadata;
}