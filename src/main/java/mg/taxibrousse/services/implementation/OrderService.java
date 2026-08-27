package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.PayableType;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.shop.BuyNowRequest;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.OrderSearchParams;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.CartItemEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.OrderItemEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.enums.CartStatusEnum;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.entities.enums.PaymentMethodEnum;
import mg.taxibrousse.exceptions.InvalidOrderStatusTransitionException;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.models.CartItem;
import mg.taxibrousse.models.Order;
import mg.taxibrousse.models.OrderItem;
import mg.taxibrousse.models.PaymentTransaction;
import mg.taxibrousse.repositories.ICartItemRepository;
import mg.taxibrousse.repositories.ICartRepository;
import mg.taxibrousse.repositories.IOrderRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.specs.OrderSpecifications;
import mg.taxibrousse.services.IAirtelMoneyService;
import mg.taxibrousse.services.ICartService;
import mg.taxibrousse.services.IInventoryService;
import mg.taxibrousse.services.IMVolaService;
import mg.taxibrousse.services.IOrangeMoneyService;
import mg.taxibrousse.services.IOrderService;
import mg.taxibrousse.services.IPaymentService;
import mg.taxibrousse.services.IPromotionService;
import mg.taxibrousse.services.IShippingCalculator;
import mg.taxibrousse.services.IShopNotificationService;
import mg.taxibrousse.services.ITaxCalculator;
import mg.taxibrousse.utils.PhoneUtils;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final IOrderRepository orderRepository;
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final ICartService cartService;
    private final IProductRepository productRepository;
    private final IInventoryService inventoryService;
    private final ITaxCalculator taxCalculator;
    private final IShippingCalculator shippingCalculator;
    private final IShopNotificationService notificationService;
    private final IPromotionService promotionService;
    private final EntityManager entityManager;
    private final ObjectProvider<IMVolaService> mvolaProvider;
    private final ObjectProvider<IAirtelMoneyService> airtelProvider;
    private final ObjectProvider<IOrangeMoneyService> orangeProvider;

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Order createFromCart(Long userAccountId, String sessionToken, Order request) {
        String promo = Optional.ofNullable(request).map(Order::getPromotionCode).orElse(null);
        return createFromCart(userAccountId, sessionToken, request, promo);
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Order createFromCart(Long userAccountId, String sessionToken, Order request, String promotionCode) {
        CartEntity cart = cartService.resolveOrCreateCartEntity(userAccountId, sessionToken);

        boolean cartHasItems = !CollectionUtils.isEmpty(cart.getItems());
        List<OrderItem> requestItems = Optional.ofNullable(request).map(Order::getItems).orElse(null);
        boolean requestHasItems = !CollectionUtils.isEmpty(requestItems);

        // Neither cart nor request body has items — fail early.
        if (!cartHasItems && !requestHasItems) {
            throw new ShopException("error_cart_empty", "exception_cart_empty");
        }

        OrderEntity order = Optional.ofNullable(request).map(r -> r.toEntity(null)).orElseGet(OrderEntity::new);
        order.setOrderNumber(generateOrderNumber());
        order.setUserAccount(cart.getUserAccount());
        order.setStatus(OrderStatusEnum.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        String currency = "MGA";
        BigDecimal totalWeight = BigDecimal.ZERO;

        if (cartHasItems) {
            // --- Cart-based checkout path ---
            for (CartItemEntity ci : cart.getItems()) {
                Long productId = ci.getProduct().getId();
                Long variantId = Optional.ofNullable(ci.getVariant()).map(ProductVariantEntity::getId).orElse(null);
                inventoryService.reserve(productId, variantId, ci.getQuantity(), userAccountId);

                BigDecimal unit = Optional.ofNullable(ci.getPriceSnapshot()).orElseGet(() -> ci.getProduct().getPrice());
                BigDecimal line = unit.multiply(BigDecimal.valueOf(ci.getQuantity()));

                OrderItem itemModel = OrderItem.builder()
                        .productId(productId)
                        .variantId(variantId)
                        .productName(ci.getProduct().getName())
                        .productSku(ci.getProduct().getSku())
                        .quantity(ci.getQuantity())
                        .unitPrice(unit)
                        .lineTotal(line)
                        .build();

                OrderItemEntity oi = itemModel.toEntity();
                oi.setOrder(order);
                oi.setProduct(ci.getProduct());
                oi.setVariant(ci.getVariant());
                order.getItems().add(oi);

                subtotal = subtotal.add(line);
                currency = Optional.ofNullable(ci.getProduct().getCurrency()).orElse(currency);
                totalWeight = totalWeight.add(
                        Optional.ofNullable(ci.getProduct().getWeight())
                                .map(w -> w.multiply(BigDecimal.valueOf(ci.getQuantity())))
                                .orElse(BigDecimal.ZERO));
            }

            cart.setStatus(CartStatusEnum.CONVERTED);
            cartRepository.save(cart);
        } else {
            // --- Direct-checkout path (items supplied in the request body) ---
            for (OrderItem ri : requestItems) {
                Long productId = Long.parseLong(String.valueOf(ri.getProductId()));
                Long variantId = ri.getVariantId();
                int quantity = Optional.ofNullable(ri.getQuantity()).orElse(1);
                inventoryService.reserve(productId, variantId, quantity, userAccountId);

                ProductEntity product = productRepository.findById(productId)
                        .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

                BigDecimal unit = Optional.ofNullable(ri.getUnitPrice())
                        .orElseGet(product::getPrice);
                BigDecimal line = Optional.ofNullable(ri.getLineTotal())
                        .orElseGet(() -> unit.multiply(BigDecimal.valueOf(quantity)));

                OrderItemEntity oi = new OrderItemEntity();
                oi.setOrder(order);
                oi.setProduct(product);
                oi.setProductName(Optional.ofNullable(ri.getProductName()).orElse(product.getName()));
                oi.setProductSku(Optional.ofNullable(ri.getProductSku()).orElse(product.getSku()));
                oi.setQuantity(quantity);
                oi.setUnitPrice(unit);
                oi.setLineTotal(line);
                order.getItems().add(oi);

                subtotal = subtotal.add(line);
                currency = Optional.ofNullable(product.getCurrency()).orElse(currency);
                totalWeight = totalWeight.add(
                        Optional.ofNullable(product.getWeight())
                                .map(w -> w.multiply(BigDecimal.valueOf(quantity)))
                                .orElse(BigDecimal.ZERO));
            }
        }

        order.setCurrency(currency);
        order.setSubtotal(subtotal);
        order.setShippingWeight(totalWeight);
        order.setTax(taxCalculator.calculate(order));
        order.setShipping(shippingCalculator.calculate(order));

        if (StringUtils.hasText(promotionCode)) {
            promotionService.applyToOrder(order, promotionCode);
        }
        BigDecimal discount = Optional.ofNullable(order.getDiscountAmount()).orElse(BigDecimal.ZERO);
        order.setDiscountAmount(discount);
        order.setTotal(subtotal.add(order.getTax()).add(order.getShipping()).subtract(discount));

        OrderEntity saved = orderRepository.save(order);

        return Order.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Order findById(Long id) {
        OrderEntity order = orderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
        return Order.fromEntity(order);
    }

    @Override
    @Transactional
    public Order initiatePayment(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        if (order.getStatus() == OrderStatusEnum.PENDING) {
            log.info("Payment initiation requested for shop order {} (method={})", order.getOrderNumber(), order.getPaymentMethod());
            return Order.fromEntity(order);
        }
        throw new ShopException("error_invalid_order_status", "exception_order_not_pending");
    }

    @Override
    @Transactional
    public Order initiatePayment(Long orderId, OrderPaymentRequest request) throws IOException, InterruptedException {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        if (order.getStatus() == OrderStatusEnum.PENDING) {
            Order model = Order.fromEntity(order);
            model.setPaymentMethod(request.getPaymentMethod());
            order = model.toEntity(order);

            OrderEntity saved = orderRepository.save(order);
            Order result = Order.fromEntity(saved);

            PaymentRequest pr = PaymentRequest.builder().payableId(orderId).payableType(PayableType.ORDER).amount(saved.getTotal()).phoneNumber(request.getPhoneNumber()).build();

            if (request.getPaymentMethod() == PaymentMethodEnum.MOBILE_MONEY) {
                if (StringUtils.hasText(request.getPhoneNumber())) {
                    IPaymentService provider = resolveMobileMoneyProvider(request.getPhoneNumber());
                    String operator = PhoneUtils.getOperatorName(request.getPhoneNumber());
                    pr.setOperatorName(operator);
                    PaymentTransaction tx = provider.initPayment(pr);
                    result.setPaymentUrl(tx.getPaymentUrl());
                    result.setTransactionReference(tx.getTransactionReference());
                } else {
                    throw new ShopException("error_phone_number_required", "exception_phone_number_required");
                }
            }
            return result;
        }
        throw new ShopException("error_invalid_order_status", "exception_order_not_pending");
    }

    @Override
    @Transactional
    public Order buyNow(Long userAccountId, BuyNowRequest request) throws IOException, InterruptedException {
        inventoryService.reserve(request.getProductId(), request.getVariantId(), request.getQuantity(), userAccountId);

        ProductEntity product = entityManager.find(ProductEntity.class, request.getProductId());
        ProductVariantEntity variant = Optional.ofNullable(request.getVariantId()).map(id -> entityManager.find(ProductVariantEntity.class, id)).orElse(null);

        BigDecimal unit = product.getPrice();
        BigDecimal line = unit.multiply(BigDecimal.valueOf(request.getQuantity()));

        OrderItem itemModel = OrderItem.builder()
                .productId(product.getId())
                .variantId(Optional.ofNullable(variant).map(ProductVariantEntity::getId).orElse(null))
                .productName(product.getName())
                .productSku(product.getSku())
                .quantity(request.getQuantity())
                .unitPrice(unit)
                .lineTotal(line)
                .build();

        Order orderModel = Order.builder()
                .orderNumber(generateOrderNumber())
                .userAccountId(userAccountId)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .villeId(request.getVilleId())
                .paymentMethod(request.getPaymentMethod())
                .deliveryMethod(Optional.ofNullable(request.getDeliveryMethod()).orElse(DeliveryMethodEnum.STANDARD))
                .status(OrderStatusEnum.PENDING)
                .currency(Optional.ofNullable(product.getCurrency()).orElse("MGA"))
                .subtotal(line)
                .shippingWeight(Optional.ofNullable(product.getWeight()).map(w -> w.multiply(BigDecimal.valueOf(request.getQuantity()))).orElse(BigDecimal.ZERO))
                .build();

        OrderEntity order = orderModel.toEntity();
        order.setUserAccount(entityManager.getReference(UserAccountEntity.class, userAccountId));

        OrderItemEntity oi = itemModel.toEntity();
        oi.setOrder(order);
        oi.setProduct(product);
        oi.setVariant(variant);
        order.setItems(new ArrayList<>(List.of(oi)));

        order.setTax(taxCalculator.calculate(order));
        order.setShipping(shippingCalculator.calculate(order));
        order.setTotal(line.add(order.getTax()).add(order.getShipping()));

        OrderEntity saved = orderRepository.save(order);

        OrderPaymentRequest pay = OrderPaymentRequest.builder().paymentMethod(request.getPaymentMethod()).phoneNumber(request.getPhoneNumber()).build();
        return initiatePayment(saved.getId(), pay);
    }

    private IPaymentService resolveMobileMoneyProvider(String phoneNumber) {
        String operator = PhoneUtils.getOperatorName(phoneNumber);
        ObjectProvider<? extends IPaymentService> provider = switch (operator) {
            case "TELMA" -> mvolaProvider;
            case "AIRTEL" -> airtelProvider;
            case "ORANGE" -> orangeProvider;
            default -> throw new ShopException("error_unsupported_mobile_money_operator", "exception_unsupported_mobile_money_operator");
        };
        return Optional.ofNullable(provider.getIfAvailable()).orElseThrow(() -> new ShopException("error_mobile_money_unavailable", "exception_mobile_money_unavailable"));
    }

    @Override
    @Transactional
    public Order confirm(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        if (order.getStatus().canTransitionTo(OrderStatusEnum.PROCESSING)) {
            Long userId = Optional.ofNullable(order.getUserAccount()).map(UserAccountEntity::getId).orElse(null);
            final String orderNum = order.getOrderNumber();
            for (OrderItemEntity oi : order.getItems()) {
                Optional.ofNullable(oi.getProduct()).ifPresent(product -> {
                    Long variantId = Optional.ofNullable(oi.getVariant()).map(ProductVariantEntity::getId).orElse(null);
                    inventoryService.commitReservation(product.getId(), variantId, oi.getQuantity(), userId, "order.confirm:" + orderNum);
                });
            }

            Order model = Order.fromEntity(order);
            model.setStatus(OrderStatusEnum.PROCESSING);
            order = model.toEntity(order);

            OrderEntity saved = orderRepository.save(order);
            if (StringUtils.hasText(saved.getPromotionCode())) {
                promotionService.incrementUsageOnConfirmation(saved.getPromotionCode());
            }
            notificationService.sendOrderConfirmation(saved);
            return Order.fromEntity(saved);
        }
        throw new ShopException("error_invalid_transition", "exception_order_invalid_transition");
    }

    @Override
    @Transactional
    public Order failPayment(Long orderId, String reason) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        if (order.getStatus() == OrderStatusEnum.CANCELLED) {
            return Order.fromEntity(order);
        }
        Long userId = Optional.ofNullable(order.getUserAccount()).map(UserAccountEntity::getId).orElse(null);
        final String orderNum = order.getOrderNumber();
        for (OrderItemEntity oi : order.getItems()) {
            Optional.ofNullable(oi.getProduct()).ifPresent(product -> {
                Long variantId = Optional.ofNullable(oi.getVariant()).map(ProductVariantEntity::getId).orElse(null);
                inventoryService.releaseReservation(product.getId(), variantId, oi.getQuantity(), userId, "order.failPayment:" + orderNum);
            });
        }
        restoreCart(order);

        Order model = Order.fromEntity(order);
        model.setStatus(OrderStatusEnum.CANCELLED);
        order = model.toEntity(order);

        return Order.fromEntity(orderRepository.save(order));
    }

    private void restoreCart(OrderEntity order) {
        Optional.ofNullable(order.getUserAccount()).ifPresent(userAccount -> {
            Long userId = userAccount.getId();
            CartEntity cart = cartService.resolveOrCreateUserCartEntity(userId);
            for (OrderItemEntity oi : order.getItems()) {
                Optional.ofNullable(oi.getProduct()).ifPresent(product -> {
                    CartItem cartItemModel = CartItem.builder()
                            .cartId(cart.getId())
                            .productId(product.getId())
                            .variantId(Optional.ofNullable(oi.getVariant()).map(ProductVariantEntity::getId).orElse(null))
                            .quantity(oi.getQuantity())
                            .priceSnapshot(oi.getUnitPrice())
                            .build();

                    CartItemEntity ci = cartItemModel.toEntity();
                    ci.setCart(cart);
                    ci.setProduct(product);
                    ci.setVariant(oi.getVariant());
                    cartItemRepository.save(ci);
                    cart.getItems().add(ci);
                });
            }
        });
    }


    private String generateOrderNumber() {
        String candidate;
        do {
            candidate = "SO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (orderRepository.existsByOrderNumber(candidate));
        return candidate;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> search(OrderSearchParams params, Pageable pageable) {
        return orderRepository.findAll(OrderSpecifications.build(params), pageable).map(Order::fromEntity);
    }

    @Override
    @Transactional
    public Order updateStatus(Long orderId, OrderStatusEnum newStatus, String reason, Long adminUserId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        OrderStatusEnum current = order.getStatus();
        if (current == newStatus) {
            return Order.fromEntity(order);
        }
        boolean canTransition = Optional.ofNullable(current).map(c -> c.canTransitionTo(newStatus)).orElse(false);
        if (canTransition) {
            if (newStatus == OrderStatusEnum.CANCELLED && current == OrderStatusEnum.PENDING) {
                releaseReservations(order, "order.updateStatus.cancel:" + order.getOrderNumber());
            }

            Order model = Order.fromEntity(order);
            model.setPreviousStatus(current);
            model.setStatus(newStatus);
            model.setStatusChangedAt(LocalDateTime.now());
            model.setStatusChangeReason(reason);
            order = model.toEntity(order);

            OrderEntity saved = orderRepository.save(order);
            notificationService.notifyStatusChange(saved, current);
            log.info("Order {} status {} -> {} by admin={}", saved.getOrderNumber(), current, newStatus, adminUserId);
            return Order.fromEntity(saved);
        }
        throw new InvalidOrderStatusTransitionException("Invalid order status transition: " + current + " -> " + newStatus);
    }

    @Override
    @Transactional(readOnly = true)
    public void exportCsv(OrderSearchParams params, Writer writer) {
        String[] headers = {"orderNumber", "createdAt", "status", "customerName", "customerEmail", "customerPhone", "total", "currency", "itemCount"};
        try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT.builder().setHeader(headers).build())) {
            DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            orderRepository.findAll(OrderSpecifications.build(params)).forEach(order -> printOrderRecord(printer, order, fmt));
            printer.flush();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private void printOrderRecord(CSVPrinter printer, OrderEntity order, DateTimeFormatter fmt) {
        try {
            int itemCount = CollectionUtils.isEmpty(order.getItems()) ? 0 : order.getItems().size();
            printer.printRecord(order.getOrderNumber(),
                    Optional.ofNullable(order.getCreatedAt()).map(c -> c.format(fmt)).orElse(""),
                    Optional.ofNullable(order.getStatus()).map(Enum::name).orElse(""),
                    Optional.ofNullable(order.getCustomerName()).orElse(""),
                    Optional.ofNullable(order.getCustomerEmail()).orElse(""),
                    Optional.ofNullable(order.getCustomerPhone()).orElse(""),
                    Optional.ofNullable(order.getTotal()).map(BigDecimal::toPlainString).orElse("0"),
                    Optional.ofNullable(order.getCurrency()).orElse("MGA"),
                    itemCount);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private void releaseReservations(OrderEntity order, String reason) {
        Long userId = Optional.ofNullable(order.getUserAccount()).map(UserAccountEntity::getId).orElse(null);
        for (OrderItemEntity oi : order.getItems()) {
            Optional.ofNullable(oi.getProduct()).ifPresent(product -> {
                Long variantId = Optional.ofNullable(oi.getVariant()).map(ProductVariantEntity::getId).orElse(null);
                inventoryService.releaseReservation(product.getId(), variantId, oi.getQuantity(), userId, reason);
            });
        }
    }
}
