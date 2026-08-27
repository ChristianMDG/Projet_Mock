package mg.taxibrousse.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

import java.time.LocalDateTime;

/**
 * Search parameters for admin order filtering and listing.
 *
 * <p>
 * Used by {@code GET /api/orders} endpoint to filter and search orders.
 *
 * <p>
 * Supports filtering by:
 * <ul>
 * <li>Order status (PENDING, CONFIRMED, etc.)</li>
 * <li>Date range (from/to)</li>
 * <li>Customer ID (for user-specific order history)</li>
 * <li>Ville/city (for location-based filtering)</li>
 * <li>Payment method (MOBILE_MONEY)</li>
 * <li>Text search (order number, customer name/phone)</li>
 * </ul>
 *
 * <p>
 * All parameters are optional. When multiple filters are provided,
 * they are combined with AND logic.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSearchParams {

    /**
     * Filter by order status.
     * Optional. When provided, returns only orders with matching status.
     */
    private OrderStatusEnum status;

    /**
     * Filter by creation date (from).
     * Optional. Returns orders created on or after this date/time.
     */
    private LocalDateTime dateFrom;

    /**
     * Filter by creation date (to).
     * Optional. Returns orders created on or before this date/time.
     */
    private LocalDateTime dateTo;

    /**
     * Filter by customer user account ID.
     * Optional. Returns orders belonging to specific customer.
     */
    private Long customerId;

    /**
     * Filter by delivery destination city.
     * Optional. Returns orders being delivered to specific ville.
     */
    private Long villeId;

    /**
     * Filter by payment method.
     * Optional. Returns orders with specific payment method.
     */
    private PaymentMethodEnum paymentMethod;

    /**
     * Text search query.
     * Optional. Searches across:
     * <ul>
     * <li>Order number</li>
     * <li>Customer name</li>
     * <li>Customer phone</li>
     * <li>Customer email</li>
     * </ul>
     */
    private String q;

    /**
     * Page number for pagination (zero-indexed).
     * Optional, defaults to 0.
     */
    private Integer page;

    /**
     * Page size for pagination.
     * Optional, defaults to 20.
     */
    private Integer size;

    /**
     * Sort field name.
     * Optional, defaults to "createdAt".
     * Common values: "createdAt", "orderNumber", "total", "status"
     */
    private String sortBy;

    /**
     * Sort direction: "asc" or "desc".
     * Optional, defaults to "desc".
     */
    private String sortDirection;
}
