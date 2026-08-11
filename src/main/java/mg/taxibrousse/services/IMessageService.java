package mg.taxibrousse.services;

import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.models.Message;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IMessageService {
    
    MessageEntity sendMessage(SendMessageRequest request, String senderId, String senderName);
    
    Optional<MessageEntity> findByMessageId(String messageId);
    
    Page<Message> getMessagesInRoom(String roomId, int page, int size);
    
    List<Message> getRecentMessages(String roomId, LocalDateTime since);
    
    Long getUnreadCount(String roomId, String userId);
    
    void markRoomAsRead(String roomId, String userId);
    
    void markMessageAsRead(String messageId, String userId);
    
    MessageEntity getLastMessageInRoom(String roomId);
    
    void broadcastMessage(MessageEntity message);
    
    void broadcastTypingIndicator(String roomId, String userId, boolean isTyping);
    
    void broadcastUserJoined(String roomId, String userId, String userName);
    
    void broadcastUserLeft(String roomId, String userId, String userName);
    
    List<Message> searchMessages(String roomId, String searchTerm);
    
    void deleteMessage(String messageId, String userId);
}