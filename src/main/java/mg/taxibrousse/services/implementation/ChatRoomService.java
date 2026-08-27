package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.messaging.CreateChatRoomRequest;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.entities.ChatRoomEntity;
import mg.taxibrousse.entities.enums.ChatRoomType;
import mg.taxibrousse.entities.enums.MessageType;
import mg.taxibrousse.models.ChatRoom;
import mg.taxibrousse.repositories.IChatRoomRepository;
import mg.taxibrousse.services.IChatRoomService;
import mg.taxibrousse.services.IMessageService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
public class ChatRoomService implements IChatRoomService {

    private static final String SUPPORT_WELCOME_MESSAGE_KEY = "chat_support_welcome_message";
    private static final String SUPPORT_ROOM_PREFIX = "support_";
    private static final Set<String> STAFF_ROLES = Set.of("ADMIN", "GUICHET", "KOPERATIVE");
    private static final AuthenticationTrustResolver TRUST_RESOLVER = new AuthenticationTrustResolverImpl();

    private final IChatRoomRepository chatRoomRepository;
    private final ObjectMapper objectMapper;
    private final IMessageService messageService;

    public ChatRoomService(IChatRoomRepository chatRoomRepository, ObjectMapper objectMapper, @Lazy IMessageService messageService) {
        this.chatRoomRepository = chatRoomRepository;
        this.objectMapper = objectMapper;
        this.messageService = messageService;
    }

    @Override
    @Transactional
    public ChatRoom createRoom(CreateChatRoomRequest request) {
        String roomId = generateRoomId(request.getType());

        ChatRoomEntity room = new ChatRoomEntity(roomId, request.getType());
        room.setTitle(request.getTitle());
        room.setMetadata(request.getMetadata());
        attachParticipants(room, request);

        ChatRoomEntity savedRoom = chatRoomRepository.save(room);
        log.info("Created chat room: {} with type: {}", roomId, request.getType());

        return ChatRoom.fromEntity(savedRoom);
    }

    private void attachParticipants(ChatRoomEntity room, CreateChatRoomRequest request) {
        if (request.getParticipantIds() == null) {
            room.setParticipants("[]");
            return;
        }
        try {
            String participantsJson = objectMapper.writeValueAsString(List.of(request.getParticipantIds()));
            room.setParticipants(participantsJson);
        } catch (JsonProcessingException e) {
            log.error("Error converting participants to JSON", e);
            room.setParticipants("[]");
        }
    }

    @Override
    public Optional<ChatRoom> findByRoomId(String roomId) {
        return chatRoomRepository.findByRoomId(roomId).map(ChatRoom::fromEntity);
    }

    @Override
    public List<ChatRoom> getActiveRoomsForUser(String userId) {
        return chatRoomRepository.findActiveRoomsForUser(userId).stream().map(ChatRoom::fromEntity).toList();
    }

    @Override
    public List<ChatRoom> getAllActiveRooms() {
        return chatRoomRepository.findAllActiveRoomsOrderByLastActivity().stream().map(ChatRoom::fromEntity).toList();
    }

