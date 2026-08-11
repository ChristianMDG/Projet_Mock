package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.orange.OrangeSmsRequest;
import mg.taxibrousse.services.ISmsService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SmsService implements ISmsService {

    @Value("${orange.sms.url}")
    private String apiUrl;

    @Value("${orange.sms.auth-url}")
    private String authUrl;

    @Value("${orange.sms.sender-address}")
    private String senderAddress;

    @Value("${orange.sms.token}")
    private String authHeader;

    private final String TOKEN_KEY = "orange:sms:token";
    private final RestClient restClient = RestClient.builder().build();
    private final StringRedisTemplate redisTemplate;

    @Override
    public void sendSms(String phoneNumber, String message) {
        try {
            String accessToken = redisTemplate.opsForValue().get(TOKEN_KEY);
            if (accessToken == null) {
                var response = restClient.post()
                    .uri(authUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + authHeader)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body("grant_type=client_credentials")
                    .retrieve()
                    .body(Map.class);

                if (response != null && response.containsKey("access_token")) {
                    accessToken = (String) response.get("access_token");
                    int expiresIn = response.containsKey("expires_in") ? (int) response.get("expires_in") : 3600;
                    redisTemplate.opsForValue().set(TOKEN_KEY, accessToken, expiresIn - 60, TimeUnit.SECONDS);
                } else {
                    log.error("Failed to obtain access token for Orange SMS API");
                    return;
                }
            }
            
            String formattedPhoneNumber = PhoneUtils.toInternationalFormat(phoneNumber);
            String url = String.format("%s/outbound/tel:%s/requests", apiUrl, senderAddress);
            OrangeSmsRequest body = OrangeSmsRequest.create(senderAddress, formattedPhoneNumber, message);

            restClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();

            log.info("SMS sent successfully to {}", phoneNumber);

        } catch (Exception e) {
            log.error("Error sending SMS to {}: {}", phoneNumber, e.getMessage());
            throw new RuntimeException("Failed to send SMS", e);
        }
    }
}
