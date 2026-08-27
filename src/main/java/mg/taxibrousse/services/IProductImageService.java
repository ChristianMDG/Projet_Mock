package mg.taxibrousse.services;

import mg.taxibrousse.models.ProductImage;

import java.util.List;

public interface IProductImageService {

    List<ProductImage> findByProductId(Long productId);

    ProductImage addImage(Long productId, ProductImage request);

    ProductImage setPrimary(Long productId, Long imageId);

    void deleteImage(Long productId, Long imageId);
}
