package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.BulkImportResult;
import mg.taxibrousse.dto.shop.ProductSearchParams;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.models.ProductRoute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IProductController {

    @GetMapping
    ResponseEntity<Page<Product>> listProducts(@PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/search")
    ResponseEntity<Page<Product>> searchProducts(@ModelAttribute ProductSearchParams params, @PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/{id}")
    ResponseEntity<Product> getProduct(@PathVariable Long id);

    @GetMapping("/slug/{slug}")
    ResponseEntity<Product> getProductBySlug(@PathVariable("slug") String slug);

    @GetMapping("/by-voyage-route")
    ResponseEntity<List<Product>> getProductsByVoyageRoute(@RequestParam("route") String routeSlug);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Product> createProduct(@Valid @RequestBody Product request);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product request);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteProduct(@PathVariable Long id);

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<BulkImportResult> importProducts(@RequestPart("file") MultipartFile file, @RequestParam(name = "dryRun", defaultValue = "false") boolean dryRun);

    @GetMapping("/{productId}/routes")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<List<ProductRoute>> listProductRoutes(@PathVariable Long productId);

    @PostMapping("/{productId}/routes")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductRoute> linkProductRoute(@PathVariable Long productId, @Valid @RequestBody ProductRoute request);

    @DeleteMapping("/{productId}/routes/{routeId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> unlinkProductRoute(@PathVariable Long productId, @PathVariable Long routeId);
}
