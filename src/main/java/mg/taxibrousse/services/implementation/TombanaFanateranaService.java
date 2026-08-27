package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.TombanaFanateranaEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.models.TombanaFanaterana;
import mg.taxibrousse.repositories.IRouteRepository;
import mg.taxibrousse.repositories.ITombanaFanateranaRepository;
import mg.taxibrousse.services.ITombanaFanateranaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TombanaFanateranaService implements ITombanaFanateranaService {

    private final ITombanaFanateranaRepository repository;
    private final IRouteRepository routeRepository;

    @Value("${app.delivery.price-per-km:20}")
    private BigDecimal pricePerKm;

    @Value("${app.delivery.default-fee:5000}")
    private BigDecimal defaultFee;

    @Override
    @Transactional(readOnly = true)
    public Optional<TombanaFanaterana> findById(Long id) {
        return repository.findById(id).map(TombanaFanaterana::fromEntity);
    }

    @Override
    @Transactional
    public TombanaFanaterana save(TombanaFanaterana model) {
        if (model == null) {
            throw new IllegalArgumentException("TombanaFanaterana cannot be null");
        }
        TombanaFanateranaEntity entity;
        if (model.getId() == null || model.getId() <= 0L) {
            entity = new TombanaFanateranaEntity();
        } else {
            entity = repository.findById(model.getId()).orElseGet(TombanaFanateranaEntity::new);
        }
        entity = model.toEntity(entity);
        TombanaFanateranaEntity saved = repository.save(entity);
        log.info("Saved TombanaFanaterana with id: {}", saved.getId());
        return TombanaFanaterana.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
        log.info("Deleted TombanaFanaterana with id: {}", id);
    }

    /**
     * Calculates the delivery fee for a given destination ville.
     * <p>
     * Strategy:
     * <ol>
     *   <li>Look up the average distanceKm of active routes arriving at {@code villeId}.</li>
     *   <li>If found, compute {@code frais = distanceKm * pricePerKm} (rounded to 0 decimal places).</li>
     *   <li>If no route distance exists, fall back to the configurable default fee (5 000 Ar).</li>
     *   <li>When a legacy weight-based seed row exists it is returned but its frais is overridden
     *       with the distance-computed value.</li>
     * </ol>
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TombanaFanaterana> findTombana(Long villeId, String method, BigDecimal weight) {
        try {
            DeliveryMethodEnum deliveryMethod = DeliveryMethodEnum.valueOf(method.toUpperCase());
            BigDecimal distanceFee = computeDistanceFee(villeId);

            // 1. Try the existing weight-based table for an exact match (backward compat)
            Optional<TombanaFanateranaEntity> existing = repository.findTombana(villeId, deliveryMethod, weight);
            if (existing.isPresent()) {
                TombanaFanaterana fromDb = TombanaFanaterana.fromEntity(existing.get());
                fromDb.setFrais(distanceFee);
                log.debug("Delivery fee for villeId={} overridden by distance: {} Ar", villeId, distanceFee);
                return Optional.of(fromDb);
            }

            // 2. No seeded row — build a synthetic response from the distance-based fee
            log.debug("No seeded tombana row for villeId={}, using distance-based fee: {} Ar", villeId, distanceFee);
            TombanaFanaterana synthetic = TombanaFanaterana.builder()
                    .villeId(villeId)
                    .deliveryMethod(deliveryMethod)
                    .minWeight(BigDecimal.ZERO)
                    .maxWeight(BigDecimal.valueOf(999))
                    .frais(distanceFee)
                    .build();
            return Optional.of(synthetic);

        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /**
     * Computes the delivery fee based on the average distanceKm of active routes
     * arriving at {@code villeId}. Falls back to {@link #defaultFee} (5 000 Ar) when
     * no route distance is available.
     */
    private BigDecimal computeDistanceFee(Long villeId) {
        return routeRepository.findAverageDistanceKmByArrivalVilleId(villeId)
                .map(distance -> distance.multiply(pricePerKm).setScale(0, RoundingMode.HALF_UP))
                .orElseGet(() -> {
                    log.debug("No route distance for villeId={}, falling back to default {} Ar", villeId, defaultFee);
                    return defaultFee;
                });
    }
}
