package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IRecommendationController;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Product;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecommendationController implements IRecommendationController {

    private final IRecommendationService recommendationService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<List<Product>> getRelatedProducts(Long id, int limit) {
        return ResponseEntity.ok(recommendationService.findRelatedProducts(id, limit));
    }

    @Override
    public ResponseEntity<List<Product>> getFrequentlyBoughtTogether(Long id, int limit) {
        return ResponseEntity.ok(recommendationService.findFrequentlyBoughtTogether(id, limit));
    }

    @Override
    public ResponseEntity<List<Product>> getPersonalizedRecommendations(Authentication authentication, int limit) {
        Long userId = requireUserId(authentication);
        return ResponseEntity.ok(recommendationService.findPersonalizedRecommendations(userId, limit));
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
