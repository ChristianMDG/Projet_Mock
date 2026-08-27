package mg.taxibrousse.services;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.RentalVehicleEntity;
import mg.taxibrousse.repositories.IRentalVehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RentalVehicleService {

    private final IRentalVehicleRepository repository;

    public List<RentalVehicleEntity> findAllAvailable() {
        return repository.findByAvailableTrue();
    }

    public List<RentalVehicleEntity> findByCategory(String category) {
        return repository.findByCategoryAndAvailableTrue(category);
    }

    public Optional<RentalVehicleEntity> findById(Long id) {
        return repository.findById(id);
    }

    public RentalVehicleEntity save(RentalVehicleEntity vehicle) {
        return repository.save(vehicle);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
