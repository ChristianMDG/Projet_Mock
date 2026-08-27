package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.models.DailyConnectionStats;
import mg.taxibrousse.services.IDailyConnectionService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class DailyConnectionService implements IDailyConnectionService {

    private static final String KEY = "daily:conn:";
    private static final String HLL_KEY = "daily:conn:hll:";
    private static final String GUICHET_KEY = "daily:conn:guichet:";
    private static final String GUICHET_HLL_KEY = "daily:conn:guichet:hll:";
    private static final Duration TTL = Duration.ofDays(91);

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    public void recordConnection(String senderId, String username, boolean isGuichet) {
        if (StringUtils.hasText(senderId)) {
            String date = LocalDate.now().toString();
            redis.opsForHyperLogLog().add(HLL_KEY + date, senderId);
            redis.opsForValue().increment(KEY + date);
            redis.expire(HLL_KEY + date, TTL);
            redis.expire(KEY + date, TTL);

            if (isGuichet) {
                redis.opsForHyperLogLog().add(GUICHET_HLL_KEY + date, senderId);
                redis.opsForValue().increment(GUICHET_KEY + date);
                redis.expire(GUICHET_HLL_KEY + date, TTL);
                redis.expire(GUICHET_KEY + date, TTL);
            }
        }
    }

    @Override
    public List<DailyConnectionStats> getConnectionTrend(int days) {
        LocalDate today = LocalDate.now();
        return today.minusDays(days - 1L).datesUntil(today.plusDays(1)).map(this::statsForDate).toList();
    }

    private DailyConnectionStats statsForDate(LocalDate date) {
        String d = date.toString();
        Long unique = redis.opsForHyperLogLog().size(HLL_KEY + d);
        String total = redis.opsForValue().get(KEY + d);
        Long uniqueGuichet = redis.opsForHyperLogLog().size(GUICHET_HLL_KEY + d);
        String totalGuichet = redis.opsForValue().get(GUICHET_KEY + d);

        return DailyConnectionStats.builder()
                .date(date)
                .uniqueSenderIds(Optional.ofNullable(unique).orElse(0L))
                .totalConnections(Optional.ofNullable(total).map(Long::parseLong).orElse(0L))
                .uniqueGuichetConnections(Optional.ofNullable(uniqueGuichet).orElse(0L))
                .totalGuichetConnections(Optional.ofNullable(totalGuichet).map(Long::parseLong).orElse(0L))
                .build();
    }
}
