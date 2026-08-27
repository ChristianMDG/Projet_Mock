package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.FraisTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFraisTransactionRepository extends JpaRepository<FraisTransactionEntity, Long> {

    Optional<FraisTransactionEntity> findByOperatorName(String operatorName);
}
