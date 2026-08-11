package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.ResourceEntity;
import mg.taxibrousse.models.Resource;
import mg.taxibrousse.repositories.IResourceRepository;
import mg.taxibrousse.services.IResourceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService implements IResourceService {

    private final IResourceRepository resourceRepository;

    @Override
    public List<Resource> saveAll(List<Resource> resources) {
        List<ResourceEntity> entities = resources.stream().map(Resource::toEntity).toList();
        List<ResourceEntity> saved = resourceRepository.saveAll(entities);
        return saved.stream().map(Resource::fromEntity).toList();
    }

    @Override
    public List<Resource> findAll() {
        return resourceRepository.findAll().stream().map(Resource::fromEntity).toList();
    }

    @Override
    public Resource findById(Long id) {
        return resourceRepository.findById(id).map(Resource::fromEntity).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        resourceRepository.deleteById(id);
    }

    @Override
    public void deleteAll() {
        resourceRepository.deleteAllResources();
    }

    @Override
    public Resource save(Resource resource) {
        ResourceEntity entity = resource.toEntity();
        ResourceEntity saved = resourceRepository.save(entity);
        return Resource.fromEntity(saved);
    }
}
