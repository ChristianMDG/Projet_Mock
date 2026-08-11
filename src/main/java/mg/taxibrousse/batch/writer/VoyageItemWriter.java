package mg.taxibrousse.batch.writer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.repositories.IVoyageRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * ItemWriter qui sauvegarde les voyages en base
 * Évite les doublons en vérifiant si un voyage existe déjà pour la même route et date
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class VoyageItemWriter implements ItemWriter<List<VoyageEntity>> {

    private final IVoyageRepository voyageRepository;

    @Override
    public void write(Chunk<? extends List<VoyageEntity>> chunk) {
        List<VoyageEntity> allVoyages = new ArrayList<>();
        // Aplatir la liste de listes
        for (List<VoyageEntity> voyageList : chunk) {
            if (voyageList != null && !voyageList.isEmpty()) {
                allVoyages.addAll(voyageList);
            }
        }

        if (allVoyages.isEmpty()) {
            log.debug("Aucun voyage à sauvegarder");
            return;
        }

        List<VoyageEntity> voyagesToSave = filterDuplicates(allVoyages);
        List<VoyageEntity> savedVoyages = voyageRepository.saveAll(voyagesToSave);
        log.info("Sauvegardé {} voyages sur {} générés", savedVoyages.size(), allVoyages.size());
    }

    /**
     * Filtrer les voyages qui existent déjà dans la base
     * Vérifie si un voyage existe pour la même coopérative, route et date
     */
    private List<VoyageEntity> filterDuplicates(List<VoyageEntity> voyages) {
        List<VoyageEntity> filtered = new ArrayList<>();
        
        for (VoyageEntity voyage : voyages) {
            if (voyageExists(voyage)) {
                log.debug("Voyage déjà existant ignoré: {} -> {} le {}",
                    voyage.getDepartureGare().getName(),
                    voyage.getArrivalGare().getName(),
                    voyage.getDepartureTime().toLocalDate()
                );
            } else {
                filtered.add(voyage);
            }
        }
        
        return filtered;
    }

    /**
     * Vérifier si un voyage similaire existe déjà
     */
    private boolean voyageExists(VoyageEntity voyage) {
        LocalDate departureDate = voyage.getDepartureTime().toLocalDate();
        LocalDate nextDay = departureDate.plusDays(1);
        
        List<VoyageEntity> existingVoyages = voyageRepository.findByDepartureTimeBetween(
            departureDate.atStartOfDay(),
            nextDay.atStartOfDay()
        );
        
        return existingVoyages.stream().anyMatch(existing ->
            existing.getKoperative().getId().equals(voyage.getKoperative().getId()) &&
            existing.getDepartureGare().getId().equals(voyage.getDepartureGare().getId()) &&
            existing.getArrivalGare().getId().equals(voyage.getArrivalGare().getId()) &&
            existing.getDepartureTime().toLocalDate().equals(departureDate)
        );
    }
}
