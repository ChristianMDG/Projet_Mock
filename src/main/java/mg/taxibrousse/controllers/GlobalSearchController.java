package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IGlobalSearchController;
import mg.taxibrousse.dto.search.GlobalSearchResponse;
import mg.taxibrousse.services.IGlobalSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GlobalSearchController implements IGlobalSearchController {

    private final IGlobalSearchService globalSearchService;

    @Override
    public ResponseEntity<GlobalSearchResponse> search(String query, String category, int limit) {
        return ResponseEntity.ok(globalSearchService.search(query, category, limit));
    }

    @Override
    public ResponseEntity<Void> reindex() {
        globalSearchService.rebuildIndex();
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> reindexVoyages() {
        globalSearchService.reindexVoyages();
        return ResponseEntity.ok().build();
    }
}
