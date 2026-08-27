package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.BuyNowRequest;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.OrderSearchParams;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.io.Writer;

public interface IOrderService {

    Order createFromCart(Long userAccountId, String guestKey, Order request);

    Order createFromCart(Long userAccountId, String guestKey, Order request, String promotionCode);

    Order findById(Long id);

    /** Legacy no-op initiation used by the dashboard. Kept for backward compat. */
    Order initiatePayment(Long orderId);

    /**
     * Initiate payment for an order using the provided payment method.
     * Dispatches to MVola/PayPal/Stripe etc. and returns the order with
     * {@code paymentUrl} populated when the provider produces a redirect URL.
     */
    Order initiatePayment(Long orderId, OrderPaymentRequest request) throws IOException, InterruptedException;

    /** Buy-now: create a single-item order and immediately initiate its payment. */
    Order buyNow(Long userAccountId, BuyNowRequest request) throws IOException, InterruptedException;

    Order confirm(Long orderId);

    Order failPayment(Long orderId, String reason);

    Page<Order> search(OrderSearchParams params, Pageable pageable);

    Order updateStatus(Long orderId, OrderStatusEnum newStatus, String reason, Long adminUserId);

    Order confirmPickup(Long orderId, String code);
    
    void exportCsv(OrderSearchParams params, Writer writer);
}
