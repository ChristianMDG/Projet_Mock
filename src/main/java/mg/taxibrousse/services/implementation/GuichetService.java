package mg.taxibrousse.services.implementation;

import mg.taxibrousse.entities.GareEntity;
import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.models.Gare;
import mg.taxibrousse.models.Guichet;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.repositories.IGareRepository;
import mg.taxibrousse.repositories.IGuichetRepository;
import mg.taxibrousse.services.IGuichetService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class GuichetService implements IGuichetService {

    private final IGuichetRepository guichetRepository;
    private final IGareRepository gareRepository;

    public GuichetService(IGuichetRepository guichetRepository, IGareRepository gareRepository) {
        this.guichetRepository = guichetRepository;
        this.gareRepository = gareRepository;
    }

    @Override
    @Transactional
    @CacheEvict(value = "guichets", allEntries = true)
    public Guichet save(Guichet guichet) {
        GuichetEntity entity = guichet.toEntity();
        GuichetEntity saved = guichetRepository.save(entity);
        return Guichet.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "guichets", key = "#id", unless = "#result == null")
    public Guichet findById(Long id) {
        return Guichet.fromEntity(guichetRepository.findById(id).orElse(null));
    }

    @Override
    @CacheEvict(value = "guichets", allEntries = true)
    public void deleteById(Long id) {
        guichetRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "guichets", key = "'koperative-' + #koperativeId")
    public List<Guichet> findByKoperativeId(Long koperativeId) {
        return guichetRepository.findByKoperativeId(koperativeId).stream().map(Guichet::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Guichet> findByGareId(Long gareId) {
        return guichetRepository.findByGareId(gareId).stream().map(Guichet::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Gare> getGuichetDestinations(Long guichetId) {
        GuichetEntity entity = guichetRepository.findById(guichetId).orElse(null);
        if (entity == null || entity.getDestinations() == null) {
            return Collections.emptyList();
        }
        return entity.getDestinations().stream().map(Gare::fromEntity).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "guichets", allEntries = true)
    public Guichet updateGuichetDestinations(Long guichetId, List<Gare> destinations) {
        GuichetEntity entity = guichetRepository.findById(guichetId).orElseThrow(() -> new RuntimeException("Guichet not found with id: " + guichetId));

        // Load GareEntity objects from database by IDs
        if (destinations != null && !destinations.isEmpty()) {
            List<Long> gareIds = destinations.stream().map(Gare::getId).filter(Objects::nonNull).toList();

            List<GareEntity> gareEntities = gareRepository.findAllById(gareIds);
            entity.setDestinations(gareEntities);
        } else {
            entity.setDestinations(Collections.emptyList());
        }

        GuichetEntity saved = guichetRepository.save(entity);
        return Guichet.fromEntity(saved, true, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Guichet findByGareAndKoperativeWithOperateurs(Long gareId, Long koperativeId) {
        var entity = guichetRepository.findByGareIdAndKoperativeIdWithOperateurs(gareId, koperativeId).orElse(null);
        if (entity == null) {
            return new Guichet();
        }

        var operateurs = entity.getOperateurs().stream().map(UserOperator::fromEntityLight).toList();
        return Guichet.toBuilder(entity).operateurs(operateurs).build();
    }
}
