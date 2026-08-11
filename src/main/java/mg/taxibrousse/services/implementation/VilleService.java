package mg.taxibrousse.services.implementation;

import mg.taxibrousse.entities.VilleEntity;
import mg.taxibrousse.models.BaseDto;
import mg.taxibrousse.models.Ville;
import mg.taxibrousse.repositories.IVilleRepository;
import mg.taxibrousse.services.IVilleService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VilleService implements IVilleService {

    private final IVilleRepository villeRepository;

    public VilleService(IVilleRepository villeRepository) {
        this.villeRepository = villeRepository;
    }

    @Override
    @CacheEvict(value = "villes", allEntries = true)
    public void saveAll(List<Ville> villes) {
        villeRepository.saveAll(villes.stream().map(BaseDto::toEntity).toList());
    }

    @Transactional
    @CacheEvict(value = "villes", allEntries = true)
    public Ville save(Ville ville) {
        VilleEntity entity = ville.toEntity();
        VilleEntity saved = villeRepository.save(entity);
        return Ville.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "villes", key = "'all'")
    public List<Ville> findAll() {
        return villeRepository.findAllByOrderByFrequenceDesc().stream().map(Ville::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "villes", key = "#id", unless = "#result == null")
    public Ville findById(Long id) {
        return Ville.fromEntity(villeRepository.findById(id).orElse(null));
    }

    @CacheEvict(value = "villes", allEntries = true)
    public void deleteById(Long id) {
        villeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "villes", key = "'top20'")
    public List<Ville> getTop20Villes() {
        return villeRepository.findTop20ByIsActiveTrueOrderByFrequenceDesc()
                .stream()
                .map(Ville::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ville> findByKeyword(String keyword) {
        return villeRepository.findByKeyword(keyword, PageRequest.of(0, 5))
                .stream()
                .map(Ville::fromEntity)
                .toList();
    }
}
