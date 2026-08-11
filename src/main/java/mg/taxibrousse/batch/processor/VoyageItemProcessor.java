package mg.taxibrousse.batch.processor;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.*;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.repositories.IGuichetRepository;
import mg.taxibrousse.repositories.IRouteRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ItemProcessor qui génère les voyages pour une coopérative
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Transactional
public class VoyageItemProcessor implements ItemProcessor<KoperativeEntity, List<VoyageEntity>> {

    private final IGuichetRepository guichetRepository;
    private final IRouteRepository routeRepository;
    private final ObjectMapper objectMapper;

    // Configuration par défaut
    private static final LocalTime DEFAULT_DEPARTURE_TIME = LocalTime.of(8, 0);
    private static final BigDecimal DEFAULT_PRICE_PER_SEAT = new BigDecimal("0.00");
    private static final Integer DEFAULT_AVAILABLE_SEATS = 20;
    private static final Integer DEFAULT_DURATION_HOURS = 8;
    private static final Integer DAYS_AHEAD = 7; // Générer pour les 7 prochains jours

    @Override
    public List<VoyageEntity> process(KoperativeEntity koperative) {
        log.info("Traitement de la coopérative: {}", koperative.getName());
        
        List<VoyageEntity> voyages = new ArrayList<>();
        // Récupérer les guichets avec leurs destinations
        List<GuichetEntity> guichets = guichetRepository.findByKoperativeIdWithDestinations(koperative.getId());
        
        if (guichets.isEmpty()) {
            log.warn("Aucun guichet actif pour la coopérative: {}", koperative.getName());
            return voyages;
        }

        for (GuichetEntity guichet : guichets) {
            if (guichet.getGare() == null) {
                log.warn("Guichet {} n'a pas de gare associée", guichet.getName());
                continue;
            }

            List<GareEntity> destinations = guichet.getDestinations();
            if (destinations == null || destinations.isEmpty()) {
                log.warn("Guichet {} n'a pas de destinations configurées", guichet.getName());
                continue;
            }

            for (GareEntity destination : destinations) {
                // Créer voyage ALLER uniquement depuis la gare du guichet
                // Les voyages RETOUR seront créés naturellement si la destination
                // a aussi un guichet avec cette ville dans ses destinations
                List<VoyageEntity> allerVoyages = createVoyagesForRoute(
                    koperative, guichet.getGare(), destination
                );
                voyages.addAll(allerVoyages);
            }
        }

        log.info("Généré {} voyages pour la coopérative: {}", voyages.size(), koperative.getName());
        return voyages;
    }

    /**
     * Créer des voyages pour une route spécifique (départ -> arrivée)
     * Génère des instances pour les N prochains jours
     */
    private List<VoyageEntity> createVoyagesForRoute(
            KoperativeEntity koperative,
            GareEntity departureGare,
            GareEntity arrivalGare) {
        
        List<VoyageEntity> voyages = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        RouteEntity route = routeRepository.findByDepartureAndArrivalGareIdWithGares(
            departureGare.getId(),
            arrivalGare.getId()
        ).orElse(null);

        if (route == null) {
            log.warn("Aucune route trouvée entre {} et {}", departureGare.getName(), arrivalGare.getName());
            return voyages;
        }

        for (int i = 0; i < DAYS_AHEAD; i++) {
            LocalDate voyageDate = today.plusDays(i);
            VoyageEntity voyage = createVoyageInstance(
                koperative, departureGare, arrivalGare, voyageDate, route
            );
            if (voyage == null)
                continue;
            voyages.add(voyage);
        }
        
        return voyages;
    }

    /**
     * Créer une instance de voyage pour une date spécifique
     */
    private VoyageEntity createVoyageInstance(
            KoperativeEntity koperative,
            GareEntity departureGare,
            GareEntity arrivalGare,
            LocalDate date,
            RouteEntity route) {

        // Calcul du prix basé sur la route
        BigDecimal fraisKoperative = route.getFraisKoperative() != null ? route.getFraisKoperative() : BigDecimal.ZERO;
        BigDecimal fraisTaxibrousse = route.getFraisTaxibrousse() != null ? route.getFraisTaxibrousse() : BigDecimal.ZERO;

        if (fraisKoperative.compareTo(BigDecimal.ZERO) == 0 && fraisTaxibrousse.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        
        VoyageEntity voyage = new VoyageEntity();
        voyage.setKoperative(koperative);
        voyage.setDepartureGare(departureGare);
        voyage.setArrivalGare(arrivalGare);
        
        LocalDateTime departureTime = LocalDateTime.of(date, DEFAULT_DEPARTURE_TIME);
        voyage.setDepartureTime(departureTime);
        voyage.setEstimatedArrivalTime(departureTime.plusHours(DEFAULT_DURATION_HOURS));
        
        voyage.setAvailableSeats(DEFAULT_AVAILABLE_SEATS);
        voyage.setAvailableSeats(DEFAULT_AVAILABLE_SEATS);

        if (fraisKoperative.compareTo(BigDecimal.ZERO) > 0) {
            voyage.setPricePerSeat(fraisKoperative);
        } else {
            voyage.setPricePerSeat(fraisTaxibrousse);
        }
        
        voyage.setRoute(route);
        voyage.setStatus(VoyageStatusEnum.SCHEDULED);
        voyage.setRecurrenceType(RecurrenceTypeEnum.ONE_OFF);
        voyage.setIsTemplate(false);
        
        return voyage;
    }
}
