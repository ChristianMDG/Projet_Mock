package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.services.AppVersionService;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FrontController {

    private final AppVersionService appVersionService;
    private final CacheManager cacheManager;

    @GetMapping("/v3rs10n")
    public ResponseEntity<Map<String, Object>> refreshVersion() {
        String newVersion = appVersionService.refreshVersion();

        // Clear all Redis caches
        int clearedCaches = 0;
        for (String cacheName : cacheManager.getCacheNames()) {
            var cache = cacheManager.getCache(cacheName);
            if (cache == null) {
                continue;
            }

            cache.clear();
            clearedCaches++;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("version", newVersion);
        response.put("status", "refreshed");
        response.put("cacheCleared", true);
        response.put("clearedCaches", clearedCaches);
        response.put("cacheNames", cacheManager.getCacheNames());
        response.put("timestamp", ZonedDateTime.now(ZoneId.of("Indian/Antananarivo")));

        return ResponseEntity.ok(response);
    }
}
