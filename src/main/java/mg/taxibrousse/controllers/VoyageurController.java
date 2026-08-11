package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Voyageur;
import mg.taxibrousse.services.IVoyageurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voyageurs")
@RequiredArgsConstructor
public class VoyageurController {

    private final IVoyageurService voyageurService;

    @GetMapping("/search")
    public ResponseEntity<Voyageur> searchVoyageur(
        @RequestParam(required = false) String phone,
        @RequestParam(required = false) String idNumber
    ) {
        if (phone == null && idNumber == null) {
            return ResponseEntity.badRequest().build();
        }

        Voyageur voyageur = voyageurService.findByPhoneOrIdNumber(phone, idNumber);
        return voyageur != null ? ResponseEntity.ok(voyageur) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Voyageur> createVoyageur(@RequestBody Voyageur voyageur) {
        Voyageur saved = voyageurService.save(voyageur);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voyageur> getVoyageur(@PathVariable Long id) {
        Voyageur voyageur = voyageurService.findById(id);
        return voyageur != null ? ResponseEntity.ok(voyageur) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateVoyageur(@PathVariable Long id, @RequestBody Voyageur voyageur) {
        voyageur.setId(id);
        voyageurService.save(voyageur);
        return ResponseEntity.ok().build();
    }
}
