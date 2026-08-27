package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.models.Crafter;
import mg.taxibrousse.repositories.ICloudinaryRepository;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.ICrafterService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@AllArgsConstructor
public class CrafterService implements ICrafterService {

    private static final ObjectMapper SEAT_CONFIG_MAPPER = new ObjectMapper();

    private final ICrafterRepository crafterRepository;
    private final ICloudinaryRepository cloudinaryRepository;
    private final IVoyageRepository voyageRepository;

    @Override
    @Transactional
    @CacheEvict(value = "crafters", allEntries = true)
    public Crafter save(Crafter crafter) {
        var entity = crafterRepository.save(crafter.toEntity());
        if (crafter.getPhoto() != null && StringUtils.hasText(crafter.getPhoto().getUrl())) {
            var photo = cloudinaryRepository.save(crafter.getPhoto().toEntity());
            entity.setPhoto(photo);
        }
        return Crafter.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'id:' + #id", unless = "#result == null")
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
    @Cacheable(value = "crafters", key = "'koperative:' + #koperativeId")
    public List<Crafter> findByKoperativeId(Long koperativeId) {
        return crafterRepository.findByKoperativeId(koperativeId).stream().map(Crafter::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "crafters", key = "'active:' + #isActive")
    public List<Crafter> findByIsActive(Boolean isActive) {
        return crafterRepository.findByIsActive(isActive).stream().map(Crafter::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getSeatConfigById(Long id) {
        var raw = crafterRepository.findById(id).map(CrafterEntity::getSeatConfig).orElse(null);
        if (StringUtils.hasText(raw)) {
            try {
                return SEAT_CONFIG_MAPPER.readValue(raw, Object.class);
            } catch (Exception e) {
                return raw;
            }
        }
        return null;
    }
}
