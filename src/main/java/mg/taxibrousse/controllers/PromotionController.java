package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IPromotionController;
import mg.taxibrousse.dto.shop.PromotionValidationResponse;
import mg.taxibrousse.dto.shop.ValidatePromotionRequest;
import mg.taxibrousse.models.Promotion;
import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.repositories.ICartRepository;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.ICartService;
import mg.taxibrousse.services.IPromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PromotionController implements IPromotionController {

    private final IPromotionService promotionService;
    private final ICartService cartService;
    private final ICartRepository cartRepository;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<List<Promotion>> listActive() {
        return ResponseEntity.ok(promotionService.listActive());
    }

    @Override
    public ResponseEntity<Promotion> getById(Long id) {
        return ResponseEntity.ok(promotionService.findById(id));
    }

    @Override
    public ResponseEntity<Promotion> create(Promotion request) {
        return ResponseEntity.ok(promotionService.create(request));
    }

    @Override
    public ResponseEntity<Promotion> update(Long id, Promotion request) {
        return ResponseEntity.ok(promotionService.update(id, request));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<PromotionValidationResponse> validate(Authentication authentication, String sessionToken, ValidatePromotionRequest request) {
        CartEntity cart = resolveCart(authentication, sessionToken, request.getCartId(), request.getSessionToken());
        return ResponseEntity.ok(promotionService.validate(request.getCode(), cart));
    }

    private CartEntity resolveCart(Authentication authentication, String headerSession, Long explicitCartId, String bodySession) {
        if (explicitCartId != null) {
            return cartRepository.findById(explicitCartId).orElse(null);
        }
        Long userId = resolveUserId(authentication);
        String effectiveSession = headerSession != null ? headerSession : bodySession;
        boolean hasLookupKey = userId != null || effectiveSession != null;
        if (!hasLookupKey) {
            return null;
        }
        return cartService.resolveOrCreateCartEntity(userId, effectiveSession);
    }

    private Long resolveUserId(Authentication authentication) {
        boolean hasAuth = authentication != null && authentication.isAuthenticated() && authentication.getName() != null;
        if (!hasAuth) {
            return null;
        }
        return userInfoRepository.findByUsername(authentication.getName()).map(u -> u.getId()).orElse(null);
    }
}
