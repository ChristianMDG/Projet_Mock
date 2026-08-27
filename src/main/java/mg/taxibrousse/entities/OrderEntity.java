package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "ShopOrder")
@Table(name = "shop_order", uniqueConstraints = {@UniqueConstraint(name = "uk_shop_order_number", columnNames = "order_number")}, indexes = {
        @Index(name = "idx_shop_order_user", columnList = "user_account_id"), @Index(name = "idx_shop_order_status", columnList = "status"),
        @Index(name = "idx_shop_order_created_at", columnList = "createdAt"), @Index(name = "shop_order_documents_idx", columnList = "documentId, locale, publishedAt")})
public class OrderEntity extends BaseEntity {

    @Column(name = "order_number", nullable = false, length = 40)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_id")
    private UserAccountEntity userAccount;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "customer_email", length = 200)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false, length = 30)
    private String customerPhone;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethodEnum paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatusEnum status = OrderStatusEnum.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 20)
    private OrderStatusEnum previousStatus;

    @Column(name = "status_changed_at")
    private java.time.LocalDateTime statusChangedAt;

    @Column(name = "status_change_reason", columnDefinition = "TEXT")
    private String statusChangeReason;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal shipping = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(length = 10, nullable = false)
    private String currency = "MGA";

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "pickup_code", length = 6)
    private String pickupCode;

    @Column(length = 100)
    private String carrier;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_method", length = 20)
    private DeliveryMethodEnum deliveryMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ville_id")
    private VilleEntity ville;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fokotany_id")
    private FokotanyEntity fokotany;

    @Column(name = "shipping_weight", precision = 10, scale = 3)
    private BigDecimal shippingWeight;

    @Column(name = "promotion_code", length = 60)
    private String promotionCode;

    @Column(name = "discount_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItemEntity> items = new ArrayList<>();
}
