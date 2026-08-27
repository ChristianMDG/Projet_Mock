package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IWishlistRepository extends JpaRepository<WishlistEntity, Long> {

    Optional<WishlistEntity> findByUserAccountId(Long userAccountId);
}
