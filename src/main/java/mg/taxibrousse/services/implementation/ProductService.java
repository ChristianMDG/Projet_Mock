package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.shop.ProductSearchParams;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductRouteEntity;
import mg.taxibrousse.entities.RouteEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.models.ProductRoute;
import mg.taxibrousse.repositories.IProductCategoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IProductRouteRepository;
import mg.taxibrousse.repositories.IRouteRepository;
import mg.taxibrousse.repositories.specs.ProductSpecifications;
import mg.taxibrousse.services.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private static final int MAX_PAGE_SIZE = 100;

    private final IProductRepository productRepository;
    private final IProductCategoryRepository categoryRepository;
    private final IProductRouteRepository productRouteRepository;
    private final IRouteRepository routeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(Product::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> search(ProductSearchParams params, Pageable pageable) {
        Specification<ProductEntity> spec = ProductSpecifications.build(params);
        Pageable effective = capAndSort(pageable, params);
        return productRepository.findAll(spec, effective).map(Product::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Product findById(Long id) {
        ProductEntity entity = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        return Product.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Product findBySlug(String slug) {
        ProductEntity entity = productRepository.findFirstBySlug(slug).orElseThrow(() -> new EntityNotFoundException("Product not found: " + slug));
        return Product.fromEntity(entity);
    }

    @Override
    @Transactional
    public Product create(Product request) {
        validateUnique(request.getSku(), request.getSlug(), null);
        ProductEntity entity = request.toEntity(null);
        if (request.getCategoryId() != null) {
            entity.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId())));
        }
        entity = productRepository.save(entity);
        return Product.fromEntity(entity);
    }

    @Override
    @Transactional
    public Product update(Long id, Product request) {
        ProductEntity entity = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));

        validateUnique(request.getSku(), request.getSlug(), entity.getId());

        request.toEntity(entity);

        if (request.getCategoryId() != null) {
            entity.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId())));
        }

        entity = productRepository.save(entity);
        return Product.fromEntity(entity);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Product not found: " + id);
        }
    }

    /**
     * Lookup products associated with a voyage route identified by its public slug.
     *
     * <p>
     * Backed by the {@code product_route} join table via {@link IProductRouteRepository}.
     * {@code RouteEntity} does not currently expose a dedicated slug column, so the route
     * {@code name} is used as the public slug (see {@code IProductRouteRepository}).
     * </p>
     */
    @Override
    @Transactional(readOnly = true)
    public List<Product> findByVoyageRoute(String routeSlug) {
        return productRouteRepository.findByRoute_NameAndIsActiveTrueOrderByDisplayOrderAsc(routeSlug).stream().map(link -> Product.fromEntity(link.getProduct())).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRoute> findRoutesForProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            return productRouteRepository.findByProduct_IdOrderByDisplayOrderAsc(productId).stream().map(ProductRoute::fromEntity).toList();
        }
        throw new EntityNotFoundException("Product not found: " + productId);
    }

    @Override
    @Transactional
    public ProductRoute linkProductRoute(Long productId, ProductRoute request) {
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        RouteEntity route = routeRepository.findById(request.getRouteId()).orElseThrow(() -> new EntityNotFoundException("Route not found: " + request.getRouteId()));
        if (productRouteRepository.existsByProduct_IdAndRoute_Id(productId, route.getId())) {
            throw new ShopException("error_duplicate_product_route", "exception_duplicate_product_route");
        }
        ProductRouteEntity entity = new ProductRouteEntity();
        entity.setProduct(product);
        entity.setRoute(route);
        entity.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        entity.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);
        entity = productRouteRepository.save(entity);
        return ProductRoute.fromEntity(entity);
    }

    @Override
    @Transactional
    public void unlinkProductRoute(Long productId, Long routeId) {
        if (productRouteRepository.existsByProduct_IdAndRoute_Id(productId, routeId)) {
            productRouteRepository.deleteByProduct_IdAndRoute_Id(productId, routeId);
        } else {
            throw new EntityNotFoundException("ProductRoute link not found for product " + productId + " / route " + routeId);
        }
    }

    private void validateUnique(String sku, String slug, Long currentId) {
        boolean skuExists = productRepository.findFirstBySku(sku).filter(p -> !p.getId().equals(currentId)).isPresent();
        if (skuExists) {
            throw new ShopException("error_duplicate_sku", "exception_duplicate_sku");
        }
        boolean slugExists = productRepository.findFirstBySlug(slug).filter(p -> !p.getId().equals(currentId)).isPresent();
        if (slugExists) {
            throw new ShopException("error_duplicate_slug", "exception_duplicate_slug");
        }
    }

    private Pageable capAndSort(Pageable pageable, ProductSearchParams params) {
        int size = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        int pageNumber = Math.max(0, pageable.getPageNumber());
        Sort sort = resolveSort(params);
        return PageRequest.of(pageNumber, size, sort);
    }

    private Sort resolveSort(ProductSearchParams params) {
        String key = params != null && params.getSort() != null ? params.getSort() : "relevance";
        return switch (key) {
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest", "rating-desc" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> relevanceSort(params);
        };
    }

    private Sort relevanceSort(ProductSearchParams params) {
        boolean hasQuery = params != null && StringUtils.hasText(params.getQ());
        if (hasQuery) {
            return Sort.by(Sort.Direction.DESC, "isFeatured").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return Sort.by(Sort.Direction.DESC, "isFeatured");
    }
}
