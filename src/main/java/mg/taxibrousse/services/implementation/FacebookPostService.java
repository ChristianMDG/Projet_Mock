package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.VoyageDescriptionDto;
import mg.taxibrousse.dto.VoyageDescriptionDtoImpl;
import mg.taxibrousse.dto.FacebookScheduleRequestDto;
import mg.taxibrousse.dto.FacebookGraphResponseDto;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.IFacebookPostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacebookPostService implements IFacebookPostService {

    @Value("${facebook.page.access-token}")
    private String pageAccessToken;

    @Value("${facebook.page.id}")
    private String pageId;

    @Value("${facebook.api.version:v19.0}")
    private String apiVersion;

    private final IVoyageRepository voyageRepository;
    private final RestTemplate restTemplate;

    @Override
    public List<VoyageDescriptionDto> getVoyageDescriptions(LocalDate departureDate, Long gareId, String departureVille) {
        List<VoyageEntity> voyages = voyageRepository.findVoyagesForFacebookPost(departureDate, gareId, departureVille);

        if (voyages.isEmpty())
            return List.of();

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        String gareName = voyages.getFirst().getDepartureGare().getName();

        String header = """
                📢 eZotra National, (Taxibrousse.mg)
                🔗 Misafidy Dia sy Seza - Mandoa Frais, dia vita ny reservation.
                🔗 Miainga eto %s

                📌 %s

                """.formatted(departureVille, gareName);

        String destinations = voyages.stream().collect(Collectors.groupingBy(v -> v.getArrivalGare().getVille().getName())).entrySet().stream().sorted(Map.Entry.comparingByKey()).map(entry -> {
            String arrVille = entry.getKey();
            List<VoyageEntity> destVoyages = entry.getValue();

            String times = destVoyages.stream().map(v -> v.getDepartureTime().format(timeFormatter)).distinct().sorted().collect(Collectors.joining(", "));

            return """
                    🔸 Makany %s
                    ⏰ Ora hiaingana : %s
                    🌐 Rohy : https://taxibrousse.mg/fikarohana?eto=%s&makany=%s&pax=1&daty=%s
                    """.formatted(arrVille, times, departureVille, arrVille, departureDate);
        }).collect(Collectors.joining("\n"));

        String footer = """

                🌐 Telefaonina : 033 66 059 56 - 038 94 493 33

                #taxibrousse #ezotra #madagascar #reservation #voyagemadagascar #transport #taxi #brousse #antananarivo #voyage #taxibroussemadagascar #ezotranationale""";

        String voyageIds = voyages.stream().map(v -> String.valueOf(v.getId())).collect(Collectors.joining(","));

        String departureTimes = voyages.stream().map(v -> v.getDepartureTime().format(timeFormatter)).distinct().sorted().collect(Collectors.joining(", "));

        VoyageDescriptionDto dto = VoyageDescriptionDtoImpl.builder()
                .departureTimes(departureTimes)
                .description(header + destinations + footer)
                .voyageIds(voyageIds)
                .departureDate(departureDate)
                .gareId(gareId)
                .departureVille(departureVille)
                .arrivalVille("Toutes les destinations")
                .gareName(gareName)
                .koperativeName("eZotra National")
                .build();

        return List.of(dto);
    }

    @Override
    @Transactional
    public void schedulePost(FacebookScheduleRequestDto request) {
        // Parse voyage IDs from comma-separated string
        List<Long> voyageIds = java.util.Arrays.stream(request.getVoyageIds().split(",")).map(String::trim).filter(s -> !s.isEmpty()).map(Long::valueOf).toList();

        // 1. Always mark voyages as fb_scheduled in the database first
        voyageRepository.markFbScheduledByIds(voyageIds);
        log.info("Voyages marked as fb_scheduled for voyageIds={}", voyageIds);

        // 2. Try to schedule the Facebook post (non-blocking: failure is logged but does not rollback)
        try {
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                String photoId = uploadPhoto(request.getImage().getBytes(), request.getImage().getOriginalFilename());
                long scheduledUnix = request.getScheduledTime().toEpochSecond(ZoneOffset.UTC);
                publishScheduledPost(request.getDescription(), photoId, scheduledUnix);
                log.info("Facebook post scheduled successfully for voyageIds={}", voyageIds);
            } else {
                log.info("No image provided — skipping Facebook API call. Schedule marked in DB only.");
            }
        } catch (Exception e) {
            log.warn("Facebook API call failed for voyageIds={} — schedule saved in DB anyway: {}", voyageIds, e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private String uploadPhoto(byte[] imageBytes, String imageFileName) {
        String url = String.format("https://graph.facebook.com/%s/%s/photos", apiVersion, pageId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource imageResource = new ByteArrayResource(imageBytes) {

            @Override
            public String getFilename() {
                return imageFileName;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("source", imageResource);
        body.add("published", "false");
        body.add("access_token", pageAccessToken);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<FacebookGraphResponseDto> response = restTemplate.postForEntity(url, request, FacebookGraphResponseDto.class);

        String photoId = response.getBody() != null ? response.getBody().getId() : null;
        if (photoId == null) {
            throw new IllegalStateException("Facebook photo upload failed — no id returned");
        }
        log.info("Facebook photo uploaded: id={}", photoId);
        return photoId;
    }

    private void publishScheduledPost(String message, String photoId, long scheduledUnix) {
        String url = String.format("https://graph.facebook.com/%s/%s/feed", apiVersion, pageId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("message", message);
        body.add("published", "false");
        body.add("scheduled_publish_time", String.valueOf(scheduledUnix));
        body.add("attached_media[0]", "{\"media_fbid\":\"" + photoId + "\"}");
        body.add("access_token", pageAccessToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<FacebookGraphResponseDto> response = restTemplate.postForEntity(url, request, FacebookGraphResponseDto.class);

        String postId = response.getBody() != null ? response.getBody().getId() : null;
        if (postId == null) {
            throw new IllegalStateException("Facebook post scheduling failed — no id returned");
        }
        log.info("Facebook post scheduled: postId={} scheduledAt={}", postId, scheduledUnix);
    }

}
