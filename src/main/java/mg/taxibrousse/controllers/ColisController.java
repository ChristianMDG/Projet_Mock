package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.models.Colis;
import mg.taxibrousse.services.IColisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colis")
@RequiredArgsConstructor
public class ColisController {

    private final IColisService colisService;

    @GetMapping
    public List<Colis> listAllColis() {
        return colisService.findAll();
    }

    @GetMapping("/{id}")
    public Colis getColis(@PathVariable Long id) {
        return colisService.findById(id);
    }

    @GetMapping("/status/{status}")
    public List<Colis> listColisByStatus(@PathVariable ColisStatusEnum status) {
        return colisService.findByStatus(status);
    }

    @GetMapping("/crafter/{crafterId}")
    public List<Colis> listColisByCrafter(@PathVariable Long crafterId) {
        return colisService.findByCrafterId(crafterId);
    }

    @GetMapping("/voyage/{voyageId}")
    public List<Colis> listColisByVoyage(@PathVariable Long voyageId) {
        return colisService.findByVoyageId(voyageId);
    }

    @GetMapping("/koperative/{koperativeId}")
    public List<Colis> listColisByKoperative(@PathVariable Long koperativeId) {
        return colisService.findByKoperativeId(koperativeId);
    }

    @PostMapping
    public Colis createColis(@RequestBody Colis colis) {
        return colisService.save(colis);
    }

    @PutMapping("/{id}")
    public Colis updateColis(@PathVariable Long id, @RequestBody Colis colis) {
        colis.setId(id);
        return colisService.save(colis);
    }

    @DeleteMapping("/{id}")
    public void deleteColis(@PathVariable Long id) {
        colisService.deleteById(id);
    }
}
