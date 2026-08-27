package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.entities.enums.MessageType;
import mg.taxibrousse.models.Message;
import mg.taxibrousse.repositories.IMessageRepository;
import mg.taxibrousse.services.IChatRoomService;
import mg.taxibrousse.services.IMessageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService implements IMessageService {

    private final IMessageRepository messageRepository;
    private final IChatRoomService chatRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public MessageEntity sendMessage(SendMessageRequest request, String senderId, String senderName) {
        String messageId = UUID.randomUUID().toString();

        MessageEntity message = new MessageEntity();
        message.setMessageId(messageId);
        message.setRoomId(request.getRoomId());
        message.setSenderId(senderId);
        message.setSenderName(senderName);
        message.setContent(request.getContent());
        message.setType(request.getType() != null ? request.getType() : MessageType.TEXT);
        message.setMetadata(request.getMetadata());
        message.setReplyToMessageId(request.getReplyToMessageId());
        message.setDeliveredAt(LocalDateTime.now());

        MessageEntity savedMessage = messageRepository.save(message);

        // Update chat room's last message
        chatRoomService.updateLastMessage(request.getRoomId(), request.getContent(), senderName);

        // Broadcast message to room subscribers
        broadcastMessage(savedMessage);

        log.info("Message sent: {} in room: {} by: {}", messageId, request.getRoomId(), senderId);

        return savedMessage;
    }

    @Override
    public Optional<MessageEntity> findByMessageId(String messageId) {
        return messageRepository.findByMessageId(messageId);
    }

    @Override
    public Page<Message> getMessagesInRoom(String roomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageEntity> messagesPage = messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId, pageable);

        return messagesPage.map(Message::fromEntity);
    }

    @Override
    public List<Message> getRecentMessages(String roomId, LocalDateTime since) {
        List<MessageEntity> messages = messageRepository.findByRoomIdAndCreatedAtAfterOrderByCreatedAtAsc(roomId, since);
        return messages.stream().map(Message::fromEntity).collect(Collectors.toList());
    }

    @Override
    public Long getUnreadCount(String roomId, String userId) {
        return messageRepository.countUnreadMessagesInRoom(roomId, userId);
    }

    @Override
    @Transactional
    public void markRoomAsRead(String roomId, String userId) {
        int updatedCount = messageRepository.markRoomMessagesAsRead(roomId, userId, LocalDateTime.now());
        log.debug("Marked {} messages as read in room: {} for user: {}", updatedCount, roomId, userId);

        // Broadcast read receipt
        broadcastReadReceipt(roomId, userId);
    }

    @Override
    @Transactional
    public void markMessageAsRead(String messageId, String userId) {
        Optional<MessageEntity> messageOpt = messageRepository.findByMessageId(messageId);
        if (messageOpt.isPresent()) {
            MessageEntity message = messageOpt.get();
            if (!message.getSenderId().equals(userId) && !message.getIsRead()) {
                message.setIsRead(true);
                message.setReadAt(LocalDateTime.now());
                messageRepository.save(message);

                // Broadcast read receipt
                broadcastReadReceipt(message.getRoomId(), userId);
            }
        }
    }

    @Override
    public MessageEntity getLastMessageInRoom(String roomId) {
        return messageRepository.findLastMessageInRoom(roomId).orElse(null);
    }

    @Override
    public void broadcastMessage(MessageEntity message) {
        Message messageModel = Message.fromEntity(message);

        // Broadcast to room topic
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomId(), messageModel);

        // Broadcast to dashboard for admin monitoring
        if (messageModel.getType() != MessageType.SYSTEM)
            messagingTemplate.convertAndSend("/topic/admin/messages", messageModel);

        log.debug("Broadcasted message {} to room {}", message.getMessageId(), message.getRoomId());
    }

    @Override
    public void broadcastTypingIndicator(String roomId, String userId, boolean isTyping) {
        TypingIndicator indicator = new TypingIndicator(userId, isTyping);
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/typing", indicator);
    }

    @Override
    public void broadcastUserJoined(String roomId, String userId, String userName) {
        UserEvent event = new UserEvent("user_joined", userId, userName);
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/events", event);

        // Notify dashboard
        messagingTemplate.convertAndSend("/topic/admin/user-events", event);
    }

    @Override
    public void broadcastUserLeft(String roomId, String userId, String userName) {
        UserEvent event = new UserEvent("user_left", userId, userName);
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/events", event);

        // Notify dashboard
        messagingTemplate.convertAndSend("/topic/admin/user-events", event);
    }

    @Override
    public List<Message> searchMessages(String roomId, String searchTerm) {
        // This would require a more sophisticated search implementation
        // For now, return empty list as placeholder
        return List.of();
    }

    @Override
    @Transactional
    public void deleteMessage(String messageId, String userId) {
        Optional<MessageEntity> messageOpt = messageRepository.findByMessageId(messageId);
        if (messageOpt.isPresent()) {
            MessageEntity message = messageOpt.get();

            // Only allow sender to delete their own messages
            if (message.getSenderId().equals(userId)) {
                message.setContent("[Message deleted]");
                message.setType(MessageType.SYSTEM);
                messageRepository.save(message);

                // Broadcast the deletion
                broadcastMessage(message);
            }
        }
    }

    private void broadcastReadReceipt(String roomId, String userId) {
        ReadReceipt receipt = new ReadReceipt(userId, LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/read-receipts", receipt);
    }

    private Message convertToDto(MessageEntity message) {
        return Message.fromEntity(message);
    }

    // Helper classes for WebSocket events
    private record TypingIndicator(String userId, boolean isTyping) {
    }

    private record UserEvent(String type, String userId, String userName) {
    }

    private record ReadReceipt(String userId, LocalDateTime readAt) {
    }
}
