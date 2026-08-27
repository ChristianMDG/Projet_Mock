package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.PaymentKoperativeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPaymentKoperativeRepository extends JpaRepository<PaymentKoperativeEntity, Long> {

    Optional<PaymentKoperativeEntity> findByVoyageId(Long voyageId);
}
