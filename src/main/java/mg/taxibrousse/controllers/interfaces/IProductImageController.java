package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.models.ProductImage;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IProductImageController {

    @GetMapping("/{productId}/images")
    ResponseEntity<List<ProductImage>> listImages(@PathVariable Long productId);

    @PostMapping("/{productId}/images")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductImage> addImage(@PathVariable Long productId, @Valid @RequestBody ProductImage request);

    @PutMapping("/{productId}/images/{imageId}/primary")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductImage> setPrimary(@PathVariable Long productId, @PathVariable Long imageId);

    @DeleteMapping("/{productId}/images/{imageId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteImage(@PathVariable Long productId, @PathVariable Long imageId);
}
