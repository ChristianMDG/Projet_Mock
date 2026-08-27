package mg.taxibrousse.services;

import mg.taxibrousse.models.Product;

import java.util.List;

public interface IRecommendationService {

    List<Product> findRelatedProducts(Long productId, int limit);

    List<Product> findFrequentlyBoughtTogether(Long productId, int limit);

    List<Product> findPersonalizedRecommendations(Long userAccountId, int limit);
}
