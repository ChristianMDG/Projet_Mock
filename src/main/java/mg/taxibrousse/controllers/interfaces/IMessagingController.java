package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.messaging.MessagingStatsDto;
import mg.taxibrousse.entities.enums.ChatRoomType;
import mg.taxibrousse.models.ChatRoom;
import mg.taxibrousse.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messaging")
@PreAuthorize("hasAnyAuthority('ADMIN', 'GUICHET', 'KOPERATIVE')")
public interface IMessagingController {

    @GetMapping("/rooms")
    ResponseEntity<List<ChatRoom>> getAllRooms();

    @GetMapping("/rooms/type/{type}")
    ResponseEntity<List<ChatRoom>> getRoomsByType(@PathVariable ChatRoomType type);

    @GetMapping("/rooms/{roomId}/messages")
    ResponseEntity<Page<Message>> getMessagesInRoom(
        @PathVariable String roomId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size
    );

    @PostMapping("/rooms/{roomId}/messages")
    ResponseEntity<Message> sendMessage(
        @PathVariable String roomId,
        @RequestBody String message
    );

    @DeleteMapping("/rooms/{roomId}")
    ResponseEntity<Void> deactivateRoom(@PathVariable String roomId);

    @DeleteMapping("/rooms/{roomId}/delete")
    ResponseEntity<Void> deleteRoom(@PathVariable String roomId);

    @GetMapping("/stats")
    ResponseEntity<MessagingStatsDto> getMessagingStats();

    @PostMapping("/rooms/{roomId}/take-over")
    ResponseEntity<Void> takeOverConversation(@PathVariable String roomId);
}
