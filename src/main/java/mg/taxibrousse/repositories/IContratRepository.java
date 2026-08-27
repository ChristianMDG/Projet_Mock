package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ContratEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IContratRepository extends JpaRepository<ContratEntity, Long> {
}
