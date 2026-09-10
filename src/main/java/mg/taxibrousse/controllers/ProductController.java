package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IProductController;
import mg.taxibrousse.dto.shop.BulkImportResult;
import mg.taxibrousse.dto.shop.ProductSearchParams;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.models.ProductRoute;
import mg.taxibrousse.services.IProductImportService;
import mg.taxibrousse.services.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController implements IProductController {

    private final IProductService productService;
    private final IProductImportService productImportService;

    @Override
    public ResponseEntity<Page<Product>> listProducts(ProductSearchParams params, Pageable pageable) {
        return ResponseEntity.ok(productService.search(params, pageable));
    }

    @Override
    public ResponseEntity<Page<Product>> searchProducts(ProductSearchParams params, Pageable pageable) {
        return ResponseEntity.ok(productService.search(params, pageable));
    }

    @Override
    public ResponseEntity<Product> getProduct(Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @Override
    public ResponseEntity<Product> getProductBySlug(String slug) {
        return ResponseEntity.ok(productService.findBySlug(slug));
    }

    @Override
    public ResponseEntity<List<Product>> getProductsByVoyageRoute(String routeSlug) {
        if (StringUtils.hasText(routeSlug)) {
            return ResponseEntity.ok(productService.findByVoyageRoute(routeSlug));
        }
        return ResponseEntity.badRequest().build();
    }

    @Override
    public ResponseEntity<Product> createProduct(Product request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @Override
    public ResponseEntity<Product> updateProduct(Long id, Product request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @Override
    public ResponseEntity<Void> deleteProduct(Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<BulkImportResult> importProducts(MultipartFile file, boolean dryRun) {
        return ResponseEntity.ok(productImportService.importCsv(file, dryRun));
    }

    @Override
    public ResponseEntity<List<ProductRoute>> listProductRoutes(Long productId) {
        return ResponseEntity.ok(productService.findRoutesForProduct(productId));
    }

    @Override
    public ResponseEntity<ProductRoute> linkProductRoute(Long productId, ProductRoute request) {
        return ResponseEntity.ok(productService.linkProductRoute(productId, request));
    }

    @Override
    public ResponseEntity<Void> unlinkProductRoute(Long productId, Long routeId) {
        productService.unlinkProductRoute(productId, routeId);
        return ResponseEntity.noContent().build();
    }
}
