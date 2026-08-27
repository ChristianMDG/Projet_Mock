package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.ProductVariant;
import mg.taxibrousse.repositories.IInventoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IProductVariantRepository;
import mg.taxibrousse.services.IProductVariantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProductVariantService implements IProductVariantService {

    private final IProductVariantRepository variantRepository;
    private final IProductRepository productRepository;
    private final IInventoryRepository inventoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductVariant> listByProduct(Long productId) {
        return variantRepository.findByProductId(productId).stream().map(ProductVariant::fromEntity).toList();
    }

    @Override
    @Transactional
    public ProductVariant create(Long productId, ProductVariant request) {
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

        if (variantRepository.existsBySku(request.getSku())) {
            throw new ShopException("error_variant_sku_taken", "exception_variant_sku_taken");
        }

        Map<String, Object> attrs = request.getAttributes() != null ? request.getAttributes() : new HashMap<>();
        if (hasDuplicateAttributes(productId, null, attrs)) {
            throw new ShopException("error_variant_attributes_duplicate", "exception_variant_attributes_duplicate");
        }

        ProductVariantEntity variant = new ProductVariantEntity();
        variant.setProduct(product);
        variant.setSku(request.getSku());
        variant.setAttributes(attrs);
        variant.setPriceOverride(request.getPriceOverride());
        variant.setStock(request.getStock() != null ? request.getStock() : 0);
        ProductVariantEntity saved = variantRepository.save(variant);

        // Create linked inventory row with quantity 0.
        InventoryEntity inventory = new InventoryEntity();
        inventory.setProduct(product);
        inventory.setVariant(saved);
        inventory.setQuantity(0);
        inventory.setReserved(0);
        inventoryRepository.save(inventory);

        return ProductVariant.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductVariant update(Long productId, Long variantId, ProductVariant request) {
        ProductVariantEntity variant = loadVariant(productId, variantId);
        applySku(variant, request);
        applyAttributes(variant, request, productId, variantId);
        applyPriceOverride(variant, request);
        applyStock(variant, request);
        return ProductVariant.fromEntity(variantRepository.save(variant));
    }

    private void applySku(ProductVariantEntity variant, ProductVariant request) {
        if (request.getSku() == null) {
            return;
        }
        if (request.getSku().equals(variant.getSku())) {
            return;
        }
        if (variantRepository.existsBySku(request.getSku())) {
            throw new ShopException("error_variant_sku_taken", "exception_variant_sku_taken");
        }
        variant.setSku(request.getSku());
    }

    private void applyAttributes(ProductVariantEntity variant, ProductVariant request, Long productId, Long variantId) {
        if (request.getAttributes() == null) {
            return;
        }
        if (hasDuplicateAttributes(productId, variantId, request.getAttributes())) {
            throw new ShopException("error_variant_attributes_duplicate", "exception_variant_attributes_duplicate");
        }
        variant.setAttributes(request.getAttributes());
    }

    private void applyPriceOverride(ProductVariantEntity variant, ProductVariant request) {
        if (request.getPriceOverride() == null) {
            return;
        }
        variant.setPriceOverride(request.getPriceOverride());
    }

    private void applyStock(ProductVariantEntity variant, ProductVariant request) {
        if (request.getStock() == null) {
            return;
        }
        variant.setStock(request.getStock());
    }

    @Override
    @Transactional
    public void delete(Long productId, Long variantId) {
        ProductVariantEntity variant = loadVariant(productId, variantId);
        variantRepository.delete(variant);
    }

    private ProductVariantEntity loadVariant(Long productId, Long variantId) {
        ProductVariantEntity variant = variantRepository.findById(variantId).orElseThrow(() -> new EntityNotFoundException("Variant not found: " + variantId));
        boolean belongsToProduct = variant.getProduct() != null && Objects.equals(variant.getProduct().getId(), productId);
        if (belongsToProduct) {
            return variant;
        }
        throw new ShopException("error_variant_product_mismatch", "exception_variant_product_mismatch");
    }

    private boolean hasDuplicateAttributes(Long productId, Long excludeVariantId, Map<String, Object> attrs) {
        List<ProductVariantEntity> existing = variantRepository.findByProductId(productId);
        for (ProductVariantEntity v : existing) {
            if (excludeVariantId != null && Objects.equals(v.getId(), excludeVariantId)) {
                continue;
            }
            if (attributesEqual(v.getAttributes(), attrs)) {
                return true;
            }
        }
        return false;
    }

    private boolean attributesEqual(Map<String, Object> a, Map<String, Object> b) {
        Map<String, Object> left = a != null ? a : Map.of();
        Map<String, Object> right = b != null ? b : Map.of();
        if (left.size() != right.size()) {
            return false;
        }
        for (Map.Entry<String, Object> entry : left.entrySet()) {
            if (!right.containsKey(entry.getKey())) {
                return false;
            }
            if (!Objects.equals(String.valueOf(entry.getValue()), String.valueOf(right.get(entry.getKey())))) {
                return false;
            }
        }
        return true;
    }
}
