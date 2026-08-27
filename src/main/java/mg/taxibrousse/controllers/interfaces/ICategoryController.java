package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.models.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ICategoryController {

    @GetMapping
    ResponseEntity<List<Category>> listCategories();

    @GetMapping("/tree")
    ResponseEntity<List<Category>> getCategoryTree();

    @GetMapping("/{id}")
    ResponseEntity<Category> getCategory(@PathVariable Long id);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Category> createCategory(@Valid @RequestBody Category request);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category request);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteCategory(@PathVariable Long id);
}
