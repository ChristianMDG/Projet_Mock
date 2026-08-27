package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.shop.PromotionValidationResponse;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.CartItemEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.OrderItemEntity;
import mg.taxibrousse.entities.ProductCategoryEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.PromotionEntity;
import mg.taxibrousse.entities.enums.DiscountTypeEnum;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Promotion;
import mg.taxibrousse.repositories.IProductCategoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IPromotionRepository;
import mg.taxibrousse.services.IPromotionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {

    private final IPromotionRepository promotionRepository;
    private final IProductRepository productRepository;
    private final IProductCategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> listActive() {
        return promotionRepository.findActive(LocalDateTime.now()).stream().map(Promotion::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Promotion findById(Long id) {
        return Promotion.fromEntity(loadPromotion(id));
    }

    @Override
    @Transactional
    public Promotion create(Promotion request) {
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new ShopException("error_promotion_code_taken", "exception_promotion_code_taken");
        }
        PromotionEntity entity = new PromotionEntity();
        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setDiscountType(request.getDiscountType());
        entity.setDiscountValue(request.getDiscountValue());
        entity.setBuyQuantity(request.getBuyQuantity());
        entity.setGetQuantity(request.getGetQuantity());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setUsageLimit(request.getUsageLimit());
        entity.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);
        entity.setProducts(resolveProducts(request.getProductIds()));
        entity.setCategories(resolveCategories(request.getCategoryIds()));
        return Promotion.fromEntity(promotionRepository.save(entity));
    }

    @Override
    @Transactional
    public Promotion update(Long id, Promotion request) {
        PromotionEntity entity = loadPromotion(id);
        applyCode(entity, request);
        applyName(entity, request);
        applyDescription(entity, request);
        applyDiscountType(entity, request);
        applyDiscountValue(entity, request);
        applyBuyQuantity(entity, request);
        applyGetQuantity(entity, request);
        applyStartDate(entity, request);
        applyEndDate(entity, request);
        applyUsageLimit(entity, request);
        applyIsActive(entity, request);
        applyProducts(entity, request);
        applyCategories(entity, request);
        return Promotion.fromEntity(promotionRepository.save(entity));
    }

    private void applyCode(PromotionEntity entity, Promotion request) {
        if (request.getCode() == null) {
            return;
        }
        if (request.getCode().equals(entity.getCode())) {
            return;
        }
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new ShopException("error_promotion_code_taken", "exception_promotion_code_taken");
        }
        entity.setCode(request.getCode());
    }

    private void applyName(PromotionEntity entity, Promotion request) {
        if (request.getName() == null) {
            return;
        }
        entity.setName(request.getName());
    }

    private void applyDescription(PromotionEntity entity, Promotion request) {
        if (request.getDescription() == null) {
            return;
        }
        entity.setDescription(request.getDescription());
    }

    private void applyDiscountType(PromotionEntity entity, Promotion request) {
        if (request.getDiscountType() == null) {
            return;
        }
        entity.setDiscountType(request.getDiscountType());
    }

    private void applyDiscountValue(PromotionEntity entity, Promotion request) {
        if (request.getDiscountValue() == null) {
            return;
        }
        entity.setDiscountValue(request.getDiscountValue());
    }

    private void applyBuyQuantity(PromotionEntity entity, Promotion request) {
        if (request.getBuyQuantity() == null) {
            return;
        }
        entity.setBuyQuantity(request.getBuyQuantity());
    }

    private void applyGetQuantity(PromotionEntity entity, Promotion request) {
        if (request.getGetQuantity() == null) {
            return;
        }
        entity.setGetQuantity(request.getGetQuantity());
    }

    private void applyStartDate(PromotionEntity entity, Promotion request) {
        if (request.getStartDate() == null) {
            return;
        }
        entity.setStartDate(request.getStartDate());
    }

    private void applyEndDate(PromotionEntity entity, Promotion request) {
        if (request.getEndDate() == null) {
            return;
        }
        entity.setEndDate(request.getEndDate());
    }

    private void applyUsageLimit(PromotionEntity entity, Promotion request) {
        if (request.getUsageLimit() == null) {
            return;
        }
        entity.setUsageLimit(request.getUsageLimit());
    }

    private void applyIsActive(PromotionEntity entity, Promotion request) {
        if (request.getIsActive() == null) {
            return;
        }
        entity.setIsActive(request.getIsActive());
    }

    private void applyProducts(PromotionEntity entity, Promotion request) {
        if (request.getProductIds() == null) {
            return;
        }
        entity.setProducts(resolveProducts(request.getProductIds()));
    }

    private void applyCategories(PromotionEntity entity, Promotion request) {
        if (request.getCategoryIds() == null) {
            return;
        }
        entity.setCategories(resolveCategories(request.getCategoryIds()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        PromotionEntity entity = loadPromotion(id);
        promotionRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionValidationResponse validate(String code, CartEntity cart) {
        PromotionEntity promo = promotionRepository.findByCode(code).orElse(null);
        if (promo == null) {
            return PromotionValidationResponse.builder().eligible(false).code(code).errorCode("error_promotion_not_found").discountAmount(BigDecimal.ZERO).newSubtotal(BigDecimal.ZERO).build();
        }
        String invalidCode = checkValidity(promo);
        if (invalidCode != null) {
            return PromotionValidationResponse.builder().eligible(false).code(code).errorCode(invalidCode).discountAmount(BigDecimal.ZERO).newSubtotal(BigDecimal.ZERO).build();
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        if (cart != null && cart.getItems() != null) {
            for (CartItemEntity item : cart.getItems()) {
                BigDecimal unit = item.getPriceSnapshot() != null ? item.getPriceSnapshot() : item.getProduct().getPrice();
                BigDecimal line = unit.multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(line);
                if (isApplicable(promo, item.getProduct())) {
                    discount = discount.add(computeLineDiscount(promo, unit, item.getQuantity()));
                }
            }
        }

        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }
        BigDecimal newSubtotal = subtotal.subtract(discount);
        return PromotionValidationResponse.builder().eligible(true).code(code).errorCode(null).discountAmount(discount).newSubtotal(newSubtotal).build();
    }

    @Override
    @Transactional
    public void applyToOrder(OrderEntity order, String code) {
        if (StringUtils.hasText(code)) {
            PromotionEntity promo = promotionRepository.findByCode(code).orElseThrow(() -> new ShopException("error_promotion_not_found", "exception_promotion_not_found"));
            String invalidCode = checkValidity(promo);
            if (invalidCode != null) {
                throw new ShopException(invalidCode, invalidCode);
            }

            BigDecimal discount = BigDecimal.ZERO;
            if (order.getItems() != null) {
                for (OrderItemEntity item : order.getItems()) {
                    if (isApplicable(promo, item.getProduct())) {
                        discount = discount.add(computeLineDiscount(promo, item.getUnitPrice(), item.getQuantity()));
                    }
                }
            }
            if (discount.compareTo(order.getSubtotal()) > 0) {
                discount = order.getSubtotal();
            }
            order.setPromotionCode(promo.getCode());
            order.setDiscountAmount(discount);
        }
    }

    @Override
    @Transactional
    public void incrementUsageOnConfirmation(String code) {
        if (StringUtils.hasText(code)) {
            promotionRepository.findByCode(code).ifPresent(promo -> {
                promo.setUsageCount(promo.getUsageCount() == null ? 1 : promo.getUsageCount() + 1);
                promotionRepository.save(promo);
            });
        }
    }

    private String checkValidity(PromotionEntity promo) {
        if (Boolean.TRUE.equals(promo.getIsActive())) {
            return checkDateAndUsage(promo);
        }
        return "error_promotion_inactive";
    }

    private String checkDateAndUsage(PromotionEntity promo) {
        LocalDateTime now = LocalDateTime.now();
        if (promo.getStartDate() != null && now.isBefore(promo.getStartDate())) {
            return "error_promotion_not_started";
        }
        if (promo.getEndDate() != null && now.isAfter(promo.getEndDate())) {
            return "error_promotion_expired";
        }
        if (promo.getUsageLimit() != null && promo.getUsageCount() != null && promo.getUsageCount() >= promo.getUsageLimit()) {
            return "error_promotion_usage_exceeded";
        }
        return null;
    }

    private boolean isApplicable(PromotionEntity promo, ProductEntity product) {
        boolean noTargetsDefined = (promo.getProducts() == null || promo.getProducts().isEmpty()) && (promo.getCategories() == null || promo.getCategories().isEmpty());
        if (noTargetsDefined) {
            return true;
        }
        if (product == null) {
            return false;
        }
        if (promo.getProducts() != null) {
            for (ProductEntity p : promo.getProducts()) {
                if (p.getId().equals(product.getId())) {
                    return true;
                }
            }
        }
        if (promo.getCategories() != null && product.getCategory() != null) {
            for (ProductCategoryEntity c : promo.getCategories()) {
                if (c.getId().equals(product.getCategory().getId())) {
                    return true;
                }
            }
        }
        return false;
    }

    private BigDecimal computeLineDiscount(PromotionEntity promo, BigDecimal unitPrice, int quantity) {
        BigDecimal line = unitPrice.multiply(BigDecimal.valueOf(quantity));
        if (promo.getDiscountType() == DiscountTypeEnum.PERCENTAGE) {
            BigDecimal value = promo.getDiscountValue() != null ? promo.getDiscountValue() : BigDecimal.ZERO;
            return line.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        if (promo.getDiscountType() == DiscountTypeEnum.FIXED) {
            BigDecimal value = promo.getDiscountValue() != null ? promo.getDiscountValue() : BigDecimal.ZERO;
            BigDecimal totalFixed = value.multiply(BigDecimal.valueOf(quantity));
            return totalFixed.min(line);
        }
        if (promo.getDiscountType() == DiscountTypeEnum.BUY_X_GET_Y) {
            int buy = promo.getBuyQuantity() != null ? promo.getBuyQuantity() : 1;
            int get = promo.getGetQuantity() != null ? promo.getGetQuantity() : 0;
            if (buy <= 0 || get <= 0) {
                return BigDecimal.ZERO;
            }
            int bundle = buy + get;
            int freeUnits = (quantity / bundle) * get;
            return unitPrice.multiply(BigDecimal.valueOf(freeUnits));
        }
        return BigDecimal.ZERO;
    }

    private PromotionEntity loadPromotion(Long id) {
        return promotionRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Promotion not found: " + id));
    }

    private Set<ProductEntity> resolveProducts(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        return productRepository.findAllById(ids).stream().collect(Collectors.toCollection(HashSet::new));
    }

    private Set<ProductCategoryEntity> resolveCategories(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        return categoryRepository.findAllById(ids).stream().collect(Collectors.toCollection(HashSet::new));
    }
}
