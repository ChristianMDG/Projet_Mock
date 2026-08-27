package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductImageEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.ProductImage;
import mg.taxibrousse.repositories.IProductImageRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.services.IProductImageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductImageService implements IProductImageService {

    private final IProductImageRepository imageRepository;
    private final IProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductImage> findByProductId(Long productId) {
        return imageRepository.findByProductIdOrderByDisplayOrderAsc(productId).stream().map(ProductImage::fromEntity).toList();
    }

    @Override
    @Transactional
    public ProductImage addImage(Long productId, ProductImage request) {
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        boolean markPrimary = Boolean.TRUE.equals(request.getIsPrimary());
        if (markPrimary) {
            imageRepository.clearPrimaryForProduct(productId);
        }
        ProductImage model = ProductImage.builder()
                .productId(productId)
                .url(request.getUrl())
                .altText(request.getAltText())
                .displayOrder(Optional.ofNullable(request.getDisplayOrder()).orElse(0))
                .isPrimary(markPrimary)
                .build();
        ProductImageEntity entity = model.toEntity();
        entity.setProduct(product);
        return ProductImage.fromEntity(imageRepository.save(entity));
    }

    @Override
    @Transactional
    public ProductImage setPrimary(Long productId, Long imageId) {
        ProductImageEntity image = imageRepository.findById(imageId).orElseThrow(() -> new EntityNotFoundException("Image not found: " + imageId));
        if (image.getProduct() == null || !productId.equals(image.getProduct().getId())) {
            throw new ShopException("error_image_mismatch", "exception_image_not_belong_to_product");
        }
        imageRepository.clearPrimaryForProduct(productId);
        ProductImage model = ProductImage.fromEntity(image);
        model.setIsPrimary(true);
        image = model.toEntity(image);
        return ProductImage.fromEntity(imageRepository.save(image));
    }

    @Override
    @Transactional
    public void deleteImage(Long productId, Long imageId) {
        ProductImageEntity image = imageRepository.findById(imageId).orElseThrow(() -> new EntityNotFoundException("Image not found: " + imageId));
        if (image.getProduct() == null || !productId.equals(image.getProduct().getId())) {
            throw new ShopException("error_image_mismatch", "exception_image_not_belong_to_product");
        }
        imageRepository.deleteById(imageId);
    }
}
