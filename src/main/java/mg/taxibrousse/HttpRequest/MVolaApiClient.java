package mg.taxibrousse.HttpRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.MVolaApiConfig;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class MVolaApiClient {

    private final MVolaApiConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public <T> T post(String token, String url, Object body, Class<T> responseType) throws IOException, InterruptedException {
        String jsonBody = objectMapper.writeValueAsString(body);
        log.debug("MVola API POST request to {}: {}", url, jsonBody);

        var request = buildJsonRequest(token, url, jsonBody);
        T response = send(request, responseType);

        log.info("MVola API POST response: {}", objectMapper.writeValueAsString(response));
        return response;
    }

    public <T> T get(String token, String url, Class<T> responseType) throws IOException, InterruptedException {
        log.debug("MVola API GET request to {}", url);

        var request = buildBaseRequest(token, url).GET().build();
        T response = send(request, responseType);

        log.debug("MVola API GET response: {}", objectMapper.writeValueAsString(response));
        return response;
    }

    public <T> T authenticate(Class<T> responseType) throws IOException, InterruptedException {
        log.info("Authenticating with MVola API");

        var request = HttpRequest.newBuilder()
                .uri(URI.create(config.getTokenUrl()))
                .header("Authorization", "Basic %s".formatted(config.getBasicAuthHeader()))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Cache-Control", "no-cache")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials&scope=EXT_INT_MVOLA_SCOPE"))
                .build();

        return send(request, responseType);
    }

    private <T> T send(HttpRequest request, Class<T> responseType) throws IOException, InterruptedException {
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        log.info("MVola API response status: {}", response.statusCode());
        log.info("MVola API response body: {}", response.body());

        if (response.statusCode() >= 400) {
            log.error("MVola API error - Status: {}, Body: {}", response.statusCode(), response.body());
            throw new IOException("MVola API error: %d %s".formatted(response.statusCode(), response.body()));
        }

        return objectMapper.readValue(response.body(), responseType);
    }

    private HttpRequest buildJsonRequest(String token, String url, String jsonBody) {
        return buildBaseRequest(token, url).POST(HttpRequest.BodyPublishers.ofString(jsonBody)).build();
    }

    private HttpRequest.Builder buildBaseRequest(String token, String url) {
        String correlationId = UUID.randomUUID().toString();
        log.debug("MVola API request - CorrelationID: {}", correlationId);

        return HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", token)
                .header("version", "1.0")
                .header("X-CorrelationID", correlationId)
                .header("UserLanguage", "MG")
                .header("UserAccountIdentifier", config.getUserAccountIdentifier())
                .header("partnerName", config.getPartnerName())
                .header("X-Callback-URL", config.getCallbackUrl())
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Accept-Charset", "utf-8");
    }
}
