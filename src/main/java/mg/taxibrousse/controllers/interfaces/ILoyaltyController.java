package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.LoyaltyConfig;
import mg.taxibrousse.models.LoyaltyView;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ILoyaltyController {

    @GetMapping("/{voyageurId}")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<LoyaltyView> getLoyaltyView(@PathVariable Long voyageurId);

    @GetMapping("/config")
    ResponseEntity<LoyaltyConfig> getConfig();

    @PutMapping("/config")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<LoyaltyConfig> updateConfig(@RequestBody LoyaltyConfig config);
}
