package mg.taxibrousse.repositories.specs;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import mg.taxibrousse.dto.shop.OrderSearchParams;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.OrderItemEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class OrderSpecifications {

    private OrderSpecifications() {
    }

    public static Specification<OrderEntity> build(OrderSearchParams p) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (p == null) {
                return cb.conjunction();
            }

            if (p.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), p.getStatus()));
            }
            if (p.getDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), p.getDateFrom()));
            }
            if (p.getDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), p.getDateTo()));
            }
            if (p.getCustomerId() != null) {
                predicates.add(cb.equal(root.get("userAccount").get("id"), p.getCustomerId()));
            }
            boolean hasQuery = StringUtils.hasText(p.getQ());
            if (hasQuery) {
                String like = "%" + p.getQ().toLowerCase() + "%";
                Predicate onNumber = cb.like(cb.lower(root.get("orderNumber")), like);
                Predicate onName = cb.like(cb.lower(cb.coalesce(root.get("customerName"), "")), like);
                Predicate onEmail = cb.like(cb.lower(cb.coalesce(root.get("customerEmail"), "")), like);
                Predicate onPhone = cb.like(cb.lower(cb.coalesce(root.get("customerPhone"), "")), like);

                Join<OrderEntity, OrderItemEntity> items = root.join("items", JoinType.LEFT);
                Predicate onProduct = cb.like(cb.lower(cb.coalesce(items.get("productName"), "")), like);

                if (query != null) {
                    query.distinct(true);
                }

                predicates.add(cb.or(onNumber, onName, onEmail, onPhone, onProduct));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}