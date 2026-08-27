package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CrafterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICrafterRepository extends JpaRepository<CrafterEntity, Long> {

    List<CrafterEntity> findByKoperativeId(Long koperativeId);

    List<CrafterEntity> findByIsActive(Boolean isActive);
}
