package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IWishlistController;
import mg.taxibrousse.dto.shop.AddWishlistItemRequest;
import mg.taxibrousse.models.Wishlist;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IWishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WishlistController implements IWishlistController {

    private final IWishlistService wishlistService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<Wishlist> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getOrCreate(requireUserId(authentication)));
    }

    @Override
    public ResponseEntity<Wishlist> addItem(Authentication authentication, AddWishlistItemRequest request) {
        return ResponseEntity.ok(wishlistService.addItem(requireUserId(authentication), request.getProductId()));
    }

    @Override
    public ResponseEntity<Wishlist> removeItem(Authentication authentication, Long itemId) {
        return ResponseEntity.ok(wishlistService.removeItem(requireUserId(authentication), itemId));
    }

    private Long requireUserId(Authentication authentication) {
        boolean hasAuth = authentication != null && authentication.isAuthenticated() && authentication.getName() != null;
        if (!hasAuth) {
            throw new ShopException("error_authentication_required", "exception_authentication_required");
        }
        return userInfoRepository.findByUsername(authentication.getName())
                .map(u -> u.getId())
                .orElseThrow(() -> new ShopException("error_authentication_required", "exception_authentication_required"));
    }
}
