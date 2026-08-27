package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.WishlistEntity;
import mg.taxibrousse.entities.WishlistItemEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Wishlist;
import mg.taxibrousse.models.WishlistItem;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IWishlistItemRepository;
import mg.taxibrousse.repositories.IWishlistRepository;
import mg.taxibrousse.services.IWishlistService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class WishlistService implements IWishlistService {

    private final IWishlistRepository wishlistRepository;
    private final IWishlistItemRepository wishlistItemRepository;
    private final IProductRepository productRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public Wishlist getOrCreate(Long userAccountId) {
        WishlistEntity wishlist = loadOrCreate(userAccountId);
        return Wishlist.fromEntity(wishlist);
    }

    @Override
    @Transactional
    public Wishlist addItem(Long userAccountId, Long productId) {
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        WishlistEntity wishlist = loadOrCreate(userAccountId);
        wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId).ifPresent(existing -> {
            throw new ShopException("error_wishlist_item_exists", "exception_wishlist_item_exists");
        });

        WishlistItem itemModel = WishlistItem.builder().wishlistId(wishlist.getId()).productId(product.getId()).addedAt(LocalDateTime.now()).build();

        WishlistItemEntity item = itemModel.toEntity();
        item.setWishlist(wishlist);
        item.setProduct(product);
        wishlistItemRepository.save(item);
        wishlist.getItems().add(item);
        return Wishlist.fromEntity(wishlist);
    }

    @Override
    @Transactional
    public Wishlist removeItem(Long userAccountId, Long itemId) {
        WishlistItemEntity item = wishlistItemRepository.findById(itemId).orElseThrow(() -> new EntityNotFoundException("Wishlist item not found: " + itemId));
        boolean ownsItem = Optional.ofNullable(item.getWishlist()).map(WishlistEntity::getUserAccount).map(UserAccountEntity::getId).map(id -> Objects.equals(id, userAccountId)).orElse(false);
        if (ownsItem) {
            WishlistEntity wishlist = item.getWishlist();
            wishlist.getItems().removeIf(i -> Objects.equals(i.getId(), itemId));
            wishlistItemRepository.delete(item);
            return Wishlist.fromEntity(wishlist);
        }
        throw new ShopException("error_access_denied", "exception_access_denied");
    }

    @Override
    @Transactional
    public int pruneOutOfStockOlderThanDays(int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        int removed = wishlistItemRepository.deleteOutOfStockOlderThan(cutoff);
        log.info("Wishlist cleanup removed {} out-of-stock items older than {} days", removed, days);
        return removed;
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void scheduledCleanup() {
        pruneOutOfStockOlderThanDays(30);
    }

    private WishlistEntity loadOrCreate(Long userAccountId) {
        return wishlistRepository.findByUserAccountId(userAccountId).orElseGet(() -> {
            Wishlist model = Wishlist.builder().userAccountId(userAccountId).build();
            WishlistEntity w = model.toEntity();
            w.setUserAccount(entityManager.getReference(UserAccountEntity.class, userAccountId));
            return wishlistRepository.save(w);
        });
    }
}
