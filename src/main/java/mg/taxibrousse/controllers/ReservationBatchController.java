package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IReservationBatchController;
import mg.taxibrousse.services.IReservationBatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReservationBatchController implements IReservationBatchController {

    private final IReservationBatchService batchService;

    @Override
    public ResponseEntity<Map<String, Object>> pause() {
        batchService.pauseBatch();
        return ResponseEntity.ok(Map.of("success", true, "message", "Reservation Batch paused", "enabled", false));
    }

    @Override
    public ResponseEntity<Map<String, Object>> play() {
        batchService.playBatch();
        return ResponseEntity.ok(Map.of("success", true, "message", "Reservation Batch resumed", "enabled", true));
    }

    @Override
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of("enabled", batchService.isBatchEnabled()));
    }

    @Override
    public ResponseEntity<Map<String, Object>> runNow() {
        batchService.executeBatch();
        return ResponseEntity.ok(Map.of("success", true, "message", "Reservation Batch executed manually"));
    }
}
