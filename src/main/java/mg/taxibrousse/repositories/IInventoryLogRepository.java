package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.InventoryLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IInventoryLogRepository extends JpaRepository<InventoryLogEntity, Long> {

    Page<InventoryLogEntity> findByInventoryIdOrderByCreatedAtDesc(Long inventoryId, Pageable pageable);
}
