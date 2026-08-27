package mg.taxibrousse.controllers.interfaces;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.models.Colis;

@RestController
@RequestMapping("/api/colis")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IColisController {

    @GetMapping
    ResponseEntity<List<Colis>> listAllColis();

    @GetMapping("/{id}")
    ResponseEntity<Colis> getColis(@PathVariable Long id);

    @GetMapping("/status/{status}")
    ResponseEntity<List<Colis>> listColisByStatus(@PathVariable ColisStatusEnum status);

    @GetMapping("/crafter/{crafterId}")
    ResponseEntity<List<Colis>> listColisByCrafter(@PathVariable Long crafterId);

    @GetMapping("/voyage/{voyageId}")
    ResponseEntity<List<Colis>> listColisByVoyage(@PathVariable Long voyageId);

    @GetMapping("/koperative/{koperativeId}")
    ResponseEntity<List<Colis>> listColisByKoperative(@PathVariable Long koperativeId);

    @GetMapping("/filtered")
    ResponseEntity<List<Colis>> listFilteredColis(@RequestParam Long voyageId, @RequestParam String search);

    @PostMapping
    ResponseEntity<Colis> createColis(@RequestBody Colis colis);

    @PutMapping("/{id}")
    ResponseEntity<Colis> updateColis(@PathVariable Long id, @RequestBody Colis colis);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteColis(@PathVariable Long id);
}