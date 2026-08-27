package mg.taxibrousse.repositories.specs;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import mg.taxibrousse.dto.shop.ProductSearchParams;
import mg.taxibrousse.entities.ProductEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Dynamic predicates for product search/filtering.
 *
 * NOTE: Full-text search on (name, description, shortDescription) currently uses
 * a safe portable ILIKE %q% on concatenated fields. A follow-up task can upgrade
 * this to PostgreSQL to_tsvector('french', ...) with pg_trgm once the extension
 * is confirmed in all environments.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<ProductEntity> build(ProductSearchParams p) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isTrue(root.get("isActive")));

            if (p == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            boolean hasQuery = StringUtils.hasText(p.getQ());
            if (hasQuery) {
                String like = "%" + p.getQ().toLowerCase() + "%";
                Predicate onName = cb.like(cb.lower(root.get("name")), like);
                Predicate onDesc = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like);
                Predicate onShort = cb.like(cb.lower(cb.coalesce(root.get("shortDescription"), "")), like);
                predicates.add(cb.or(onName, onDesc, onShort));
            }

            if (p.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), p.getCategoryId()));
            }

            boolean hasCategorySlug = StringUtils.hasText(p.getCategorySlug());
            if (hasCategorySlug) {
                predicates.add(cb.equal(root.get("category").get("slug"), p.getCategorySlug()));
            }

            if (p.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), p.getMinPrice()));
            }
            if (p.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), p.getMaxPrice()));
            }

            if (Boolean.TRUE.equals(p.getInStock())) {
                predicates.add(cb.greaterThan(root.get("stock"), 0));
            }

            if (p.getMinRating() != null) {
                Expression<Number> rating = cb.coalesce(root.get("rating"), 0);
                predicates.add(cb.ge(rating, p.getMinRating()));
            }

            // Tags are not yet modelled on ProductEntity. Placeholder for future schema.
            // TODO: add product_tag relation and filter here.

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
