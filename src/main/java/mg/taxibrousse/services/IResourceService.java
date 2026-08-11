package mg.taxibrousse.services;

import mg.taxibrousse.models.Resource;

import java.util.List;

public interface IResourceService {
    List<Resource> saveAll(List<Resource> resources);

    List<Resource> findAll();

    Resource findById(Long id);

    void deleteById(Long id);

    void deleteAll();

    Resource save(Resource resource);
}
