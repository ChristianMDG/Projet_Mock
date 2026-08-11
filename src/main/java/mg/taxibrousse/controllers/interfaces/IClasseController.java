package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.Classe;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IClasseController {

    @GetMapping
    ResponseEntity<List<Classe>> getAllClasses();

    @GetMapping("/koperative/{koperativeId}")
    ResponseEntity<List<Classe>> getClassesByKoperative(@PathVariable Long koperativeId);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Classe> createClasse(@RequestBody Classe classe);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Classe> updateClasse(@PathVariable Long id, @RequestBody Classe classe);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteClasse(@PathVariable Long id);
}
