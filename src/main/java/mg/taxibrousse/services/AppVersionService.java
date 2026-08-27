package mg.taxibrousse.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AppVersionService {

    private static final String REDIS_KEY = "app:version";
    private final StringRedisTemplate redisTemplate;

    public String getVersion() {
        return redisTemplate.opsForValue().get(REDIS_KEY);
    }

    public String refreshVersion() {
        String newVersion = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        redisTemplate.opsForValue().set(REDIS_KEY, newVersion);
        return newVersion;
    }

    public void initVersionIfAbsent() {
        if (redisTemplate.opsForValue().get(REDIS_KEY) == null)
            refreshVersion();
    }
}
