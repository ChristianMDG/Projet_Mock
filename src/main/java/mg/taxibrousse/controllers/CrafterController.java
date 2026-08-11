package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Crafter;
import mg.taxibrousse.services.ICrafterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crafters")
@RequiredArgsConstructor
public class CrafterController {

    private final ICrafterService crafterService;

    @GetMapping("/{id}")
    public Crafter getCrafterById(@PathVariable Long id) {
        return crafterService.findById(id);
    }

    @GetMapping("/koperative/{koperativeId}")
    public List<Crafter> listCraftersByKoperative(@PathVariable Long koperativeId) {
        return crafterService.findByKoperativeId(koperativeId);
    }

    @GetMapping("/active")
    public List<Crafter> listActiveCrafters() {
        return crafterService.findByIsActive(true);
    }

    @GetMapping("/inactive")
    public List<Crafter> listInactiveCrafters() {
        return crafterService.findByIsActive(false);
    }

    @PostMapping
    public Crafter createCrafter(@RequestBody Crafter crafter) {
        return crafterService.save(crafter);
    }

    @PutMapping("/{id}")
    public Crafter updateCrafter(@PathVariable Long id, @RequestBody Crafter crafter) {
        crafter.setId(id);
        return crafterService.save(crafter);
    }

    @DeleteMapping("/{id}")
    public void deleteCrafter(@PathVariable Long id) {
        crafterService.deleteById(id);
    }

    @GetMapping("/{id}/seat-config")
    public Object getCrafterSeatConfig(@PathVariable Long id) {
        return crafterService.getSeatConfigById(id);
    }
}
