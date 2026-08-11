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

    @Override
    public void registerSession(String sessionId, String username) {
        sessionUserMap.put(sessionId, username);
        log.info("WebSocket session registered: {} for user: {}", sessionId, username);
    }

    @Override
    public void unregisterSession(String sessionId) {
        String username = sessionUserMap.remove(sessionId);
        if (username != null) {
            log.info("WebSocket session unregistered: {} for user: {}", sessionId, username);
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
        return (int) sessionUserMap.values().stream().distinct().count();
    }

    @Override
    public Set<String> getActiveUsernames() {
        return sessionUserMap.values().stream().collect(Collectors.toSet());
    }
}
