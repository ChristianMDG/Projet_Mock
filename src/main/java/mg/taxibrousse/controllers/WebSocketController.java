package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.messaging.SendMessageRequest;
import mg.taxibrousse.services.IChatRoomService;
import mg.taxibrousse.services.IMessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final IMessageService messageService;
    private final IChatRoomService chatRoomService;

    @MessageMapping("/chat/{roomId}/send")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload SendMessageRequest request,
                            SimpMessageHeaderAccessor headerAccessor,
                            Principal principal) {

        String userId = extractUserId(headerAccessor, principal);
        String userName = extractUserName(headerAccessor, principal);

        if (chatRoomService.isUserInRoom(roomId, userId)) {
            request.setRoomId(roomId);
            messageService.sendMessage(request, userId, userName);
        }

    }

    @MessageMapping("/chat/{roomId}/typing")
    public void handleTypingIndicator(@DestinationVariable String roomId,
                                      @Payload TypingIndicatorMessage typingMessage,
                                      SimpMessageHeaderAccessor headerAccessor,
                                      Principal principal) {

        String userId = extractUserId(headerAccessor, principal);
        if (chatRoomService.isUserInRoom(roomId, userId)) {
            messageService.broadcastTypingIndicator(roomId, userId, typingMessage.isTyping());
        }
    }

    @MessageMapping("/chat/{roomId}/join")
    public void handleUserJoin(@DestinationVariable String roomId,
                               SimpMessageHeaderAccessor headerAccessor,
                               Principal principal) {

        String userId = extractUserId(headerAccessor, principal);
        String userName = extractUserName(headerAccessor, principal);

        try {
            chatRoomService.joinRoom(roomId, userId);
            messageService.broadcastUserJoined(roomId, userId, userName);
        } catch (Exception e) {
            log.error("Error when user {} tried to join room {}", userId, roomId, e);
        }
    }

    @MessageMapping("/chat/{roomId}/leave")
    public void handleUserLeave(@DestinationVariable String roomId,
                                SimpMessageHeaderAccessor headerAccessor,
                                Principal principal) {

        String userId = extractUserId(headerAccessor, principal);
        String userName = extractUserName(headerAccessor, principal);

        try {
            chatRoomService.leaveRoom(roomId, userId);
            messageService.broadcastUserLeft(roomId, userId, userName);
        } catch (Exception e) {
            log.error("Error when user {} tried to leave room {}", userId, roomId, e);
        }
    }

    private String extractUserId(SimpMessageHeaderAccessor accessor, Principal principal) {
        return extractHeader(accessor, "X-Sender-Id", principal, "anonymous");
    }

    private String extractUserName(SimpMessageHeaderAccessor accessor, Principal principal) {
        return extractHeader(accessor, "X-User-Name", principal, "Anonymous User");
    }

    private String extractHeader(SimpMessageHeaderAccessor accessor, String headerName, Principal principal, String fallback) {
        String value = accessor.getFirstNativeHeader(headerName);
        if (value != null && !value.isBlank())
            return value;
        if (principal == null)
            return fallback;
        return principal.getName();
    }

    public record TypingIndicatorMessage(boolean isTyping) {
    }
}