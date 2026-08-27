package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.*;
import mg.taxibrousse.entities.enums.CartStatusEnum;
import mg.taxibrousse.exceptions.InsufficientStockException;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.models.CartItem;
import mg.taxibrousse.repositories.ICartItemRepository;
import mg.taxibrousse.repositories.ICartRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IProductVariantRepository;
import mg.taxibrousse.services.ICartService;
import mg.taxibrousse.services.IInventoryService;
import mg.taxibrousse.services.IRedisGuestCartStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Cart service that uses two distinct stores:
 * <ul>
 * <li><b>Authenticated users</b>: JPA cart bound to {@code userAccountId}</li>
 * <li><b>Guests</b>: Redis-backed cart keyed by senderId (or legacy sessionToken)</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IProductRepository productRepository;
    private final IProductVariantRepository variantRepository;
    private final IInventoryService inventoryService;
    private final IRedisGuestCartStore guestCartStore;

    /* ------------------------------------------------------------------ */
    /* Reads */
    /* ------------------------------------------------------------------ */

    @Override
    @Transactional
    public Cart getOrCreateCart(Long userAccountId, String guestKey) {
        if (userAccountId != null) {
            return Cart.fromEntity(resolveOrCreateUserCartEntity(userAccountId));
        }
        return loadGuestCart(guestKey);
    }

    @Override
    @Transactional
    public CartEntity resolveOrCreateCartEntity(Long userAccountId, String guestKey) {
        if (userAccountId != null) {
            return resolveOrCreateUserCartEntity(userAccountId);
        }
        return buildTransientGuestCartEntity(guestKey);
    }

    @Override
    @Transactional
    public CartEntity resolveOrCreateUserCartEntity(Long userAccountId) {
        Long userId = Optional.ofNullable(userAccountId).orElseThrow(() -> new ShopException("error_user_required", "exception_user_required"));
        Optional<CartEntity> activeCart = cartRepository.findFirstByUserAccountIdAndStatus(userId, CartStatusEnum.ACTIVE);
        if (activeCart.isPresent()) {
            return activeCart.get();
        }
        // The DB has a unique constraint on user_account_id — recycle the existing cart row (if any)
        // rather than inserting a new one, to avoid a duplicate-key violation.
        Optional<CartEntity> existingCart = cartRepository.findFirstByUserAccountId(userId);
        if (existingCart.isPresent()) {
            CartEntity cart = existingCart.get();
            cart.setStatus(CartStatusEnum.ACTIVE);
            cart.getItems().clear();
            return cartRepository.save(cart);
        }
        Cart model = Cart.cartBuilder().userAccountId(userId).status(CartStatusEnum.ACTIVE).build();
        return cartRepository.save(model.toEntity());
    }


    /* ------------------------------------------------------------------ */
    /* Writes */
    /* ------------------------------------------------------------------ */

    @Override
    @Transactional
    public Cart addItem(Long userAccountId, String guestKey, CartItem request) {
        if (userAccountId == null) {
            return addItemGuest(guestKey, request);
        }
        return addItemUser(userAccountId, request);
    }

    @Override
    @Transactional
    public Cart updateItem(Long userAccountId, String guestKey, Long itemId, CartItem request) {
        if (userAccountId != null) {
            return updateItemUser(userAccountId, itemId, request);
        }
        return updateItemGuest(guestKey, itemId, request);
    }

    @Override
    @Transactional
    public Cart removeItem(Long userAccountId, String guestKey, Long itemId) {
        if (userAccountId != null) {
            return removeItemUser(userAccountId, itemId);
        }
        return removeItemGuest(guestKey, itemId);
    }

    @Override
    @Transactional
    public Cart merge(Long userAccountId, String guestKey) {
        if (userAccountId == null) {
            throw new ShopException("error_cart_merge_requires_user", "exception_cart_merge_requires_auth");
        }
        if (StringUtils.hasText(guestKey)) {
            CartEntity userCart = resolveOrCreateUserCartEntity(userAccountId);

            // 1. Redis-based guest cart (new path)
            Optional<Cart> guest = guestCartStore.find(guestKey);
            if (guest.isPresent()) {
                mergeGuestItemsIntoUserCart(guest.get(), userCart);
                guestCartStore.delete(guestKey);
            }

            // 2. Legacy JPA-based guest cart (backward-compat for carts created before this change)
            Optional<CartEntity> legacy = cartRepository.findFirstBySessionTokenAndStatus(guestKey, CartStatusEnum.ACTIVE);
            if (legacy.isPresent() && !legacy.get().getId().equals(userCart.getId())) {
                CartEntity legacyCart = legacy.get();
                for (CartItemEntity gi : legacyCart.getItems()) {
                    upsertUserCartItem(userCart, gi.getProduct(), gi.getVariant(), gi.getQuantity(), gi.getPriceSnapshot());
                }
                legacyCart.setStatus(CartStatusEnum.ABANDONED);
                cartRepository.save(legacyCart);
            }

            return Cart.fromEntity(cartRepository.findById(userCart.getId()).orElse(userCart));
        }
        return getOrCreateCart(userAccountId, null);
    }

    @Override
    public void deleteGuestCart(String guestKey) {
        guestCartStore.delete(guestKey);
    }

    /* ------------------------------------------------------------------ */
    /* Authenticated user path */
    /* ------------------------------------------------------------------ */

    private Cart addItemUser(Long userAccountId, CartItem request) {
        CartEntity cart = resolveOrCreateUserCartEntity(userAccountId);
        ProductEntity product = productRepository.findById(request.getProductId()).orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.getProductId()));
        ProductVariantEntity variant = resolveVariant(request.getVariantId());

        Optional<CartItemEntity> existingItem = cart.getItems().stream().filter(i -> matchesItem(i, product.getId(), variant != null ? variant.getId() : null)).findFirst();

        int desiredQuantity = existingItem.map(CartItemEntity::getQuantity).orElse(0) + request.getQuantity();

        if (desiredQuantity <= 0) {
            existingItem.ifPresent(i -> {
                cart.getItems().remove(i);
                cartItemRepository.delete(i);
            });
            return Cart.fromEntity(cart);
        }

        CartItemEntity item = existingItem.orElseGet(() -> {
            CartItemEntity i = new CartItemEntity();
            i.setCart(cart);
            i.setProduct(product);
            i.setVariant(variant);
            i.setQuantity(0);
            cart.getItems().add(i);
            return i;
        });
        item.setQuantity(desiredQuantity);
        item.setPriceSnapshot(effectivePrice(product, variant));
        cartItemRepository.save(item);
        return Cart.fromEntity(cart);
    }

    private Cart updateItemUser(Long userAccountId, Long itemId, CartItem request) {
        CartEntity cart = requireUserCart(userAccountId);
        CartItemEntity item = cartItemRepository.findById(itemId).orElseThrow(() -> new EntityNotFoundException("Cart item not found: " + itemId));
        if (item.getCart().getId().equals(cart.getId())) {
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
            return Cart.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
        } else {
            throw new ShopException("error_cart_item_mismatch", "exception_cart_item_not_in_cart");
        }
    }

    private Cart removeItemUser(Long userAccountId, Long itemId) {
        CartEntity cart = requireUserCart(userAccountId);
        CartItemEntity item = cartItemRepository.findById(itemId).orElseThrow(() -> new EntityNotFoundException("Cart item not found: " + itemId));
        if (item.getCart().getId().equals(cart.getId())) {
            // ok, proceed with delete below
        } else {
            throw new ShopException("error_cart_item_mismatch", "exception_cart_item_not_in_cart");
        }
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartItemRepository.delete(item);
        return Cart.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
    }

    private CartEntity requireUserCart(Long userAccountId) {
        return cartRepository.findFirstByUserAccountIdAndStatus(userAccountId, CartStatusEnum.ACTIVE).orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    /* ------------------------------------------------------------------ */
    /* Guest path */
    /* ------------------------------------------------------------------ */

    private Cart loadGuestCart(String guestKey) {
        if (StringUtils.hasText(guestKey)) {
            return guestCartStore.find(guestKey).orElseGet(() -> newEmptyGuestCart(guestKey));
        }
        return newEmptyGuestCart(null);
    }

    private Cart newEmptyGuestCart(String guestKey) {
        Cart cart = new Cart();
        cart.setStatus(CartStatusEnum.ACTIVE);
        cart.setSessionToken(guestKey);
        cart.setItems(new ArrayList<>());
        cart.setSubtotal(BigDecimal.ZERO);
        cart.setItemCount(0);
        return cart;
    }

    private Cart addItemGuest(String guestKey, CartItem request) {
        if (StringUtils.hasText(guestKey)) {
            ProductEntity product = productRepository.findById(request.getProductId()).orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.getProductId()));
            ProductVariantEntity variant = resolveVariant(request.getVariantId());
            Long variantId = variant == null ? null : variant.getId();

            Cart cart = guestCartStore.find(guestKey).orElseGet(() -> newEmptyGuestCart(guestKey));
            List<CartItem> items = cart.getItems() == null ? new ArrayList<>() : cart.getItems();
            cart.setItems(items);

            Optional<CartItem> existing = items.stream().filter(i -> Objects.equals(i.getProductId(), product.getId()) && Objects.equals(i.getVariantId(), variantId)).findFirst();

            int desiredQuantity = existing.map(CartItem::getQuantity).orElse(0) + request.getQuantity();

            if (desiredQuantity <= 0) {
                existing.ifPresent(items::remove);
                recomputeTotals(cart);
                guestCartStore.save(guestKey, cart);
                return cart;
            }

            BigDecimal unit = effectivePrice(product, variant);
            if (existing.isPresent()) {
                CartItem item = existing.get();
                item.setQuantity(desiredQuantity);
                item.setPriceSnapshot(unit);
                item.setUnitPrice(unit);
                item.setLineTotal(unit.multiply(BigDecimal.valueOf(desiredQuantity)));
            } else {
                CartItem item = new CartItem();
                item.setId(guestCartStore.nextItemId(guestKey));
                item.setProductId(product.getId());
                item.setProductName(product.getName());
                item.setProductSku(product.getSku());
                item.setProductImageUrl(resolvePrimaryImage(product));
                item.setVariantId(variantId);
                item.setQuantity(desiredQuantity);
                item.setPriceSnapshot(unit);
                item.setUnitPrice(unit);
                item.setLineTotal(unit.multiply(BigDecimal.valueOf(desiredQuantity)));
                items.add(item);
            }

            recomputeTotals(cart);
            guestCartStore.save(guestKey, cart);
            return cart;
        }
        throw new ShopException("error_sender_id_required", "exception_sender_id_required");
    }

    private Cart updateItemGuest(String guestKey, Long itemId, CartItem request) {
        Cart cart = requireGuestCart(guestKey);
        CartItem item = findGuestItem(cart, itemId);
        item.setQuantity(request.getQuantity());
        BigDecimal unit = item.getUnitPrice() != null ? item.getUnitPrice() : item.getPriceSnapshot();
        if (unit != null) {
            item.setLineTotal(unit.multiply(BigDecimal.valueOf(request.getQuantity())));
        }
        recomputeTotals(cart);
        guestCartStore.save(guestKey, cart);
        return cart;
    }

    private Cart removeItemGuest(String guestKey, Long itemId) {
        Cart cart = requireGuestCart(guestKey);
        boolean removed = cart.getItems() != null && cart.getItems().removeIf(i -> Objects.equals(i.getId(), itemId));
        if (removed) {
            recomputeTotals(cart);
            guestCartStore.save(guestKey, cart);
            return cart;
        } else {
            throw new ShopException("error_cart_item_mismatch", "exception_cart_item_not_in_cart");
        }
    }

    private Cart requireGuestCart(String guestKey) {
        return guestCartStore.find(guestKey).orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    private CartItem findGuestItem(Cart cart, Long itemId) {
        if (cart.getItems() == null) {
            throw new EntityNotFoundException("Cart item not found: " + itemId);
        }
        return cart.getItems().stream().filter(i -> Objects.equals(i.getId(), itemId)).findFirst().orElseThrow(() -> new EntityNotFoundException("Cart item not found: " + itemId));
    }

    private CartEntity buildTransientGuestCartEntity(String guestKey) {
        Cart guest = loadGuestCart(guestKey);
        CartEntity entity = new CartEntity();
        entity.setStatus(CartStatusEnum.ACTIVE);
        entity.setSessionToken(guestKey);
        if (guest.getItems() != null) {
            for (CartItem ci : guest.getItems()) {
                CartItemEntity ie = new CartItemEntity();
                ie.setCart(entity);
                ProductEntity p = productRepository.findById(ci.getProductId()).orElseThrow(() -> new EntityNotFoundException("Product not found: " + ci.getProductId()));
                ie.setProduct(p);
                if (ci.getVariantId() != null) {
                    ie.setVariant(variantRepository.findById(ci.getVariantId()).orElse(null));
                }
                ie.setQuantity(ci.getQuantity());
                ie.setPriceSnapshot(ci.getPriceSnapshot());
                entity.getItems().add(ie);
            }
        }
        return entity;
    }

    /* ------------------------------------------------------------------ */
    /* Helpers */
    /* ------------------------------------------------------------------ */

    private void mergeGuestItemsIntoUserCart(Cart guest, CartEntity userCart) {
        if (guest.getItems() == null) {
            return;
        }
        for (CartItem gi : guest.getItems()) {
            ProductEntity product = productRepository.findById(gi.getProductId()).orElse(null);
            if (product == null) {
                continue;
            }
            ProductVariantEntity variant = gi.getVariantId() != null ? variantRepository.findById(gi.getVariantId()).orElse(null) : null;
            BigDecimal price = gi.getPriceSnapshot() != null ? gi.getPriceSnapshot() : effectivePrice(product, variant);
            upsertUserCartItem(userCart, product, variant, gi.getQuantity(), price);
        }
    }

    private void upsertUserCartItem(CartEntity userCart, ProductEntity product, ProductVariantEntity variant, Integer quantity, BigDecimal priceSnapshot) {
        Long productId = product.getId();
        Long variantId = variant != null ? variant.getId() : null;
        int qty = quantity != null ? quantity : 0;
        if (qty <= 0) {
            return;
        }
        Optional<CartItemEntity> match = userCart.getItems().stream().filter(i -> matchesItem(i, productId, variantId)).findFirst();
        int mergedQty = match.map(CartItemEntity::getQuantity).orElse(0) + qty;
        int available = inventoryService.availableQuantity(productId, variantId);
        int finalQty = Math.min(mergedQty, available);
        if (finalQty <= 0) {
            return;
        }
        if (match.isPresent()) {
            match.get().setQuantity(finalQty);
            cartItemRepository.save(match.get());
            return;
        }
        CartItemEntity copy = new CartItemEntity();
        copy.setCart(userCart);
        copy.setProduct(product);
        copy.setVariant(variant);
        copy.setQuantity(finalQty);
        copy.setPriceSnapshot(priceSnapshot);
        cartItemRepository.save(copy);
        userCart.getItems().add(copy);
    }

    private ProductVariantEntity resolveVariant(Long variantId) {
        if (variantId == null) {
            return null;
        }
        return variantRepository.findById(variantId).orElseThrow(() -> new EntityNotFoundException("Variant not found: " + variantId));
    }

    private boolean matchesItem(CartItemEntity item, Long productId, Long variantId) {
        if (item.getProduct().getId().equals(productId)) {
            Long itemVariantId = item.getVariant() != null ? item.getVariant().getId() : null;
            return Objects.equals(itemVariantId, variantId);
        }
        return false;
    }

    private BigDecimal effectivePrice(ProductEntity product, ProductVariantEntity variant) {
        if (variant != null && variant.getPriceOverride() != null) {
            return variant.getPriceOverride();
        }
        return product.getPrice();
    }

    private String resolvePrimaryImage(ProductEntity product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }
        return product.getImages().stream().filter(img -> Boolean.TRUE.equals(img.getIsPrimary())).findFirst().orElse(product.getImages().get(0)).getUrl();
    }

    private void recomputeTotals(Cart cart) {
        List<CartItem> items = cart.getItems() != null ? cart.getItems() : List.of();
        BigDecimal subtotal = items.stream().map(CartItem::getLineTotal).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = items.stream().map(CartItem::getQuantity).filter(Objects::nonNull).mapToInt(Integer::intValue).sum();
        cart.setSubtotal(subtotal);
        cart.setItemCount(count);
    }
}
