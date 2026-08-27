package mg.taxibrousse.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IColisController;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.models.Colis;
import mg.taxibrousse.services.IColisService;

@RestController
@RequiredArgsConstructor
public class ColisController implements IColisController {

    private final IColisService colisService;

    @GetMapping
    public ResponseEntity<List<Colis>> listAllColis() {
        return ResponseEntity.ok(colisService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Colis> getColis(Long id) {
        return ResponseEntity.ok(colisService.findById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Colis>> listColisByStatus(ColisStatusEnum status) {
        return ResponseEntity.ok(colisService.findByStatus(status));
    }

    @GetMapping("/crafter/{crafterId}")
    public ResponseEntity<List<Colis>> listColisByCrafter(Long crafterId) {
        return ResponseEntity.ok(colisService.findByCrafterId(crafterId));
    }

    @GetMapping("/voyage/{voyageId}")
    public ResponseEntity<List<Colis>> listColisByVoyage(Long voyageId) {
        return ResponseEntity.ok(colisService.findByVoyageId(voyageId));
    }

    @GetMapping("/koperative/{koperativeId}")
    public ResponseEntity<List<Colis>> listColisByKoperative(Long koperativeId) {
        return ResponseEntity.ok(colisService.findByKoperativeId(koperativeId));
    }

    @Override
    public ResponseEntity<List<Colis>> listFilteredColis(Long voyageId, String search) {
        return ResponseEntity.ok(colisService.findFilteredByVoyageId(voyageId, search));
    }

    @Override
    public ResponseEntity<Colis> createColis(Colis colis) {
        return ResponseEntity.ok(colisService.save(colis));
    }

    @Override
    public ResponseEntity<Colis> updateColis(Long id, Colis colis) {
        colis.setId(id);
        return ResponseEntity.ok(colisService.save(colis));
    }

    @Override
    public ResponseEntity<Void> deleteColis(Long id) {
        colisService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
