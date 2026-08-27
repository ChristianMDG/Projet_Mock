package mg.taxibrousse.controllers.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.Map;

@RequestMapping("/api/batch/auto-reservation")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IReservationBatchController {

    @PostMapping("/pause")
    ResponseEntity<Map<String, Object>> pause();

    @PostMapping("/play")
    ResponseEntity<Map<String, Object>> play();

    @GetMapping("/status")
    ResponseEntity<Map<String, Object>> status();

    @PostMapping("/run-now")
    ResponseEntity<Map<String, Object>> runNow();
}
