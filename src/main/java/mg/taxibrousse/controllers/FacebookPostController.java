package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IFacebookPostController;
import mg.taxibrousse.dto.VoyageDescriptionDto;
import mg.taxibrousse.dto.FacebookScheduleRequestDto;
import mg.taxibrousse.services.IFacebookPostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class FacebookPostController implements IFacebookPostController {

    private final IFacebookPostService facebookPostService;

    @Override
    public ResponseEntity<List<VoyageDescriptionDto>> getVoyageDescriptions(LocalDate departureDate, Long gareId, String departureVille) {
        List<VoyageDescriptionDto> descriptions = facebookPostService.getVoyageDescriptions(departureDate, gareId, departureVille);
        return ResponseEntity.ok(descriptions);
    }

    @Override
    public ResponseEntity<Void> schedulePost(FacebookScheduleRequestDto request) {
        try {
            facebookPostService.schedulePost(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to schedule facebook post", e);
        }
    }
}
