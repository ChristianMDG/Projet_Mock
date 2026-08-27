package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.TombanaFanaterana;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/tombana-fanaterana")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ITombanaFanateranaController {

    @GetMapping("/{id}")
    ResponseEntity<TombanaFanaterana> getTombanaById(@PathVariable Long id);

    @PostMapping
    ResponseEntity<TombanaFanaterana> createTombana(@RequestBody TombanaFanaterana request);

    @PutMapping("/{id}")
    ResponseEntity<TombanaFanaterana> updateTombana(@PathVariable Long id, @RequestBody TombanaFanaterana request);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteTombana(@PathVariable Long id);

    @GetMapping("/calculate")
    ResponseEntity<TombanaFanaterana> calculateDeliveryFee(
            @RequestParam Long villeId,
            @RequestParam String method,
            @RequestParam BigDecimal weight);
}
