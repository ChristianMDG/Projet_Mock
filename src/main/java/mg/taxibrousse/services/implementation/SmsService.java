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
import org.springframework.web.util.UriComponentsBuilder;

import mg.taxibrousse.exceptions.SmsException;
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

    @Value("${orange.sms.sender-name}")
    private String senderName;

    @Value("${orange.sms.token}")
    private String authHeader;

    private final String tokenKey = "orange:sms:token";
    private final RestClient restClient = RestClient.builder().build();
    private final StringRedisTemplate redisTemplate;

    @Override
    public void sendSms(String phoneNumber, String message) {
        try {
            String accessToken = redisTemplate.opsForValue().get(tokenKey);
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
                    redisTemplate.opsForValue().set(tokenKey, accessToken, expiresIn - 60, TimeUnit.SECONDS);
                } else {
                    log.error("[SMS] Failed to obtain access token — response={}", response);
                    return;
                }
            }

            String formattedPhoneNumber;
            if (PhoneUtils.isValidMadagascarPhone(phoneNumber)) {
                formattedPhoneNumber = PhoneUtils.toInternationalFormat(phoneNumber);
            } else {
                throw new SmsException("Invalid phone number: " + phoneNumber);
            }

            if (message != null && message.length() > 160) {
                throw new SmsException("SMS message exceeds 160 characters (length=" + message.length() + ")");
            }

            String url = UriComponentsBuilder.fromUriString(apiUrl + "/outbound/{senderAddress}/requests").buildAndExpand("tel:" + senderAddress).toUriString();

            var smsResponse = restClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(OrangeSmsRequest.create(senderAddress, senderName, formattedPhoneNumber, message))
                    .retrieve()
                    .toEntity(String.class);

            log.info("[SMS] SMS sent to {} — status={} body={}", phoneNumber, smsResponse.getStatusCode(), smsResponse.getBody());

        } catch (SmsException e) {
            throw e;
        } catch (Exception e) {
            log.error("[SMS] Error sending SMS to {}: {}", phoneNumber, e.getMessage(), e);
            throw new SmsException("Failed to send SMS to " + phoneNumber, e);
        }
    }
}
