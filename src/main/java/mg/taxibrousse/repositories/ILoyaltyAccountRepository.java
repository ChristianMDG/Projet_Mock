package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.LoyaltyAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ILoyaltyAccountRepository extends JpaRepository<LoyaltyAccountEntity, Long> {

    Optional<LoyaltyAccountEntity> findByVoyageurId(Long voyageurId);
}
