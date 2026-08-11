package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.ContratEntity;
import mg.taxibrousse.models.Contrat;
import mg.taxibrousse.repositories.IContratRepository;
import mg.taxibrousse.services.IBaseService;
import mg.taxibrousse.services.IContratService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratService implements IContratService, IBaseService {

    private final IContratRepository contratRepository;

    @Override
    @Cacheable(value = "contrats", key = "'all'")
    public List<Contrat> getAllContrats() {
        return contratRepository.findAll().stream().map(Contrat::fromEntity).toList();
    }

    @Override
    @Cacheable(value = "contrats", key = "#id", unless = "#result == null")
    public Contrat getContratById(Long id) {
        return findById(id, contratRepository, Contrat::fromEntity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "contrats", allEntries = true)
    public Contrat createContrat(Contrat contrat) {
        ContratEntity entity = contrat.toEntity();
        ContratEntity saved = contratRepository.save(entity);
        return Contrat.fromEntity(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "contrats", allEntries = true)
    public Contrat updateContrat(Long id, Contrat contrat) {
        if (contratRepository.existsById(id)) {
            ContratEntity entity = contrat.toEntity();
            entity.setId(id);
            ContratEntity saved = contratRepository.save(entity);
            return Contrat.fromEntity(saved);
        }
        return null;
    }

    @Override
    @Transactional
    @CacheEvict(value = "contrats", allEntries = true)
    public boolean deleteContrat(Long id) {
        if (contratRepository.existsById(id)) {
            contratRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
