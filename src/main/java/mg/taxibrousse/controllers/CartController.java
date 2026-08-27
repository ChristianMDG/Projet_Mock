package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ICartController;
import mg.taxibrousse.entities.BaseEntity;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.models.CartItem;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.ICartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CartController implements ICartController {

    private final ICartService cartService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<Cart> getCart(Authentication authentication, String senderId, String sessionToken) {
        return ResponseEntity.ok(cartService.getOrCreateCart(resolveUserId(authentication), guestKey(senderId, sessionToken)));
    }

    @Override
    public ResponseEntity<Cart> addItem(Authentication authentication, String senderId, String sessionToken, CartItem request) {
        return ResponseEntity.ok(cartService.addItem(resolveUserId(authentication), guestKey(senderId, sessionToken), request));
    }

    @Override
    public ResponseEntity<Cart> updateItem(Authentication authentication, String senderId, String sessionToken, Long id, CartItem request) {
        return ResponseEntity.ok(cartService.updateItem(resolveUserId(authentication), guestKey(senderId, sessionToken), id, request));
    }

    @Override
    public ResponseEntity<Cart> removeItem(Authentication authentication, String senderId, String sessionToken, Long id) {
        return ResponseEntity.ok(cartService.removeItem(resolveUserId(authentication), guestKey(senderId, sessionToken), id));
    }

    @Override
    public ResponseEntity<Cart> mergeCart(Authentication authentication, String senderId, String sessionToken) {
        return ResponseEntity.ok(cartService.merge(resolveUserId(authentication), guestKey(senderId, sessionToken)));
    }

    /** Prefer X-Sender-Id; fall back to X-Cart-Session for backward compat. */
    private static String guestKey(String senderId, String sessionToken) {
        if (StringUtils.hasText(senderId)) {
            return senderId;
        }
        return sessionToken;
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated() && authentication.getName() != null) {
            return userInfoRepository.findByUsername(authentication.getName()).map(BaseEntity::getId).orElse(null);
        }
        return null;
    }
}
