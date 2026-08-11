package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.entities.enums.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IMessageRepository extends JpaRepository<MessageEntity, Long> {

    Optional<MessageEntity> findByMessageId(String messageId);

    Page<MessageEntity> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);

    Page<MessageEntity> findByRoomIdOrderByCreatedAtAsc(String roomId, Pageable pageable);

    List<MessageEntity> findByRoomIdAndCreatedAtAfterOrderByCreatedAtAsc(String roomId, LocalDateTime since);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.roomId = :roomId AND m.isRead = false AND m.senderId != :excludeSenderId")
    Long countUnreadMessagesInRoom(@Param("roomId") String roomId, @Param("excludeSenderId") String excludeSenderId);

    @Query("SELECT m FROM Message m WHERE m.roomId = :roomId AND m.isRead = false AND m.senderId != :excludeSenderId")
    List<MessageEntity> findUnreadMessagesInRoom(@Param("roomId") String roomId, @Param("excludeSenderId") String excludeSenderId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = :readAt WHERE m.roomId = :roomId AND m.senderId != :readerId AND m.isRead = false")
    int markRoomMessagesAsRead(@Param("roomId") String roomId, @Param("readerId") String readerId, @Param("readAt") LocalDateTime readAt);

    @Query("SELECT m FROM Message m WHERE m.roomId = :roomId ORDER BY m.createdAt DESC LIMIT 1")
    Optional<MessageEntity> findLastMessageInRoom(@Param("roomId") String roomId);

    List<MessageEntity> findBySenderIdAndTypeOrderByCreatedAtDesc(String senderId, MessageType type);

    @Query("SELECT m FROM Message m WHERE m.roomId = :roomId AND m.createdAt BETWEEN :start AND :end ORDER BY m.createdAt ASC")
    List<MessageEntity> findMessagesInTimeRange(@Param("roomId") String roomId, 
                                               @Param("start") LocalDateTime start, 
                                               @Param("end") LocalDateTime end);
}