package mg.taxibrousse.services;

import java.util.Map;
import java.util.Set;

public interface IWebSocketSessionService {

    void registerSession(String sessionId, String username);

    void registerSession(String sessionId, String username, String uniqueIdentifier, boolean isGuichet);

    void unregisterSession(String sessionId);

    Set<String> getActiveSessions();

    Map<String, String> getSessionUserMap();

    int getActiveUserCount();

    int getActiveSessionCount();

    Set<String> getActiveUsernames();

    int getActiveGuichetUserCount();

    Set<String> getActiveGuichetUsernames();
}
