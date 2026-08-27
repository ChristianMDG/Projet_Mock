package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IOrderRepository extends JpaRepository<OrderEntity, Long>, JpaSpecificationExecutor<OrderEntity> {

    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    /**
     * Finds orders by customer phone number.
     * Useful for customer service and order lookup by phone.
     *
     * @param customerPhone the customer's phone number
     * @return list of orders matching the phone number
     */
    List<OrderEntity> findByCustomerPhone(String customerPhone);

    /**
     * Finds orders by order status.
     * Supports pagination for admin dashboard filtering.
     *
     * @param status the order status to filter by
     * @param pageable pagination information
     * @return page of orders with the specified status
     */
    Page<OrderEntity> findByStatus(OrderStatusEnum status, Pageable pageable);

    /**
     * Finds orders by delivery destination ville (city).
     * Admin query method for location-based order filtering.
     *
     * @param villeId the ville (city) id
     * @param pageable pagination information
     * @return page of orders for the specified ville
     */
    @Query("SELECT o FROM ShopOrder o WHERE o.ville.id = :villeId")
    Page<OrderEntity> findByVille(@Param("villeId") Long villeId, Pageable pageable);

    /**
     * Finds orders by payment method.
     * Admin query method for payment method analysis and reporting.
     *
     * @param paymentMethod the payment method enum
     * @param pageable pagination information
     * @return page of orders using the specified payment method
     */
    Page<OrderEntity> findByPaymentMethod(PaymentMethodEnum paymentMethod, Pageable pageable);

    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " + "WHERE oi.order.userAccount.id = :userId " + "AND oi.product.id = :productId "
            + "AND oi.order.status IN (mg.taxibrousse.entities.enums.OrderStatusEnum.PROCESSING, " + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.SHIPPED, "
            + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.DELIVERED)")
    boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);

    /**
     * Finds product ids frequently bought together with the given product.
     * Only considers confirmed orders (PROCESSING, SHIPPED, DELIVERED).
     * Returns product ids ordered by co-occurrence count DESC.
     */
    @Query("SELECT co.product.id FROM OrderItem oi " + "JOIN OrderItem co ON co.order.id = oi.order.id AND co.product.id <> oi.product.id " + "WHERE oi.product.id = :productId "
            + "AND oi.order.status IN (mg.taxibrousse.entities.enums.OrderStatusEnum.PROCESSING, " + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.SHIPPED, "
            + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.DELIVERED) " + "AND co.product.isActive = TRUE " + "GROUP BY co.product.id "
            + "ORDER BY COUNT(co.product.id) DESC")
    List<Long> findFrequentlyBoughtTogetherProductIds(@Param("productId") Long productId, Pageable pageable);

    /**
     * Returns the list of category ids the user has historically purchased from,
     * ordered by purchase count DESC. Confirmed orders only.
     */
    @Query("SELECT oi.product.category.id FROM OrderItem oi " + "WHERE oi.order.userAccount.id = :userId " + "AND oi.product.category IS NOT NULL "
            + "AND oi.order.status IN (mg.taxibrousse.entities.enums.OrderStatusEnum.PROCESSING, " + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.SHIPPED, "
            + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.DELIVERED) " + "GROUP BY oi.product.category.id " + "ORDER BY COUNT(oi.product.id) DESC")
    List<Long> findTopPurchasedCategoryIdsByUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * Returns product ids already purchased by the user (confirmed orders).
     */
    @Query("SELECT DISTINCT oi.product.id FROM OrderItem oi " + "WHERE oi.order.userAccount.id = :userId " + "AND oi.order.status IN (mg.taxibrousse.entities.enums.OrderStatusEnum.PROCESSING, "
            + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.SHIPPED, " + "                        mg.taxibrousse.entities.enums.OrderStatusEnum.DELIVERED)")
    List<Long> findPurchasedProductIdsByUser(@Param("userId") Long userId);
}
