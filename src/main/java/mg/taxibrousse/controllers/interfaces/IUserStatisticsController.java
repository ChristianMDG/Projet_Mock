package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.UserStatistics;
import mg.taxibrousse.models.Voyageur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-statistics")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'GUICHET')")
public interface IUserStatisticsController {

    @GetMapping
    ResponseEntity<UserStatistics> getUserStatistics();

    @GetMapping("/voyageurs")
    ResponseEntity<Page<Voyageur>> getAllVoyageurs(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean isActive,
        Pageable pageable
    );

    @PutMapping("/voyageurs/{id}/toggle-status")
    ResponseEntity<Voyageur> toggleVoyageurStatus(@PathVariable Long id);
}
