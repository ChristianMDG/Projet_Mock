package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IProductCategoryController;
import mg.taxibrousse.dto.shop.CategoryReorderRequest;
import mg.taxibrousse.models.ProductCategory;
import mg.taxibrousse.services.IProductCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductCategoryController implements IProductCategoryController {

    private final IProductCategoryService categoryService;

    @Override
    public ResponseEntity<List<ProductCategory>> listCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @Override
    public ResponseEntity<List<ProductCategory>> listByCategory(Long categoryId) {
        return ResponseEntity.ok(categoryService.findByCategoryId(categoryId));
    }

    @Override
    public ResponseEntity<ProductCategory> getCategory(Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @Override
    public ResponseEntity<ProductCategory> createCategory(ProductCategory request) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    @Override
    public ResponseEntity<ProductCategory> updateCategory(Long id, ProductCategory request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @Override
    public ResponseEntity<Void> reorderCategories(CategoryReorderRequest request) {
        categoryService.reorder(request);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> deleteCategory(Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
