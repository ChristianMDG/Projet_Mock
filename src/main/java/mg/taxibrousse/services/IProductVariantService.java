package mg.taxibrousse.services;

import mg.taxibrousse.models.ProductVariant;

import java.util.List;

public interface IProductVariantService {

    List<ProductVariant> listByProduct(Long productId);

    ProductVariant create(Long productId, ProductVariant request);

    ProductVariant update(Long productId, Long variantId, ProductVariant request);

    void delete(Long productId, Long variantId);
}
