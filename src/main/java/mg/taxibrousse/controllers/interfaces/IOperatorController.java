package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.UserOperator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operators")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAnyAuthority('ADMIN')")
public interface IOperatorController {

    @GetMapping
    ResponseEntity<List<UserOperator>> getOperators(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long koperativeId,
        @RequestParam(required = false) Boolean isActive,
        @RequestParam(required = false) Long gareId
    );

    @GetMapping("/{id}")
    ResponseEntity<UserOperator> getOperatorById(@PathVariable Long id);

    /**
     * Set the single departure gare for this operator, and optionally the primary koperative.
     * Body: { "gareId": 1, "koperativeId": 2 }
     */
    @PutMapping("/{id}/assign-gare")
    ResponseEntity<UserOperator> assignGare(@PathVariable Long id, @RequestBody Map<String, Long> body);

    /**
     * Assign multiple koperatives to an operator (replaces the list).
     * Body: { "koperativeIds": [1, 2, 3] }
     */
    @PutMapping("/{id}/assign-koperatives")
    ResponseEntity<UserOperator> assignKoperatives(@PathVariable Long id, @RequestBody Map<String, List<Long>> body);
}
