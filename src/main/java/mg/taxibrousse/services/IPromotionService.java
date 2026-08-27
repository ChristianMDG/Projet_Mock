package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.PromotionValidationResponse;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.models.Promotion;

import java.util.List;

public interface IPromotionService {

    List<Promotion> listActive();

    Promotion findById(Long id);

    Promotion create(Promotion request);

    Promotion update(Long id, Promotion request);

    void delete(Long id);

    PromotionValidationResponse validate(String code, CartEntity cart);

    /**
     * Applies a promotion code to an order, setting discountAmount and promotionCode.
     * Does NOT increment usageCount (that happens on order confirmation).
     */
    void applyToOrder(OrderEntity order, String code);

    /**
     * Atomically increments usage count on order confirmation.
     */
    void incrementUsageOnConfirmation(String code);
}
