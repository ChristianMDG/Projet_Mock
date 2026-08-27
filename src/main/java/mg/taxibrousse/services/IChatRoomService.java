package mg.taxibrousse.services;

import mg.taxibrousse.dto.messaging.CreateChatRoomRequest;
import mg.taxibrousse.entities.enums.ChatRoomType;
import mg.taxibrousse.models.ChatRoom;

import java.util.List;
import java.util.Optional;

public interface IChatRoomService {

    ChatRoom createRoom(CreateChatRoomRequest request);

    Optional<ChatRoom> findByRoomId(String roomId);

    List<ChatRoom> getActiveRoomsForUser(String userId);

    List<ChatRoom> getAllActiveRooms();

    ChatRoom joinRoom(String roomId, String userId);

    void leaveRoom(String roomId, String userId);

    boolean isUserInRoom(String roomId, String userId);

    boolean hasRoomAccess(String roomId);

    void updateLastMessage(String roomId, String message, String sender);

    void deactivateRoom(String roomId);

    void deleteRoom(String roomId);

    ChatRoom getOrCreateCustomerSupportRoom(String userId);

    List<ChatRoom> findByType(ChatRoomType type);

    Long getTotalActiveRooms();
}
