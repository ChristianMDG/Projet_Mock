package mg.taxibrousse.services.implementation;

import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.services.IWebSocketSessionService;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
public class WebSocketSessionService implements IWebSocketSessionService {

    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();
    private final Map<String, String> sessionIdentifierMap = new ConcurrentHashMap<>();
    private final Map<String, Boolean> sessionGuichetMap = new ConcurrentHashMap<>();

    @Override
    public void registerSession(String sessionId, String username) {
        registerSession(sessionId, username, sessionId, false);
    }

    @Override
    public void registerSession(String sessionId, String username, String uniqueIdentifier, boolean isGuichet) {
        sessionUserMap.put(sessionId, username);
        sessionIdentifierMap.put(sessionId, uniqueIdentifier);
        sessionGuichetMap.put(sessionId, isGuichet);
        log.info("WebSocket session registered: {} for user: {} with identifier: {} (isGuichet: {})", sessionId, username, uniqueIdentifier, isGuichet);
    }

    @Override
    public void unregisterSession(String sessionId) {
        String username = sessionUserMap.remove(sessionId);
        String identifier = sessionIdentifierMap.remove(sessionId);
        Boolean isGuichet = sessionGuichetMap.remove(sessionId);
        if (username != null) {
            log.info("WebSocket session unregistered: {} for user: {} with identifier: {} (isGuichet: {})", sessionId, username, identifier, isGuichet);
        }
    }

    @Override
    public Set<String> getActiveSessions() {
        return sessionUserMap.keySet();
    }

    @Override
    public Map<String, String> getSessionUserMap() {
        return Map.copyOf(sessionUserMap);
    }

    @Override
    public int getActiveUserCount() {
        // Count unique identifiers instead of usernames to handle multiple anonymous users
        return (int) sessionIdentifierMap.values().stream().distinct().count();
    }

    @Override
    public int getActiveSessionCount() {
        // Count total active sessions
        return sessionUserMap.size();
    }

    @Override
    public Set<String> getActiveUsernames() {
        return sessionUserMap.values().stream().collect(Collectors.toSet());
    }

    @Override
    public int getActiveGuichetUserCount() {
        return (int) sessionIdentifierMap.entrySet().stream().filter(entry -> Boolean.TRUE.equals(sessionGuichetMap.get(entry.getKey()))).map(Map.Entry::getValue).distinct().count();
    }

    @Override
    public Set<String> getActiveGuichetUsernames() {
        return sessionUserMap.entrySet().stream().filter(entry -> Boolean.TRUE.equals(sessionGuichetMap.get(entry.getKey()))).map(Map.Entry::getValue).collect(Collectors.toSet());
    }
}
