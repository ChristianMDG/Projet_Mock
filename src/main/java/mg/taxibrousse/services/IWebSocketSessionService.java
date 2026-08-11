package mg.taxibrousse.services;

import java.util.Map;
import java.util.Set;

public interface IWebSocketSessionService {
    void registerSession(String sessionId, String username);
    void unregisterSession(String sessionId);
    Set<String> getActiveSessions();
    Map<String, String> getSessionUserMap();
    int getActiveUserCount();
    Set<String> getActiveUsernames();
}
