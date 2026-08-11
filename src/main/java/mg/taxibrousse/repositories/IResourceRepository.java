package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface IResourceRepository extends JpaRepository<ResourceEntity, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Resource")
    void deleteAllResources();
}
