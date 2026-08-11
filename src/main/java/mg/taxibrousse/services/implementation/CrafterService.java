package mg.taxibrousse.services.implementation;

import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.models.Crafter;
import mg.taxibrousse.repositories.ICloudinaryRepository;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.services.ICrafterService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CrafterService implements ICrafterService {

    private final ICrafterRepository crafterRepository;
    private final ICloudinaryRepository cloudinaryRepository;

    @Override
    @Transactional
    @CacheEvict(value = "crafters", allEntries = true)
    public Crafter save(Crafter crafter) {
        var entity = crafterRepository.save(crafter.toEntity());
        if (
            crafter.getPhoto() != null &&
            crafter.getPhoto().getUrl() != null &&
            !crafter.getPhoto().getUrl().trim().isEmpty()
        ) {
            var photo = cloudinaryRepository.save(crafter.getPhoto().toEntity());
            entity.setPhoto(photo);
        }
        return Crafter.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "#id", unless = "#result == null")
    public Crafter findById(Long id) {
        return Crafter.fromEntity(crafterRepository.findById(id).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'all'")
    public List<Crafter> findAll() {
        return crafterRepository.findAll().stream().map(Crafter::fromEntity).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "crafters", allEntries = true)
    public void deleteById(Long id) {
        crafterRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'koperative-' + #koperativeId")
    public List<Crafter> findByKoperativeId(Long koperativeId) {
        return crafterRepository.findByKoperativeId(koperativeId).stream().map(Crafter::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'active-' + #isActive")
    public List<Crafter> findByIsActive(Boolean isActive) {
        return crafterRepository.findByIsActive(isActive).stream().map(Crafter::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'seatConfig-' + #id", unless = "#result == null")
    public Object getSeatConfigById(Long id) {
        return crafterRepository.findById(id).map(CrafterEntity::getSeatConfig).orElse(null);
    }
}
