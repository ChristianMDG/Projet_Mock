package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.batch.scheduler.VoyageBatchScheduler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller pour déclencher manuellement les jobs batch
 */
@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class BatchController {

    private final VoyageBatchScheduler voyageBatchScheduler;

    /**
     * Déclenche manuellement le batch de génération de voyages
     */
    @PostMapping("/generate-voyages")
    public ResponseEntity<Map<String, String>> triggerVoyageBatch() {
        Map<String, String> response = new HashMap<>();
        try {
            log.info("Déclenchement manuel du batch via API REST");
            voyageBatchScheduler.runVoyageBatch();
            
            response.put("status", "success");
            response.put("message", "Batch de génération de voyages lancé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors du déclenchement du batch", e);
            response.put("status", "error");
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
