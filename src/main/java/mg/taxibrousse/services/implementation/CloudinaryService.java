package mg.taxibrousse.services.implementation;

import mg.taxibrousse.entities.CloudinaryEntity;
import mg.taxibrousse.repositories.ICloudinaryRepository;
import mg.taxibrousse.services.ICloudinaryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CloudinaryService implements ICloudinaryService {

    private final ICloudinaryRepository cloudinaryRepository;

    public CloudinaryService(ICloudinaryRepository cloudinaryRepository) {
        this.cloudinaryRepository = cloudinaryRepository;
    }

    @Override
    public CloudinaryEntity save(CloudinaryEntity entity) {
        return cloudinaryRepository.save(entity);
    }

    @Override
    public CloudinaryEntity findById(Long id) {
        return cloudinaryRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        cloudinaryRepository.deleteById(id);
    }

    @Override
    public List<CloudinaryEntity> findByIds(List<Long> ids) {
        return cloudinaryRepository.findAllById(ids);
    }

    @Override
    public void deleteByIds(List<Long> ids) {
        cloudinaryRepository.deleteAllById(ids);
    }
}
