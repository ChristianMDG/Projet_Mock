package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.AppVersionService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FrontController {

    private final AppVersionService appVersionService;

    @GetMapping("/v3rs10n")
    @CacheEvict(allEntries = true, cacheNames = {
        "routes", "users", "gares", "cooperatives", "destinations", 
        "chauffeurs", "contrats", "villes", "guichets", "authorities",
        "userinfo", "crafter", "koperative", "presence", "bookings",
        "schedules", "payments", "statistics", "promotions"
    })
    public ResponseEntity<Map<String, String>> refreshVersion() {
        String newVersion = appVersionService.refreshVersion();
        return ResponseEntity.ok(Map.of("version", newVersion, "status", "refreshed", "cacheCleared", "true", "timestamp", LocalDateTime.now().toString()));
    }
}
