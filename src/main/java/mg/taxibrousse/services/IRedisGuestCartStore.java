package mg.taxibrousse.services;

import mg.taxibrousse.models.Cart;

import java.util.Optional;

public interface IRedisGuestCartStore {

    Optional<Cart> find(String senderId);

    Cart save(String senderId, Cart cart);

    void delete(String senderId);

    boolean exists(String senderId);

    long nextItemId(String senderId);
}
