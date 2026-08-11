package mg.taxibrousse.services.implementation;

import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.ColisEntity;
import mg.taxibrousse.entities.enums.ColisStatusEnum;
import mg.taxibrousse.models.Colis;
import mg.taxibrousse.repositories.IColisRepository;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.IColisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ColisService implements IColisService {

    private static final Logger logger = LoggerFactory.getLogger(ColisService.class);

    private final IColisRepository colisRepository;
    private final ICrafterRepository crafterRepository;
    private final IVoyageRepository voyageRepository;

    @Override
    @Transactional
    public Colis save(Colis colis) {
        ColisEntity entity = colis.toEntity();

        if (entity.getCrafter() != null && entity.getCrafter().getId() != null) {
            entity.setCrafter(crafterRepository.findById(entity.getCrafter().getId()).orElse(null));
        }

        if (colis.getVoyageId() != null) {
            logger.info("Setting voyage with ID: {}", colis.getVoyageId());
            entity.setVoyage(voyageRepository.findById(colis.getVoyageId()).orElse(null));
            if (entity.getVoyage() != null) {
                logger.info("Voyage set successfully: {}", entity.getVoyage().getId());
            } else {
                logger.warn("Voyage with ID {} not found", colis.getVoyageId());
            }
        } else {
            logger.info("No voyageId provided in Colis");
        }

        // We don't have a ReservationRepository, so we'll just use the reservation as is
        // This might cause issues if the reservation doesn't exist in the database
        // In a real implementation, we would need to validate this

        ColisEntity saved = colisRepository.save(entity);
        return Colis.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Colis findById(Long id) {
        return Colis.fromEntity(colisRepository.findById(id).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findAll() {
        return colisRepository.findAll().stream().map(Colis::fromEntity).toList();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        colisRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findByStatus(ColisStatusEnum status) {
        return colisRepository.findByStatus(status).stream().map(Colis::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findByCrafterId(Long crafterId) {
        return colisRepository.findByCrafterId(crafterId).stream().map(Colis::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findByReservationId(Long reservationId) {
        return colisRepository.findByReservationId(reservationId).stream().map(Colis::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findByKoperativeId(Long koperativeId) {
        return colisRepository.findByKoperativeId(koperativeId).stream().map(Colis::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colis> findByVoyageId(Long voyageId) {
        return colisRepository.findByVoyageId(voyageId).stream().map(Colis::fromEntity).toList();
    }
}
