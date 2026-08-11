package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.Gare;
import mg.taxibrousse.params.GareFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gares")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IGareController {

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<Gare> createGare(@RequestBody Gare gare);

    @GetMapping
    ResponseEntity<List<Gare>> getAllGares(@ModelAttribute GareFilter filter);

    @GetMapping("/{id}")
    ResponseEntity<Gare> getGareById(@PathVariable Long id);

    @GetMapping("/ville/{villeId}")
    ResponseEntity<List<Gare>> getGaresByVilleId(@PathVariable Long villeId);

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<Gare> updateGare(@PathVariable Long id, @RequestBody Gare gare);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ResponseEntity<Void> deleteGare(@PathVariable Long id);
}
