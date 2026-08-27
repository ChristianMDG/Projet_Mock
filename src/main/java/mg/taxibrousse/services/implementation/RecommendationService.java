package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.repositories.IOrderRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IWishlistItemRepository;
import mg.taxibrousse.services.IRecommendationService;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService implements IRecommendationService {

    private static final BigDecimal PRICE_DELTA_RATIO = new BigDecimal("0.30");
    private static final Duration TTL_ITEM = Duration.ofMinutes(30);
    private static final Duration TTL_USER = Duration.ofMinutes(10);
    private static final String KEY_RELATED = "rec:related:";
    private static final String KEY_FBT = "rec:fbt:";
    private static final String KEY_PERSONALIZED = "rec:personalized:";

    private final IProductRepository productRepository;
    private final IOrderRepository orderRepository;
    private final IWishlistItemRepository wishlistItemRepository;
    private final ObjectMapper objectMapper;
    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;

    @Override
    @Transactional(readOnly = true)
    public List<Product> findRelatedProducts(Long productId, int limit) {
        int effectiveLimit = normalizeLimit(limit, 8);
        String cacheKey = KEY_RELATED + productId + ":" + effectiveLimit;
        List<Long> cachedIds = readCache(cacheKey);
        if (cachedIds != null) {
            return loadProductsInOrder(cachedIds);
        }

        ProductEntity pivot = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        boolean hasCategory = pivot.getCategory() != null;
        if (!hasCategory) {
            return List.of();
        }

        BigDecimal price = pivot.getPrice();
        BigDecimal delta = price.multiply(PRICE_DELTA_RATIO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal minPrice = price.subtract(delta);
        BigDecimal maxPrice = price.add(delta);

        List<ProductEntity> results = productRepository.findRelatedProducts(productId, pivot.getCategory().getId(), minPrice, maxPrice, price, PageRequest.of(0, effectiveLimit));
        List<Product> response = results.stream().map(Product::fromEntity).toList();
        writeCache(cacheKey, results.stream().map(ProductEntity::getId).toList(), TTL_ITEM);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findFrequentlyBoughtTogether(Long productId, int limit) {
        int effectiveLimit = normalizeLimit(limit, 6);
        String cacheKey = KEY_FBT + productId + ":" + effectiveLimit;
        List<Long> cachedIds = readCache(cacheKey);
        if (cachedIds != null) {
            return loadProductsInOrder(cachedIds);
        }

        boolean productExists = productRepository.existsById(productId);
        if (!productExists) {
            throw new EntityNotFoundException("Product not found: " + productId);
        }

        List<Long> ids = orderRepository.findFrequentlyBoughtTogetherProductIds(productId, PageRequest.of(0, effectiveLimit));
        List<Product> response = loadProductsInOrder(ids);
        writeCache(cacheKey, ids, TTL_ITEM);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findPersonalizedRecommendations(Long userAccountId, int limit) {
        int effectiveLimit = normalizeLimit(limit, 12);
        String cacheKey = KEY_PERSONALIZED + userAccountId + ":" + effectiveLimit;
        List<Long> cachedIds = readCache(cacheKey);
        if (cachedIds != null) {
            return loadProductsInOrder(cachedIds);
        }

        List<Long> purchasedCategoryIds = orderRepository.findTopPurchasedCategoryIdsByUser(userAccountId, PageRequest.of(0, 10));
        List<Long> wishlistCategoryIds = wishlistItemRepository.findWishlistCategoryIdsByUser(userAccountId);
        List<Long> purchasedProductIds = orderRepository.findPurchasedProductIdsByUser(userAccountId);
        List<Long> wishlistProductIds = wishlistItemRepository.findWishlistProductIdsByUser(userAccountId);

        Map<Long, Integer> categoryWeight = new HashMap<>();
        int rank = purchasedCategoryIds.size();
        for (Long cid : purchasedCategoryIds) {
            categoryWeight.merge(cid, rank * 3, Integer::sum);
            rank--;
        }
        for (Long cid : wishlistCategoryIds) {
            categoryWeight.merge(cid, 1, Integer::sum);
        }

        boolean hasSignals = !categoryWeight.isEmpty();
        if (!hasSignals) {
            writeCache(cacheKey, List.of(), TTL_USER);
            return List.of();
        }

        java.util.Set<Long> excludeProductIds = new java.util.HashSet<>();
        excludeProductIds.addAll(purchasedProductIds);
        excludeProductIds.addAll(wishlistProductIds);

        List<Long> rankedCategories = categoryWeight.entrySet().stream().sorted(Map.Entry.<Long, Integer>comparingByValue().reversed()).map(Map.Entry::getKey).toList();

        List<ProductEntity> collected = new ArrayList<>();
        java.util.Set<Long> seen = new java.util.HashSet<>();
        int perCategory = Math.max(effectiveLimit, 4);
        for (Long categoryId : rankedCategories) {
            if (collected.size() >= effectiveLimit) {
                break;
            }
            var page = productRepository.findByCategoryIdAndIsActiveTrue(categoryId,
                    PageRequest.of(0,
                            perCategory,
                            org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Order.desc("createdAt"))));
            for (ProductEntity p : page.getContent()) {
                boolean keep = !excludeProductIds.contains(p.getId()) && seen.add(p.getId());
                if (keep) {
                    collected.add(p);
                }
                if (collected.size() >= effectiveLimit) {
                    break;
                }
            }
        }

        List<Product> response = collected.stream().map(Product::fromEntity).toList();
        writeCache(cacheKey, collected.stream().map(ProductEntity::getId).toList(), TTL_USER);
        return response;
    }

    private List<Product> loadProductsInOrder(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        Map<Long, ProductEntity> byId = productRepository.findAllById(ids).stream().filter(p -> Boolean.TRUE.equals(p.getIsActive())).collect(Collectors.toMap(ProductEntity::getId, p -> p));
        List<Product> ordered = new ArrayList<>(ids.size());
        for (Long id : ids) {
            ProductEntity p = byId.get(id);
            if (p != null) {
                ordered.add(Product.fromEntity(p));
            }
        }
        return ordered;
    }

    private int normalizeLimit(int limit, int defaultLimit) {
        boolean hasValidLimit = limit > 0;
        int effective = hasValidLimit ? limit : defaultLimit;
        return Math.min(effective, 50);
    }

    private List<Long> readCache(String key) {
        StringRedisTemplate template = redisTemplateProvider.getIfAvailable();
        if (template == null) {
            return null;
        }
        try {
            String json = template.opsForValue().get(key);
            if (json == null) {
                return null;
            }
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {
            });
        } catch (Exception e) {
            log.warn("Recommendation cache read failed for key {}: {}", key, e.getMessage());
            return null;
        }
    }

    private void writeCache(String key, List<Long> ids, Duration ttl) {
        StringRedisTemplate template = redisTemplateProvider.getIfAvailable();
        if (template == null) {
            return;
        }
        try {
            String json = objectMapper.writeValueAsString(ids);
            template.opsForValue().set(key, json, ttl);
        } catch (Exception e) {
            log.warn("Recommendation cache write failed for key {}: {}", key, e.getMessage());
        }
    }
}
