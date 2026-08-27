package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ICategoryController;
import mg.taxibrousse.models.Category;
import mg.taxibrousse.services.ICategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController implements ICategoryController {

    private final ICategoryService categoryService;

    @Override
    public ResponseEntity<List<Category>> listCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @Override
    public ResponseEntity<List<Category>> getCategoryTree() {
        return ResponseEntity.ok(categoryService.findTree());
    }

    @Override
    public ResponseEntity<Category> getCategory(Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @Override
    public ResponseEntity<Category> createCategory(Category request) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    @Override
    public ResponseEntity<Category> updateCategory(Long id, Category request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @Override
    public ResponseEntity<Void> deleteCategory(Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
