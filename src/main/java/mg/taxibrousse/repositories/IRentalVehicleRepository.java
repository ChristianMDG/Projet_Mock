package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.RentalVehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IRentalVehicleRepository extends JpaRepository<RentalVehicleEntity, Long> {

    List<RentalVehicleEntity> findByAvailableTrue();

    List<RentalVehicleEntity> findByCategory(String category);

    List<RentalVehicleEntity> findByCategoryAndAvailableTrue(String category);
}
