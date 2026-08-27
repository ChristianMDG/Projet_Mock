package mg.taxibrousse.dto.messaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.MessageType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    private String roomId;
    private String content;
    private MessageType type = MessageType.TEXT;
    private String metadata;
    private String replyToMessageId;
}
