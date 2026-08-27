package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IRecommendationController {

    @GetMapping("/products/{id}/related")
    ResponseEntity<List<Product>> getRelatedProducts(@PathVariable Long id, @RequestParam(defaultValue = "8") int limit);

    @GetMapping("/products/{id}/frequently-bought-together")
    ResponseEntity<List<Product>> getFrequentlyBoughtTogether(@PathVariable Long id, @RequestParam(defaultValue = "6") int limit);

    @GetMapping("/recommendations/personalized")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<Product>> getPersonalizedRecommendations(Authentication authentication, @RequestParam(defaultValue = "12") int limit);
}
