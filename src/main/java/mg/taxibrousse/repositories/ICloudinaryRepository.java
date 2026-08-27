package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.CloudinaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICloudinaryRepository extends JpaRepository<CloudinaryEntity, Long> {

    Boolean existsByPublicId(String publicId);

    Optional<CloudinaryEntity> findByPublicId(String publicId);
}
