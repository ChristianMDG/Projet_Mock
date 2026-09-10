package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.ProductSearchParams;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.models.ProductRoute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {

    Page<Product> findAll(Pageable pageable);

    Page<Product> findByPriceGreaterThanZero(Pageable pageable);

    Page<Product> search(ProductSearchParams params, Pageable pageable);

    Product findById(Long id);

    Product findBySlug(String slug);

    Product create(Product request);

    Product update(Long id, Product request);

    void deleteById(Long id);

    List<Product> findByVoyageRoute(String routeSlug);

    List<ProductRoute> findRoutesForProduct(Long productId);

    ProductRoute linkProductRoute(Long productId, ProductRoute request);

    void unlinkProductRoute(Long productId, Long routeId);
}
