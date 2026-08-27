package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CartEntity;
import mg.taxibrousse.entities.enums.CartStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICartRepository extends JpaRepository<CartEntity, Long> {

    Optional<CartEntity> findFirstByUserAccountIdAndStatus(Long userAccountId, CartStatusEnum status);

    /** Returns any cart for the user regardless of status (used to recycle when a unique DB constraint prevents a new insert). */
    Optional<CartEntity> findFirstByUserAccountId(Long userAccountId);

    Optional<CartEntity> findFirstBySessionTokenAndStatus(String sessionToken, CartStatusEnum status);
}
