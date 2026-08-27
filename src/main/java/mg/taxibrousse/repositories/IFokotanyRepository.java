package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.FokotanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFokotanyRepository extends JpaRepository<FokotanyEntity, Long> {
}
