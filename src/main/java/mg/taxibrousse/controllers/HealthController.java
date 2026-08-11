package mg.taxibrousse.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for monitoring deployment status
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${spring.application.name:Taxibrousse}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", applicationName);
        health.put("profile", activeProfile);
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("message", "Taxibrousse API is running successfully");
        return health;
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", applicationName);
        info.put("version", "1.0.0");
        info.put("description", "API reservation des Taxibrousse de Madagascar");
        info.put("profile", activeProfile);
        info.put("java.version", System.getProperty("java.version"));
        info.put("os.name", System.getProperty("os.name"));
        return info;
    }
}
