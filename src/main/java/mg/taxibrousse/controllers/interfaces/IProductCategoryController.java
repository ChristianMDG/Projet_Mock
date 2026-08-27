package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.CategoryReorderRequest;
import mg.taxibrousse.models.ProductCategory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IProductCategoryController {

    @GetMapping
    ResponseEntity<List<ProductCategory>> listCategories();

    @GetMapping("/by-category/{categoryId}")
    ResponseEntity<List<ProductCategory>> listByCategory(@PathVariable Long categoryId);

    @GetMapping("/{id}")
    ResponseEntity<ProductCategory> getCategory(@PathVariable Long id);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductCategory> createCategory(@Valid @RequestBody ProductCategory request);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<ProductCategory> updateCategory(@PathVariable Long id, @Valid @RequestBody ProductCategory request);

    @PutMapping("/reorder")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> reorderCategories(@RequestBody CategoryReorderRequest request);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteCategory(@PathVariable Long id);
}
