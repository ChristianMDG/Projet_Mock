package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.VoyageDescriptionDto;
import mg.taxibrousse.dto.FacebookScheduleRequestDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/api/facebook")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IFacebookPostController {

    @GetMapping("/voyage-descriptions")
    ResponseEntity<List<VoyageDescriptionDto>> getVoyageDescriptions(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate, @RequestParam Long gareId,
            @RequestParam String departureVille);

    @PostMapping("/schedule")
    ResponseEntity<Void> schedulePost(@ModelAttribute FacebookScheduleRequestDto request);
}
