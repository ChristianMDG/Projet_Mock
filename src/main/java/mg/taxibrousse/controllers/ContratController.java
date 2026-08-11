package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Contrat;
import mg.taxibrousse.services.IContratService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final IContratService contratService;

    @GetMapping
    public List<Contrat> getAllContrats() {
        return contratService.getAllContrats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrat> getContratById(@PathVariable Long id) {
        Contrat contrat = contratService.getContratById(id);
        if (contrat != null) {
            return ResponseEntity.ok(contrat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Contrat createContrat(@RequestBody Contrat contrat) {
        return contratService.createContrat(contrat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrat> updateContrat(@PathVariable Long id, @RequestBody Contrat contrat) {
        Contrat updated = contratService.updateContrat(id, contrat);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrat(@PathVariable Long id) {
        if (contratService.deleteContrat(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