    @Override
    @Transactional
    public ChatRoom joinRoom(String roomId, String userId) {
        Optional<ChatRoomEntity> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoomEntity room = roomOpt.get();
            addUserToRoom(room, userId);
            return ChatRoom.fromEntity(chatRoomRepository.save(room));
        }
        throw new EntityNotFoundException("Room not found: " + roomId);
    }

    @Override
    @Transactional
    public void leaveRoom(String roomId, String userId) {
        Optional<ChatRoomEntity> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoomEntity room = roomOpt.get();
            removeUserFromRoom(room, userId);
            chatRoomRepository.save(room);
        }
    }

    @Override
    public boolean isUserInRoom(String roomId, String userId) {
        return chatRoomRepository.isUserInRoom(userId, roomId);
    }

    @Override
    public boolean hasRoomAccess(String roomId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (isSupportRoom(roomId) && isAnonymous(auth)) {
            return true;
        }
        return isStaff(auth) || isUserInRoom(roomId, auth.getName());
    }

    private boolean isStaff(Authentication auth) {
        return auth != null && auth.isAuthenticated()
                && auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(STAFF_ROLES::contains);
    }

    private boolean isAnonymous(Authentication auth) {
        return auth == null || TRUST_RESOLVER.isAnonymous(auth);
    }

    private boolean isSupportRoom(String roomId) {
        return StringUtils.hasText(roomId) && roomId.startsWith(SUPPORT_ROOM_PREFIX);
    }

    @Override
    @Transactional
    public void updateLastMessage(String roomId, String message, String sender) {
        Optional<ChatRoomEntity> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoomEntity room = roomOpt.get();
            room.setLastMessage(message.length() > 100 ? message.substring(0, 100) + "..." : message);
            room.setLastMessageSender(sender);
            chatRoomRepository.save(room);
        }
    }

    @Override
    @Transactional
    public void deactivateRoom(String roomId) {
        Optional<ChatRoomEntity> roomOpt = chatRoomRepository.findByRoomId(roomId);
        if (roomOpt.isPresent()) {
            ChatRoomEntity room = roomOpt.get();
            room.setIsActive(false);
            chatRoomRepository.save(room);
        }
    }

    @Override
    @Transactional
    public void deleteRoom(String roomId) {
        chatRoomRepository.findByRoomId(roomId).ifPresent(chatRoomRepository::delete);
    }

    @Override
    @Transactional
    public ChatRoom getOrCreateCustomerSupportRoom(String userId) {
        String roomId = "support_" + userId;

        Optional<ChatRoomEntity> existingRoom = chatRoomRepository.findByRoomId(roomId);
        if (existingRoom.isPresent()) {
            return ChatRoom.fromEntity(existingRoom.get());
        }

        // Create new customer support room
        CreateChatRoomRequest request = new CreateChatRoomRequest();
        request.setType(ChatRoomType.CUSTOMER_SUPPORT);
        request.setTitle("Support - " + userId);
        // Include 'admin' in participants so admin can access all support rooms
        request.setParticipantIds(new String[]{userId, "admin", "system"});

        ChatRoom newRoom = createRoom(request);

        // Send welcome message for new support rooms
        sendWelcomeMessage(newRoom.getRoomId());

        return newRoom;
    }

    private void sendWelcomeMessage(String roomId) {
        try {
            SendMessageRequest welcomeRequest = new SendMessageRequest();
            welcomeRequest.setRoomId(roomId);
            welcomeRequest.setContent(SUPPORT_WELCOME_MESSAGE_KEY);
            welcomeRequest.setType(MessageType.SYSTEM);

            messageService.sendMessage(welcomeRequest, "system", "Support Taxibrousse");
            log.info("Sent welcome message to new support room: {}", roomId);
        } catch (Exception e) {
            log.error("Failed to send welcome message to room {}: {}", roomId, e.getMessage());
        }
    }

    @Override
    public List<ChatRoom> findByType(ChatRoomType type) {
        return chatRoomRepository.findByTypeAndIsActiveTrue(type).stream().map(ChatRoom::fromEntity).toList();
    }

    @Override
    public Long getTotalActiveRooms() {
        return chatRoomRepository.findAllActiveRoomsOrderByLastActivity().stream().count();
    }

    private String generateRoomId(ChatRoomType type) {
        String prefix = switch (type) {
            case CUSTOMER_SUPPORT -> "support";
            case VOYAGE_CHAT -> "voyage";
            case GENERAL_INQUIRY -> "inquiry";
        };
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private void addUserToRoom(ChatRoomEntity room, String userId) {
        try {
            List<String> participants = List.of(objectMapper.readValue(room.getParticipants(), String[].class));
            List<String> updatedParticipants = new ArrayList<>(participants);
            if (updatedParticipants.contains(userId))
                return;

            updatedParticipants.add(userId);
            room.setParticipants(objectMapper.writeValueAsString(updatedParticipants));
        } catch (JsonProcessingException e) {
            log.error("Error processing participants JSON", e);
        }
    }

    private void removeUserFromRoom(ChatRoomEntity room, String userId) {
        try {
            List<String> participants = List.of(objectMapper.readValue(room.getParticipants(), String[].class));
            List<String> updatedParticipants = participants.stream().filter(id -> !id.equals(userId)).toList();

            room.setParticipants(objectMapper.writeValueAsString(updatedParticipants));
        } catch (JsonProcessingException e) {
            log.error("Error processing participants JSON", e);
        }
    }
}
