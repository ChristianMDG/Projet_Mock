package mg.taxibrousse.HttpRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.config.WhatsAppApiConfig;
import mg.taxibrousse.dto.whatsapp.WhatsAppErrorResponse;
import mg.taxibrousse.exceptions.WhatsAppException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
@RequiredArgsConstructor
@Slf4j
public class WhatsAppApiClient {

    private final WhatsAppApiConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public <T> T post(String url, Object body, Class<T> responseType) {
        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            log.debug("WhatsApp API POST to {}: {}", url, jsonBody);
            var request = buildRequest(url).POST(HttpRequest.BodyPublishers.ofString(jsonBody)).build();
            return send(request, responseType);
        } catch (WhatsAppException e) {
            throw e;
        } catch (Exception e) {
            throw new WhatsAppException("Failed to POST to WhatsApp API: " + url, e);
        }
    }

    public <T> T get(String url, Class<T> responseType) {
        try {
            log.debug("WhatsApp API GET to {}", url);
            return send(buildRequest(url).GET().build(), responseType);
        } catch (WhatsAppException e) {
            throw e;
        } catch (Exception e) {
            throw new WhatsAppException("Failed to GET from WhatsApp API: " + url, e);
        }
    }

    public void delete(String url) {
        try {
            log.debug("WhatsApp API DELETE to {}", url);
            var response = httpClient.send(buildRequest(url).DELETE().build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                handleError(response);
            }
            log.info("WhatsApp API DELETE success: {}", response.statusCode());
        } catch (WhatsAppException e) {
            throw e;
        } catch (Exception e) {
            throw new WhatsAppException("Failed to DELETE from WhatsApp API: " + url, e);
        }
    }

    private <T> T send(HttpRequest request, Class<T> responseType) throws Exception {
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        log.info("WhatsApp API response status: {}", response.statusCode());

        if (response.statusCode() >= 400) {
            handleError(response);
        }

        return objectMapper.readValue(response.body(), responseType);
    }

    private void handleError(HttpResponse<String> response) {
        try {
            var error = objectMapper.readValue(response.body(), WhatsAppErrorResponse.class).getError();
            log.error("WhatsApp API error - Status: {}, Code: {}, Message: {}", response.statusCode(), error.getCode(), error.getMessage());
            throw new WhatsAppException("WhatsApp API error: %s - %s".formatted(error.getCode(), error.getMessage()));
        } catch (WhatsAppException e) {
            throw e;
        } catch (Exception e) {
            log.error("WhatsApp API error - Status: {}, Body: {}", response.statusCode(), response.body());
            throw new WhatsAppException("WhatsApp API error: %d".formatted(response.statusCode()));
        }
    }

    private HttpRequest.Builder buildRequest(String url) {
        return HttpRequest.newBuilder().uri(URI.create(url)).header("Authorization", config.getAuthHeader()).header("Content-Type", "application/json").header("Accept", "application/json");
    }
}
