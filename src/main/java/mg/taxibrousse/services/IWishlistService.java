package mg.taxibrousse.services;

import mg.taxibrousse.models.Wishlist;

public interface IWishlistService {

    Wishlist getOrCreate(Long userAccountId);

    Wishlist addItem(Long userAccountId, Long productId);

    Wishlist removeItem(Long userAccountId, Long itemId);

    int pruneOutOfStockOlderThanDays(int days);
}
