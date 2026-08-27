package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.messaging.CreateChatRoomRequest;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.models.ChatRoom;
import mg.taxibrousse.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public interface IChatController {

    @PostMapping("/rooms")
    ResponseEntity<ChatRoom> createRoom(@RequestBody CreateChatRoomRequest request);

    @GetMapping("/rooms")
    ResponseEntity<List<ChatRoom>> getUserRooms();

    @GetMapping("/rooms/{roomId}")
    ResponseEntity<ChatRoom> getRoomDetails(@PathVariable String roomId);

    @PostMapping("/rooms/{roomId}/join")
    ResponseEntity<Void> joinRoom(@PathVariable String roomId);

    @PostMapping("/rooms/{roomId}/leave")
    ResponseEntity<Void> leaveRoom(@PathVariable String roomId);

    @PostMapping("/rooms/{roomId}/messages")
    ResponseEntity<Message> sendMessage(@PathVariable String roomId, @RequestBody SendMessageRequest request);

    @GetMapping("/rooms/{roomId}/messages")
    ResponseEntity<Page<Message>> getMessages(@PathVariable String roomId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size);

    @PostMapping("/rooms/{roomId}/read")
    ResponseEntity<Void> markRoomAsRead(@PathVariable String roomId);

    @PostMapping("/messages/{messageId}/read")
    ResponseEntity<Void> markMessageAsRead(@PathVariable String messageId);

    @GetMapping("/rooms/{roomId}/unread-count")
    ResponseEntity<Long> getUnreadCount(@PathVariable String roomId);

    @GetMapping("/support")
    ResponseEntity<ChatRoom> getOrCreateSupportRoom();
}
