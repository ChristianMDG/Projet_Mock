package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IChatController;
import mg.taxibrousse.dto.messaging.CreateChatRoomRequest;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
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
public class ChatController implements IChatController {

    private final IChatRoomService chatRoomService;
    private final IMessageService messageService;

    @Override
    public ResponseEntity<ChatRoom> createRoom(CreateChatRoomRequest request) {
        var chatRoom = chatRoomService.createRoom(request);
        chatRoom.setUnreadCount(0L);
        return ResponseEntity.ok(chatRoom);
    }

    @Override
    public ResponseEntity<List<ChatRoom>> getUserRooms() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(chatRoomService.getActiveRoomsForUser(auth.getName()));
    }

    @Override
    public ResponseEntity<ChatRoom> getRoomDetails(String roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return chatRoomService.findByRoomId(roomId).map(room -> withUnreadCount(room, auth.getName())).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> joinRoom(String roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();

        if (chatRoomService.isUserInRoom(roomId, userId)) {
            return ResponseEntity.ok().build();
        }

        chatRoomService.joinRoom(roomId, userId);
        messageService.broadcastUserJoined(roomId, userId, userId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> leaveRoom(String roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();

        if (chatRoomService.isUserInRoom(roomId, userId)) {
            chatRoomService.leaveRoom(roomId, userId);
            messageService.broadcastUserLeft(roomId, userId, userId);
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Message> sendMessage(String roomId, SendMessageRequest request) {
        if (chatRoomService.hasRoomAccess(roomId)) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            request.setRoomId(roomId);
            var message = messageService.sendMessage(request, auth.getName(), auth.getName());
            return ResponseEntity.ok(Message.fromEntity(message));
        }
        return ResponseEntity.status(403).build();
    }

    @Override
    public ResponseEntity<Page<Message>> getMessages(String roomId, int page, int size) {
        if (chatRoomService.hasRoomAccess(roomId)) {
            return ResponseEntity.ok(messageService.getMessagesInRoom(roomId, page, size));
        }
        return ResponseEntity.status(403).build();
    }

    @Override
    public ResponseEntity<Void> markRoomAsRead(String roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();

        if (chatRoomService.isUserInRoom(roomId, userId)) {
            messageService.markRoomAsRead(roomId, userId);
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> markMessageAsRead(String messageId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        messageService.markMessageAsRead(messageId, auth.getName());
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Long> getUnreadCount(String roomId) {
        if (chatRoomService.hasRoomAccess(roomId)) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok(messageService.getUnreadCount(roomId, auth.getName()));
        }
        return ResponseEntity.status(403).build();
    }

    @Override
    public ResponseEntity<ChatRoom> getOrCreateSupportRoom() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        var supportRoom = chatRoomService.getOrCreateCustomerSupportRoom(userId);
        return ResponseEntity.ok(withUnreadCount(supportRoom, userId));
    }

    private ChatRoom withUnreadCount(ChatRoom chatRoom, String userId) {
        try {
            chatRoom.setUnreadCount(messageService.getUnreadCount(chatRoom.getRoomId(), userId));
        } catch (Exception e) {
            chatRoom.setUnreadCount(0L);
        }
        return chatRoom;
    }
}
