package mg.taxibrousse.services.implementation;

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

import java.util.List;

@Service
@AllArgsConstructor
public class KoperativeService implements IKoperativeService {

    private final IKoperativeRepository koperativeRepository;

    @Override
    public void saveAll(List<Koperative> koperatives) {
        koperativeRepository.saveAll(koperatives.stream().map(BaseDto::toEntity).toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "koperatives", allEntries = true)
    public Koperative save(Koperative koperative) {
        var entity = koperativeRepository.save(koperative.toEntity());
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
    public List<Koperative> findKoperatives(KoperativeFilter filter) {
        List<Long> villeIds = filter.getVilleIds();
        String name = filter.getName();
        Integer top = filter.getTop();

        Pageable pageable = top != null ? PageRequest.of(0, top) : Pageable.unpaged();
        List<KoperativeEntity> entities = koperativeRepository.findKoperatives(villeIds, name, pageable);

        return entities.stream()
            .map(entity -> {
                var k = Koperative.fromEntity(entity, false);
                k.setVilles(BaseDto.mapEntities(entity.getVilles(), Ville::fromEntity));
                return k;
            })
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional
    @Cacheable(value = "koperatives", key = "#id", unless = "#result == null")
    public Koperative findById(Long id) {
        KoperativeEntity entity = koperativeRepository.findBasicById(id).orElse(null);
        return Koperative.fromEntity(entity, false);
    }

    @Override
    @Transactional
    public Koperative setVilles(Long koperativeId, List<Ville> villes) {
        KoperativeEntity k = koperativeRepository.findById(koperativeId).orElse(null);
        if (k == null) return null;

        k.setVilles(new java.util.HashSet<>(villes.stream().map(BaseDto::toEntity).toList()));
        return Koperative.fromEntity(koperativeRepository.save(k));
    }

    @Override
    @CacheEvict(value = "koperatives", allEntries = true)
    public void deleteById(Long id) {
        koperativeRepository.deleteById(id);
    }

    @Override
    public List<Koperative> findFavoriteKoperatives(Long voyageurId) {
        List<KoperativeEntity> entities = koperativeRepository.findFavoriteKoperatives(
                voyageurId
        );

        return entities.stream().map(Koperative::fromEntity).toList();
    }
}
