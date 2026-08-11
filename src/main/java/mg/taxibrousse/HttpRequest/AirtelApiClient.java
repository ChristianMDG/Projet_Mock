package mg.taxibrousse.HttpRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.AirtelApiConfig;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AirtelApiClient {
    private final AirtelApiConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public <T> T post(String token, String url, Object body, Class<T> responseType) throws IOException, InterruptedException {
        String jsonBody = objectMapper.writeValueAsString(body);
        log.debug("Airtel API POST request to {}: {}", url, jsonBody);

        var request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", token)
                .header("Content-Type", "application/json")
                .header("Accept", "*/*")
                .header("X-Country", "MG")
                .header("X-Currency", "MGA")
                .header("X-CorrelationID", UUID.randomUUID().toString())
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();

        return send(request, responseType);
    }

    public <T> T get(String token, String url, Class<T> responseType) throws IOException, InterruptedException {
        log.debug("Airtel API GET request to {}", url);
        var request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", token)
                .header("Accept", "*/*")
                .header("X-Country", "MG")
                .header("X-Currency", "MGA")
                .GET()
                .build();

        return send(request, responseType);
    }

    public <T> T authenticate(Class<T> responseType) throws IOException, InterruptedException {
        var url = config.getTokenUrl();
        var formData = "client_id=%s&client_secret=%s&grant_type=client_credentials".formatted(config.getClientId(), config.getClientSecret());
        var request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formData, StandardCharsets.UTF_8))
                .build();

        return send(request, responseType);
    }

    private <T> T send(HttpRequest request, Class<T> responseType) throws IOException, InterruptedException {
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        log.info("Airtel API response status: {}", response.statusCode());
        log.info("Airtel API response body: {}", response.body());

        if (response.statusCode() >= 400) {
            log.error("Airtel API error - Status: {}, Body: {}", response.statusCode(), response.body());
            throw new IOException("Airtel API error: %d %s".formatted(response.statusCode(), response.body()));
        }

        return objectMapper.readValue(response.body(), responseType);
    }
}
