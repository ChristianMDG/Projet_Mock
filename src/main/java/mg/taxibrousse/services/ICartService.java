package mg.taxibrousse.services;

import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.models.CartItem;

public interface ICartService {

    /**
     * Resolve a cart for the user (JPA) or guest (Redis, keyed by senderId/sessionToken).
     *
     * @param userAccountId authenticated user id, may be null
     * @param guestKey guest identifier; senderId is preferred over legacy sessionToken
     */
    Cart getOrCreateCart(Long userAccountId, String guestKey);

    /**
     * @deprecated kept for callers that need a JPA cart entity. For guests this returns
     * an unsaved transient entity built from Redis content.
     */
    @Deprecated
    CartEntity resolveOrCreateCartEntity(Long userAccountId, String guestKey);

    /** Resolve or create the JPA cart for an authenticated user. */
    CartEntity resolveOrCreateUserCartEntity(Long userAccountId);

    Cart addItem(Long userAccountId, String guestKey, CartItem request);

    Cart updateItem(Long userAccountId, String guestKey, Long itemId, CartItem request);

    Cart removeItem(Long userAccountId, String guestKey, Long itemId);

    /**
     * Merge a guest Redis cart into the authenticated user's JPA cart, then delete the Redis cart.
     */
    Cart merge(Long userAccountId, String guestKey);

    /** Delete the guest cart from Redis (no-op for authenticated users). */
    void deleteGuestCart(String guestKey);
}
