package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.search.GlobalSearchResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IGlobalSearchController {

    @GetMapping
    ResponseEntity<GlobalSearchResponse> search(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "8") int limit);

    @PostMapping("/reindex")
    ResponseEntity<Void> reindex();

    @PostMapping("/reindex/voyages")
    ResponseEntity<Void> reindexVoyages();
}
