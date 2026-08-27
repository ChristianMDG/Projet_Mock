package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Guichet;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.services.IGuichetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/guichets")
@RequiredArgsConstructor
public class GuichetController {

    private final IGuichetService guichetService;

    @GetMapping("/koperative/{koperativeId}")
    public List<Guichet> listGuichetsByKoperative(@PathVariable Long koperativeId) {
        return guichetService.findByKoperativeId(koperativeId);
    }

    @GetMapping("/gare/{gareId}")
    public List<Guichet> listGuichetsByGare(@PathVariable Long gareId) {
        return guichetService.findByGareId(gareId);
    }

    @PostMapping
    public Guichet createGuichet(@RequestBody Guichet guichet) {
        return guichetService.save(guichet);
    }

    @PutMapping("/{id}")
    public Guichet updateGuichet(@PathVariable Long id, @RequestBody Guichet guichet) {
        guichet.setId(id);
        return guichetService.save(guichet);
    }

    @DeleteMapping("/{id}")
    public void deleteGuichet(@PathVariable Long id) {
        guichetService.deleteById(id);
    }

    @GetMapping("/koperative/{koperativeId}/operateurs")
    public List<UserOperator> listOperatorByKoperative(@PathVariable Long koperativeId) {
        return guichetService.findByKoperativeId(koperativeId).stream().flatMap(guichet -> guichet.getOperateurs() != null ? guichet.getOperateurs().stream() : Stream.empty()).distinct().toList();
    }

    @GetMapping("/{id}/destinations")
    public List<Gare> getGuichetDestinations(@PathVariable Long id) {
        return guichetService.getGuichetDestinations(id);
    }

    @PutMapping("/{id}/destinations")
    public Guichet updateGuichetDestinations(@PathVariable Long id, @RequestBody List<Gare> destinations) {
        return guichetService.updateGuichetDestinations(id, destinations);
    }

    @GetMapping("/gare/{gareId}/koperative/{koperativeId}")
    public Guichet getGuichetByGareAndKoperative(@PathVariable Long gareId, @PathVariable Long koperativeId) {
        return guichetService.findByGareAndKoperativeWithOperateurs(gareId, koperativeId);
    }
}
