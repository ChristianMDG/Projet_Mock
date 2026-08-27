package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.WishlistItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IWishlistItemRepository extends JpaRepository<WishlistItemEntity, Long> {

    Optional<WishlistItemEntity> findByWishlistIdAndProductId(Long wishlistId, Long productId);

    @Query("SELECT DISTINCT w.product.category.id FROM ShopWishlistItem w " + "WHERE w.wishlist.userAccount.id = :userId AND w.product.category IS NOT NULL")
    List<Long> findWishlistCategoryIdsByUser(@Param("userId") Long userId);

    @Query("SELECT w.product.id FROM ShopWishlistItem w WHERE w.wishlist.userAccount.id = :userId")
    List<Long> findWishlistProductIdsByUser(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM ShopWishlistItem w WHERE w.product.stock = 0 AND w.addedAt < :before")
    int deleteOutOfStockOlderThan(@Param("before") LocalDateTime before);
}
