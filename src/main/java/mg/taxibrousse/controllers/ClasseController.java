package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IClasseController;
import mg.taxibrousse.models.Classe;
import mg.taxibrousse.services.IClasseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ClasseController implements IClasseController {

    private final IClasseService classeService;

    @Override
    public ResponseEntity<List<Classe>> getAllClasses() {
        return ResponseEntity.ok(classeService.findAll());
    }

    @Override
    public ResponseEntity<List<Classe>> getClassesByKoperative(Long koperativeId) {
        return ResponseEntity.ok(classeService.findByKoperativeId(koperativeId));
    }

    @Override
    public ResponseEntity<Classe> createClasse(Classe classe) {
        return ResponseEntity.ok(classeService.create(classe));
    }

    @Override
    public ResponseEntity<Classe> updateClasse(Long id, Classe classe) {
        return ResponseEntity.ok(classeService.update(id, classe));
    }

    @Override
    public ResponseEntity<Void> deleteClasse(Long id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
