package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.FacturationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFacturationRepository extends JpaRepository<FacturationEntity, Long> {
    
    Optional<FacturationEntity> findByReservationId(Long reservationId);
    
    Optional<FacturationEntity> findByInvoiceNumber(String invoiceNumber);
}
