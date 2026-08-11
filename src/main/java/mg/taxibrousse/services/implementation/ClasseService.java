package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.ClasseEntity;
import mg.taxibrousse.models.Classe;
import mg.taxibrousse.repositories.IClasseRepository;
import mg.taxibrousse.repositories.IKoperativeRepository;
import mg.taxibrousse.services.IClasseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClasseService implements IClasseService {

    private final IClasseRepository classeRepository;
    private final IKoperativeRepository koperativeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Classe> findAll() {
        return classeRepository.findAll().stream()
                .map(Classe::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Classe> findByKoperativeId(Long koperativeId) {
        return classeRepository.findByKoperativeId(koperativeId).stream()
                .map(Classe::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public Classe create(Classe classe) {
        var koperative = koperativeRepository.findById(classe.getKoperativeId())
                .orElseThrow(() -> new EntityNotFoundException("Koperative not found: " + classe.getKoperativeId()));
        var entity = new ClasseEntity();
        entity.setName(classe.getName());
        entity.setDescription(classe.getDescription());
        entity.setKoperative(koperative);
        return Classe.fromEntity(classeRepository.save(entity));
    }

    @Override
    @Transactional
    public Classe update(Long id, Classe classe) {
        var entity = classeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Classe not found: " + id));
        entity.setName(classe.getName());
        entity.setDescription(classe.getDescription());
        if (classe.getKoperativeId() != null) {
            var koperative = koperativeRepository.findById(classe.getKoperativeId())
                    .orElseThrow(() -> new EntityNotFoundException("Koperative not found: " + classe.getKoperativeId()));
            entity.setKoperative(koperative);
        }
        return Classe.fromEntity(classeRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        classeRepository.deleteById(id);
    }
}
