package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.models.BaseDto;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Ville;
import mg.taxibrousse.params.KoperativeFilter;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.services.IKoperativeService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class KoperativeService implements IKoperativeService {

    private final IKoperativeRepository koperativeRepository;

    @Override
    @CacheEvict(value = "koperatives", allEntries = true)
    public void saveAll(List<Koperative> koperatives) {
        koperativeRepository.saveAll(koperatives.stream().map(BaseDto::toEntity).toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "koperatives", allEntries = true)
    public Koperative save(Koperative koperative) {
        KoperativeEntity entity;

        if (koperative.getId() == null) {
            // Create new entity
            entity = koperative.toEntity();
        } else {
            // Update existing entity - fetch it first to preserve relationships not in DTO
            entity = koperativeRepository.findById(koperative.getId()).orElseThrow(() -> new EntityNotFoundException(String.format("Koperative not found with id: %d", koperative.getId())));
            entity = koperative.toEntity(entity);
        }

        entity = koperativeRepository.save(entity);
        return Koperative.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "koperatives", key = "'all'")
    public List<Koperative> findAll() {
        return koperativeRepository.findAll().stream().map(Koperative::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "koperatives", key = "'filter:' + (#filter.name ?: '') + ':' + (#filter.villeIds ?: '') + ':' + (#filter.top ?: '')")
    public List<Koperative> findKoperatives(KoperativeFilter filter) {
        List<Long> villeIds = filter.getVilleIds();
        String name = filter.getName();
        Integer top = filter.getTop();

        Pageable pageable = top == null ? Pageable.unpaged() : PageRequest.of(0, top);

        // Two-query approach to avoid in-memory pagination with JOIN FETCH
        List<Long> ids = koperativeRepository.findKoperativeIds(villeIds, name, pageable);
        if (ids.isEmpty()) {
            return List.of();
        }

        List<KoperativeEntity> entities = koperativeRepository.findKoperativesByIds(ids);

        return entities.stream().map(entity -> {
            var k = Koperative.fromEntity(entity, false);
            k.setVilles(BaseDto.mapEntities(entity.getVilles(), Ville::fromEntity));
            return k;
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "koperatives", key = "'count'")
    public Long countKoperatives() {
        return koperativeRepository.countKoperatives();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ville> getVilles(Long koperativeId) {
        KoperativeEntity k = koperativeRepository.findById(koperativeId).orElse(null);
        return k != null ? k.getVilles().stream().map(Ville::fromEntity).toList() : List.of();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "koperatives", key = "'id:' + #id", unless = "#result == null")
    public Koperative findById(Long id) {
        KoperativeEntity entity = koperativeRepository.findBasicById(id).orElse(null);
        return Koperative.fromEntity(entity, false);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "koperatives", key = "'slug:' + #slug", unless = "#result == null")
    public Optional<Koperative> findBySlug(String slug) {
        if (StringUtils.hasText(slug)) {
            String normalizedSlug = slug.trim().toLowerCase();
            return koperativeRepository.findBySlug(normalizedSlug).map(entity -> Koperative.fromEntity(entity, false));
        }
        return Optional.empty();
    }

    @Override
    @Transactional
    @CacheEvict(value = "koperatives", allEntries = true)
    public Koperative setVilles(Long koperativeId, List<Ville> villes) {
        KoperativeEntity k = koperativeRepository.findById(koperativeId).orElse(null);
        if (k == null) {
            return null;
        }

        k.setVilles(new java.util.HashSet<>(villes.stream().map(BaseDto::toEntity).toList()));
        return Koperative.fromEntity(koperativeRepository.save(k));
    }

    @Override
    @Transactional
    @CacheEvict(value = "koperatives", allEntries = true)
    public void deleteById(Long id) {
        koperativeRepository.deleteById(id);
    }

    @Override
    public List<Koperative> findFavoriteKoperatives(Long voyageurId) {
        List<KoperativeEntity> entities = koperativeRepository.findFavoriteKoperatives(voyageurId);

        return entities.stream().map(Koperative::fromEntity).toList();
    }
}
