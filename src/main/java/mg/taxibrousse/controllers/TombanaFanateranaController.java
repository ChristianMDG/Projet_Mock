package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ITombanaFanateranaController;
import mg.taxibrousse.models.TombanaFanaterana;
import mg.taxibrousse.services.ITombanaFanateranaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class TombanaFanateranaController implements ITombanaFanateranaController {

    private final ITombanaFanateranaService service;

    @Override
    public ResponseEntity<TombanaFanaterana> getTombanaById(Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<TombanaFanaterana> createTombana(TombanaFanaterana request) {
        return ResponseEntity.ok(service.save(request));
    }

    @Override
    public ResponseEntity<TombanaFanaterana> updateTombana(Long id, TombanaFanaterana request) {
        request.setId(id);
        return ResponseEntity.ok(service.save(request));
    }

    @Override
    public ResponseEntity<Void> deleteTombana(Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<TombanaFanaterana> calculateDeliveryFee(Long villeId, String method, BigDecimal weight) {
        return service.findTombana(villeId, method, weight)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
