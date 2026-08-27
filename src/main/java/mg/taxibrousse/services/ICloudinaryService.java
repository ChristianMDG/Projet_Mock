package mg.taxibrousse.services;

import mg.taxibrousse.entities.CloudinaryEntity;

import java.util.List;

public interface ICloudinaryService {

    CloudinaryEntity save(CloudinaryEntity entity);

    CloudinaryEntity findById(Long id);

    void deleteById(Long id);

    List<CloudinaryEntity> findByIds(List<Long> ids);

    void deleteByIds(List<Long> ids);
}
