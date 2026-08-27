package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartItemRepository extends JpaRepository<CartItemEntity, Long> {

    List<CartItemEntity> findByCartId(Long cartId);
}
