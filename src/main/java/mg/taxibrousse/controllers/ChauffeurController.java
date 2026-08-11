package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Chauffeur;
import mg.taxibrousse.services.IChauffeurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs")
@RequiredArgsConstructor
public class ChauffeurController {

    private final IChauffeurService chauffeurService;

    @GetMapping
    public List<Chauffeur> listAllChauffeurs() {
        return chauffeurService.findAll();
    }

    @GetMapping("/{id}")
    public Chauffeur getChauffeur(@PathVariable Long id) {
        return chauffeurService.findById(id);
    }

    @GetMapping("/available")
    public List<Chauffeur> listAvailableChauffeurs() {
        return chauffeurService.findByIsAvailable(true);
    }

    @PostMapping
    public Chauffeur createChauffeur(@RequestBody Chauffeur chauffeur) {
        return chauffeurService.save(chauffeur);
    }

    @PutMapping("/{id}")
    public Chauffeur updateChauffeur(@PathVariable Long id, @RequestBody Chauffeur chauffeur) {
        chauffeur.setId(id);
        return chauffeurService.save(chauffeur);
    }

    @DeleteMapping("/{id}")
    public void deleteChauffeur(@PathVariable Long id) {
        chauffeurService.deleteById(id);
    }
}
