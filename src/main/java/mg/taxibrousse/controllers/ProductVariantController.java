package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IProductVariantController;
import mg.taxibrousse.models.ProductVariant;
import mg.taxibrousse.services.IProductVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductVariantController implements IProductVariantController {

    private final IProductVariantService variantService;

    @Override
    public ResponseEntity<List<ProductVariant>> listVariants(Long productId) {
        return ResponseEntity.ok(variantService.listByProduct(productId));
    }

    @Override
    public ResponseEntity<ProductVariant> createVariant(Long productId, ProductVariant request) {
        return ResponseEntity.ok(variantService.create(productId, request));
    }

    @Override
    public ResponseEntity<ProductVariant> updateVariant(Long productId, Long variantId, ProductVariant request) {
        return ResponseEntity.ok(variantService.update(productId, variantId, request));
    }

    @Override
    public ResponseEntity<Void> deleteVariant(Long productId, Long variantId) {
        variantService.delete(productId, variantId);
        return ResponseEntity.noContent().build();
    }
}
