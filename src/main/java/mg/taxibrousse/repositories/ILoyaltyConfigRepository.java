package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.LoyaltyConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ILoyaltyConfigRepository extends JpaRepository<LoyaltyConfigEntity, Long> {
}
