package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.*;
import mg.taxibrousse.params.KoperativeFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/koperatives")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IKoperativeController {

    @GetMapping
    ResponseEntity<List<Koperative>> findKoperatives(@ModelAttribute KoperativeFilter filter);

    @GetMapping("/count")
    ResponseEntity<Long> countKoperatives();

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATEUR')")
    ResponseEntity<Koperative> createKoperative(@RequestBody Koperative koperative);

    @GetMapping("/{id}")
    ResponseEntity<Koperative> getKoperativeById(@PathVariable Long id);

    @PutMapping("/{id}")
    ResponseEntity<Koperative> updateKoperative(@PathVariable Long id, @RequestBody Koperative koperative);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<Void> deleteKoperative(@PathVariable Long id);

    @GetMapping("/{id}/villes")
    ResponseEntity<List<Ville>> getVilles(@PathVariable Long id);

    @PutMapping("/{id}/villes")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<Koperative> setVilles(@PathVariable Long id, @RequestBody List<Ville> villes);

    @GetMapping("/{id}/crafters")
    ResponseEntity<List<Crafter>> getCrafters(@PathVariable Long id);

    @GetMapping("/{id}/guichets")
    ResponseEntity<List<Guichet>> getGuichets(@PathVariable Long id);

    @GetMapping("/{id}/chauffeurs")
    ResponseEntity<List<Chauffeur>> getChauffeurs(@PathVariable Long id);

    @GetMapping("/favorites/{voyageurId}")
    ResponseEntity<List<Koperative>> getFavoriteKoperatives(@PathVariable Long voyageurId);
}
