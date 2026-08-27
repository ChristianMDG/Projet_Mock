package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ChatRoomEntity;
import mg.taxibrousse.entities.enums.ChatRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {

    Optional<ChatRoomEntity> findByRoomId(String roomId);

    List<ChatRoomEntity> findByTypeAndIsActiveTrue(ChatRoomType type);

    @Query(value = "SELECT * FROM chat_rooms WHERE participants::jsonb @> ('\"' || :userId || '\"')::jsonb AND is_active = true", nativeQuery = true)
    List<ChatRoomEntity> findActiveRoomsForUser(@Param("userId") String userId);

    @Query(value = "SELECT COUNT(*) > 0 FROM chat_rooms WHERE participants::jsonb @> ('\"' || :userId || '\"')::jsonb AND room_id = :roomId", nativeQuery = true)
    boolean isUserInRoom(@Param("userId") String userId, @Param("roomId") String roomId);

    @Query("SELECT c FROM ChatRoomEntity c WHERE c.isActive = true AND c.lastMessage <> 'chat_support_welcome_message' ORDER BY c.updatedAt DESC")
    List<ChatRoomEntity> findAllActiveRoomsOrderByLastActivity();
}
