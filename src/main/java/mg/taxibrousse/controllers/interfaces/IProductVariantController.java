package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.models.ProductVariant;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IProductVariantController {

    @GetMapping("/{productId}/variants")
    ResponseEntity<List<ProductVariant>> listVariants(@PathVariable Long productId);

    @PostMapping("/{productId}/variants")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductVariant> createVariant(@PathVariable Long productId, @Valid @RequestBody ProductVariant request);

    @PutMapping("/{productId}/variants/{variantId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductVariant> updateVariant(@PathVariable Long productId, @PathVariable Long variantId, @Valid @RequestBody ProductVariant request);

    @DeleteMapping("/{productId}/variants/{variantId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteVariant(@PathVariable Long productId, @PathVariable Long variantId);
}
