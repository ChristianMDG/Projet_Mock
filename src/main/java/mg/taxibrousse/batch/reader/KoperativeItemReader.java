package mg.taxibrousse.batch.reader;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.enums.KoperativeStatusEnum;
import mg.taxibrousse.repositories.IKoperativeRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Iterator;
import java.util.List;

/**
 * ItemReader qui lit toutes les coopératives actives
 */
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KoperativeItemReader implements ItemReader<KoperativeEntity> {

    private final IKoperativeRepository koperativeRepository;
    private Iterator<KoperativeEntity> koperativeIterator;
    private boolean initialized = false;

    @Override
    public KoperativeEntity read() {
        if (!initialized) {
            List<KoperativeEntity> koperatives = koperativeRepository.findAll().stream()
                    .filter(k -> k.getStatus() == KoperativeStatusEnum.ACTIVE || k.getStatus() == KoperativeStatusEnum.CONFIRMED)
                    .toList();
            koperativeIterator = koperatives.iterator();
            initialized = true;
        }

        if (koperativeIterator != null && koperativeIterator.hasNext()) {
            return koperativeIterator.next();
        }

        // Reset pour la prochaine exécution
        initialized = false;
        return null; // Fin de la lecture
    }
}
