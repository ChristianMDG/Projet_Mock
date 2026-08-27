package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IMessagingController;
import mg.taxibrousse.dto.messaging.MessagingStatsDto;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.entities.enums.ChatRoomType;
import mg.taxibrousse.models.ChatRoom;
import mg.taxibrousse.models.Message;
import mg.taxibrousse.services.IChatRoomService;
import mg.taxibrousse.services.IMessageService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MessagingController implements IMessagingController {

    private final IChatRoomService chatRoomService;
    private final IMessageService messageService;

    @Override
    public ResponseEntity<List<ChatRoom>> getAllRooms() {
        return ResponseEntity.ok(chatRoomService.getAllActiveRooms());
    }

    @Override
    public ResponseEntity<List<ChatRoom>> getRoomsByType(ChatRoomType type) {
        return ResponseEntity.ok(chatRoomService.findByType(type));
    }

    @Override
    public ResponseEntity<Page<Message>> getMessagesInRoom(String roomId, int page, int size) {
        return ResponseEntity.ok(messageService.getMessagesInRoom(roomId, page, size));
    }

    @Override
    public ResponseEntity<Message> sendMessage(String roomId, String message) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String senderId = auth.getName();
        String senderName = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority() + " - " + senderId).orElse(senderId);

        SendMessageRequest request = new SendMessageRequest();
        request.setRoomId(roomId);
        request.setContent(message);

        return ResponseEntity.ok(Message.fromEntity(messageService.sendMessage(request, senderId, senderName)));
    }

    @Override
    public ResponseEntity<Void> deactivateRoom(String roomId) {
        chatRoomService.deactivateRoom(roomId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteRoom(String roomId) {
        chatRoomService.deleteRoom(roomId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<MessagingStatsDto> getMessagingStats() {
        MessagingStatsDto stats = new MessagingStatsDto();
        stats.setTotalActiveRooms(chatRoomService.getTotalActiveRooms());
        stats.setSupportTickets((long) chatRoomService.findByType(ChatRoomType.CUSTOMER_SUPPORT).size());
        return ResponseEntity.ok(stats);
    }

    @Override
    public ResponseEntity<Void> takeOverConversation(String roomId) {
        SendMessageRequest systemMessage = new SendMessageRequest();
        systemMessage.setRoomId(roomId);
        systemMessage.setContent("A support agent has joined the conversation.");
        messageService.sendMessage(systemMessage, "system", "System");
        return ResponseEntity.ok().build();
    }
}
