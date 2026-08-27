package mg.taxibrousse.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.services.IDailyConnectionService;
import mg.taxibrousse.services.IWebSocketSessionService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final IWebSocketSessionService sessionService;
    private final IDailyConnectionService dailyConnectionService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // Try to get username from custom headers first, then from Principal, then default to anonymous
        String username = headerAccessor.getFirstNativeHeader("X-User-Name");
        if (username == null || username.trim().isEmpty()) {
            Principal user = headerAccessor.getUser();
            username = user != null ? user.getName() : "anonymous";
        }

        // Also get sender ID for more unique identification
        String senderId = headerAccessor.getFirstNativeHeader("X-Sender-Id");
        String uniqueIdentifier = senderId != null ? senderId : sessionId;

        String isGuichetHeader = headerAccessor.getFirstNativeHeader("X-Is-Guichet");
        boolean isGuichet = "true".equalsIgnoreCase(isGuichetHeader);
        String appSource = headerAccessor.getFirstNativeHeader("X-App-Source");

        sessionService.registerSession(sessionId, username, uniqueIdentifier, isGuichet);

        if (!"dashboard".equalsIgnoreCase(appSource)) {
            dailyConnectionService.recordConnection(uniqueIdentifier, "anonymous".equals(username) ? null : username, isGuichet);
        }

        log.info("WebSocket connected - Session: {}, User: {}, SenderId: {}, isGuichet: {}, AppSource: {}", sessionId, username, senderId, isGuichet, appSource);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        sessionService.unregisterSession(sessionId);

        log.info("WebSocket disconnected - Session: {}", sessionId);
    }
}
