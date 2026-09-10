package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.FokotanyEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.VilleEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Order extends BaseDto<OrderEntity> {

    @Override
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getCreatedAt() {
        return super.getCreatedAt();
    }

    @Override
    @JsonProperty("updatedAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getUpdatedAt() {
        return super.getUpdatedAt();
    }

    private String orderNumber;
    private Long userAccountId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String billingAddress;
    private String deliveryAddress;
    private PaymentMethodEnum paymentMethod;
    private OrderStatusEnum status;
    private OrderStatusEnum previousStatus;
    private LocalDateTime statusChangedAt;
    private String statusChangeReason;
    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal tax;
    private BigDecimal total;
    private String currency;
    private String trackingNumber;
    private String pickupCode;
    private String carrier;
    private DeliveryMethodEnum deliveryMethod;
    private Long villeId;
    private Long fokotanyId;
    private BigDecimal shippingWeight;
    private String promotionCode;
    private BigDecimal discountAmount;
    private List<OrderItem> items;

    /** Transient: payment URL set by initiatePayment for hosted-checkout providers (PayPal, Stripe, OM). Not persisted. */
    private String paymentUrl;

    /** Transient: payment transaction reference set by initiatePayment. Not persisted. */
    private String transactionReference;

    public static Order fromEntity(OrderEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Order();
        model.setBaseDto(entity);
        model.setOrderNumber(entity.getOrderNumber());
        Optional.ofNullable(entity.getUserAccount()).ifPresent(user -> model.setUserAccountId(user.getId()));
        model.setCustomerName(entity.getCustomerName());
        model.setCustomerEmail(entity.getCustomerEmail());
        model.setCustomerPhone(entity.getCustomerPhone());
        model.setBillingAddress(entity.getBillingAddress());
        model.setDeliveryAddress(entity.getDeliveryAddress());
        model.setPaymentMethod(entity.getPaymentMethod());
        model.setStatus(entity.getStatus());
        model.setPreviousStatus(entity.getPreviousStatus());
        model.setStatusChangedAt(entity.getStatusChangedAt());
        model.setStatusChangeReason(entity.getStatusChangeReason());
        model.setSubtotal(entity.getSubtotal());
        model.setShipping(entity.getShipping());
        model.setTax(entity.getTax());
        model.setTotal(entity.getTotal());
        model.setCurrency(entity.getCurrency());
        model.setTrackingNumber(entity.getTrackingNumber());
        model.setPickupCode(entity.getPickupCode());
        model.setCarrier(entity.getCarrier());
        model.setDeliveryMethod(entity.getDeliveryMethod());
        Optional.ofNullable(entity.getVille()).ifPresent(v -> model.setVilleId(v.getId()));
        Optional.ofNullable(entity.getFokotany()).ifPresent(f -> model.setFokotanyId(f.getId()));
        model.setShippingWeight(entity.getShippingWeight());
        model.setPromotionCode(entity.getPromotionCode());
        model.setDiscountAmount(entity.getDiscountAmount());
        if (entity.getItems() != null) {
            model.setItems(mapEntities(entity.getItems(), OrderItem::fromEntity));
        }
        return model;
    }

    public static OrderBuilder<?, ?> toBuilder(OrderEntity entity) {
        if (entity == null) {
            return Order.builder();
        }
        return Order.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .orderNumber(entity.getOrderNumber())
                .userAccountId(Optional.ofNullable(entity.getUserAccount()).map(UserAccountEntity::getId).orElse(null))
                .customerName(entity.getCustomerName())
                .customerEmail(entity.getCustomerEmail())
                .customerPhone(entity.getCustomerPhone())
                .billingAddress(entity.getBillingAddress())
                .deliveryAddress(entity.getDeliveryAddress())
                .paymentMethod(entity.getPaymentMethod())
                .status(entity.getStatus())
                .previousStatus(entity.getPreviousStatus())
                .statusChangedAt(entity.getStatusChangedAt())
                .statusChangeReason(entity.getStatusChangeReason())
                .subtotal(entity.getSubtotal())
                .shipping(entity.getShipping())
                .tax(entity.getTax())
                .total(entity.getTotal())
                .currency(entity.getCurrency())
                .trackingNumber(entity.getTrackingNumber())
                .pickupCode(entity.getPickupCode())
                .carrier(entity.getCarrier())
                .deliveryMethod(entity.getDeliveryMethod())
                .villeId(Optional.ofNullable(entity.getVille()).map(VilleEntity::getId).orElse(null))
                .fokotanyId(Optional.ofNullable(entity.getFokotany()).map(FokotanyEntity::getId).orElse(null))
                .shippingWeight(entity.getShippingWeight())
                .promotionCode(entity.getPromotionCode())
                .discountAmount(entity.getDiscountAmount());
    }

    public static Order fromEntityLight(OrderEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public OrderEntity toEntity(OrderEntity entity) {
        OrderEntity targetEntity = Objects.requireNonNullElseGet(entity, OrderEntity::new);
        setBaseEntity(targetEntity);
        targetEntity.setOrderNumber(orderNumber);
        targetEntity.setCustomerName(customerName);
        targetEntity.setCustomerEmail(customerEmail);
        targetEntity.setCustomerPhone(customerPhone);
        targetEntity.setBillingAddress(billingAddress);
        targetEntity.setDeliveryAddress(deliveryAddress);
        targetEntity.setPaymentMethod(paymentMethod);
        targetEntity.setStatus(status);
        targetEntity.setPreviousStatus(previousStatus);
        targetEntity.setStatusChangedAt(statusChangedAt);
        targetEntity.setStatusChangeReason(statusChangeReason);
        targetEntity.setSubtotal(Optional.ofNullable(subtotal).orElse(BigDecimal.ZERO));
        targetEntity.setShipping(Optional.ofNullable(shipping).orElse(BigDecimal.ZERO));
        targetEntity.setTax(Optional.ofNullable(tax).orElse(BigDecimal.ZERO));
        targetEntity.setTotal(Optional.ofNullable(total).orElse(BigDecimal.ZERO));
        targetEntity.setCurrency(Optional.ofNullable(currency).orElse("MGA"));
        targetEntity.setTrackingNumber(trackingNumber);
        targetEntity.setPickupCode(pickupCode);
        targetEntity.setCarrier(carrier);
        targetEntity.setDeliveryMethod(deliveryMethod);
        targetEntity.setShippingWeight(shippingWeight);
        targetEntity.setPromotionCode(promotionCode);
        targetEntity.setDiscountAmount(Optional.ofNullable(discountAmount).orElse(BigDecimal.ZERO));
        applyRelations(targetEntity);
        return targetEntity;
    }

    private void applyRelations(OrderEntity targetEntity) {
        Optional.ofNullable(userAccountId).ifPresent(id -> {
            UserAccountEntity user = new UserAccountEntity();
            user.setId(id);
            targetEntity.setUserAccount(user);
        });
        Optional.ofNullable(villeId).ifPresent(id -> {
            VilleEntity ville = new VilleEntity();
            ville.setId(id);
            targetEntity.setVille(ville);
        });
        Optional.ofNullable(fokotanyId).ifPresent(id -> {
            FokotanyEntity fokotany = new FokotanyEntity();
            fokotany.setId(id);
            targetEntity.setFokotany(fokotany);
        });
    }
}
