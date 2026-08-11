package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IGareController;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.params.GareFilter;
import mg.taxibrousse.services.IGareService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GareController implements IGareController {

    private final IGareService gareService;

    @Override
    public ResponseEntity<Gare> createGare(Gare gare) {
        return ResponseEntity.ok(gareService.save(gare));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Gare>> getAllGares(GareFilter filter) {
        return ResponseEntity.ok(gareService.findGares(filter));
    }

    @Override
    public ResponseEntity<Gare> getGareById(Long id) {
        return ResponseEntity.ok(gareService.findById(id));
    }

    @Override
    public ResponseEntity<List<Gare>> getGaresByVilleId(Long villeId) {
        return ResponseEntity.ok(gareService.findByVilleId(villeId));
    }

    @Override
    public ResponseEntity<Gare> updateGare(Long id, Gare gare) {
        return ResponseEntity.ok(gareService.updateGare(id, gare));
    }

    @Override
    public ResponseEntity<Void> deleteGare(Long id) {
        gareService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
