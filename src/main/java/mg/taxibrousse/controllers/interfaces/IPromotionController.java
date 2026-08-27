package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.PromotionValidationResponse;
import mg.taxibrousse.dto.shop.ValidatePromotionRequest;
import mg.taxibrousse.models.Promotion;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IPromotionController {

    @GetMapping
    ResponseEntity<List<Promotion>> listActive();

    @GetMapping("/{id}")
    ResponseEntity<Promotion> getById(@PathVariable Long id);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Promotion> create(@Valid @RequestBody Promotion request);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Promotion> update(@PathVariable Long id, @Valid @RequestBody Promotion request);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> delete(@PathVariable Long id);

    @PostMapping("/validate")
    ResponseEntity<PromotionValidationResponse> validate(Authentication authentication, @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken,
            @Valid @RequestBody ValidatePromotionRequest request);
}
