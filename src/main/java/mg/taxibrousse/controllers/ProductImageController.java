package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IProductImageController;
import mg.taxibrousse.models.ProductImage;
import mg.taxibrousse.services.IProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductImageController implements IProductImageController {

    private final IProductImageService imageService;

    @Override
    public ResponseEntity<List<ProductImage>> listImages(Long productId) {
        return ResponseEntity.ok(imageService.findByProductId(productId));
    }

    @Override
    public ResponseEntity<ProductImage> addImage(Long productId, ProductImage request) {
        return ResponseEntity.ok(imageService.addImage(productId, request));
    }

    @Override
    public ResponseEntity<ProductImage> setPrimary(Long productId, Long imageId) {
        return ResponseEntity.ok(imageService.setPrimary(productId, imageId));
    }

    @Override
    public ResponseEntity<Void> deleteImage(Long productId, Long imageId) {
        imageService.deleteImage(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}
