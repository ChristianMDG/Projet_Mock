package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IKoperativeController;
import mg.taxibrousse.models.*;
import mg.taxibrousse.params.KoperativeFilter;
import mg.taxibrousse.services.IChauffeurService;
import mg.taxibrousse.services.ICrafterService;
import mg.taxibrousse.services.IGuichetService;
import mg.taxibrousse.services.IKoperativeService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class KoperativeController implements IKoperativeController {

    private final IKoperativeService koperativeService;
    private final ICrafterService crafterService;
    private final IGuichetService guichetService;
    private final IChauffeurService chauffeurService;

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Koperative>> findKoperatives(KoperativeFilter filter) {
        return ResponseEntity.ok(koperativeService.findKoperatives(filter));
    }

    @Override
    public ResponseEntity<Long> countKoperatives() {
        return ResponseEntity.ok(koperativeService.countKoperatives());
    }

    @Override
    public ResponseEntity<Koperative> createKoperative(Koperative koperative) {
        return ResponseEntity.ok(koperativeService.save(koperative));
    }

    @Override
    public ResponseEntity<Koperative> getKoperativeById(Long id) {
        return ResponseEntity.ok(koperativeService.findById(id));
    }

    @Override
    public ResponseEntity<Koperative> getKoperativeBySlug(String slug) {
        return koperativeService.findBySlug(slug).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Koperative> updateKoperative(Long id, Koperative koperative) {
        koperative.setId(id);
        return ResponseEntity.ok(koperativeService.save(koperative));
    }

    @Override
    public ResponseEntity<Void> deleteKoperative(Long id) {
        koperativeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Ville>> getVilles(Long id) {
        return ResponseEntity.ok(koperativeService.getVilles(id));
    }

    @Override
    public ResponseEntity<Koperative> setVilles(Long id, List<Ville> villes) {
        return ResponseEntity.ok(koperativeService.setVilles(id, villes));
    }

    @Override
    public ResponseEntity<List<Crafter>> getCrafters(Long id) {
        return ResponseEntity.ok(crafterService.findByKoperativeId(id));
    }

    @Override
    public ResponseEntity<List<Guichet>> getGuichets(Long id) {
        return ResponseEntity.ok(guichetService.findByKoperativeId(id));
    }

    @Override
    public ResponseEntity<List<Chauffeur>> getChauffeurs(Long id) {
        return ResponseEntity.ok(chauffeurService.findByKoperativeId(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<Koperative>> getFavoriteKoperatives(Long voyageurId) {
        return ResponseEntity.ok(koperativeService.findFavoriteKoperatives(voyageurId));
    }
}
