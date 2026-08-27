package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Ville;
import mg.taxibrousse.services.IVilleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/villes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class VilleController {

    private final IVilleService villeService;

    @PostMapping
    public Ville createVille(@RequestBody Ville ville) {
        return villeService.save(ville);
    }

    @GetMapping
    public List<Ville> getAllVilles() {
        return villeService.findAll();
    }

    @GetMapping("/top")
    public List<Ville> getTop20Villes() {
        return villeService.getTop20Villes();
    }

    @GetMapping("/search")
    public List<Ville> searchVilles(@RequestParam String keyword) {
        return villeService.findByKeyword(keyword);
    }

    @GetMapping("/{id}")
    public Ville getVilleById(@PathVariable Long id) {
        return villeService.findById(id);
    }

    @PutMapping("/{id}")
    public Ville updateVille(@PathVariable Long id, @RequestBody Ville ville) {
        ville.setId(id);
        return villeService.save(ville);
    }

    @DeleteMapping("/{id}")
    public void deleteVille(@PathVariable Long id) {
        villeService.deleteById(id);
    }
}
