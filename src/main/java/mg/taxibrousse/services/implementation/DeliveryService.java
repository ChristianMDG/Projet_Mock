package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.shop.DeliveryCalculationRequest;
import mg.taxibrousse.dto.shop.DeliveryCalculationResponse;
import mg.taxibrousse.entities.DeliveryRateEntity;
import mg.taxibrousse.entities.DeliveryZoneEntity;
import mg.taxibrousse.entities.FokotanyEntity;
import mg.taxibrousse.entities.OrderEntity;
import mg.taxibrousse.entities.VilleEntity;
import mg.taxibrousse.entities.enums.DeliveryMethodEnum;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.DeliveryRate;
import mg.taxibrousse.models.DeliveryZone;
import mg.taxibrousse.repositories.IDeliveryRateRepository;
import mg.taxibrousse.repositories.IDeliveryZoneRepository;
import mg.taxibrousse.services.IDeliveryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryService implements IDeliveryService {

    private final IDeliveryZoneRepository zoneRepository;
    private final IDeliveryRateRepository rateRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryZone> listActiveZones() {
        return zoneRepository.findByIsActiveTrue().stream().map(z -> DeliveryZone.fromEntity(z, ratesAsModel(z.getId()))).toList();
    }

    @Override
    @Transactional
    public DeliveryZone createZone(DeliveryZone request) {
        if (zoneRepository.existsByName(request.getName())) {
            throw new ShopException("error_delivery_zone_name_taken", "exception_delivery_zone_name_taken");
        }
        DeliveryZoneEntity zone = new DeliveryZoneEntity();
        zone.setName(request.getName());
        zone.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);
        zone.setVilles(resolveVilles(request.getVilleIds()));
        zone.setFokotanys(resolveFokotanys(request.getFokotanyIds()));
        DeliveryZoneEntity saved = zoneRepository.save(zone);
        replaceRates(saved, request.getRates());
        return DeliveryZone.fromEntity(saved, ratesAsModel(saved.getId()));
    }

    @Override
    @Transactional
    public DeliveryZone updateZone(Long id, DeliveryZone request) {
        DeliveryZoneEntity zone = loadZone(id);
        applyName(zone, request);
        applyIsActive(zone, request);
        applyVilles(zone, request);
        applyFokotanys(zone, request);
        DeliveryZoneEntity saved = zoneRepository.save(zone);
        applyRates(saved, request);
        return DeliveryZone.fromEntity(saved, ratesAsModel(saved.getId()));
    }

    private void applyName(DeliveryZoneEntity zone, DeliveryZone request) {
        if (request.getName() == null) {
            return;
        }
        if (request.getName().equals(zone.getName())) {
            return;
        }
        if (zoneRepository.existsByName(request.getName())) {
            throw new ShopException("error_delivery_zone_name_taken", "exception_delivery_zone_name_taken");
        }
        zone.setName(request.getName());
    }

    private void applyIsActive(DeliveryZoneEntity zone, DeliveryZone request) {
        if (request.getIsActive() == null) {
            return;
        }
        zone.setIsActive(request.getIsActive());
    }

    private void applyVilles(DeliveryZoneEntity zone, DeliveryZone request) {
        if (request.getVilleIds() == null) {
            return;
        }
        zone.setVilles(resolveVilles(request.getVilleIds()));
    }

    private void applyFokotanys(DeliveryZoneEntity zone, DeliveryZone request) {
        if (request.getFokotanyIds() == null) {
            return;
        }
        zone.setFokotanys(resolveFokotanys(request.getFokotanyIds()));
    }

    private void applyRates(DeliveryZoneEntity zone, DeliveryZone request) {
        if (request.getRates() == null) {
            return;
        }
        replaceRates(zone, request.getRates());
    }

    @Override
    @Transactional
    public void deleteZone(Long id) {
        DeliveryZoneEntity zone = loadZone(id);
        rateRepository.deleteAll(rateRepository.findByZoneId(zone.getId()));
        zoneRepository.delete(zone);
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryCalculationResponse calculate(DeliveryCalculationRequest request) {
        DeliveryZoneEntity zone = resolveZone(request.getVilleId(), request.getFokotanyId());
        if (zone == null) {
            throw new ShopException("error_delivery_zone_not_found", "exception_delivery_zone_not_found");
        }
        DeliveryRateEntity rate = rateRepository.findByZoneIdAndMethod(zone.getId(), request.getMethod())
                .orElseThrow(() -> new ShopException("error_delivery_rate_not_found", "exception_delivery_rate_not_found"));
        BigDecimal weight = request.getWeight() != null ? request.getWeight() : BigDecimal.ZERO;
        BigDecimal total = rate.getBaseFee().add(rate.getPerKgFee().multiply(weight));
        return DeliveryCalculationResponse.builder()
                .zoneId(zone.getId())
                .zoneName(zone.getName())
                .method(rate.getMethod())
                .baseFee(rate.getBaseFee())
                .perKgFee(rate.getPerKgFee())
                .totalFee(total)
                .estimatedDaysMin(rate.getEstimatedDaysMin())
                .estimatedDaysMax(rate.getEstimatedDaysMax())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateForOrder(OrderEntity order) {
        if (order == null) {
            return BigDecimal.ZERO;
        }
        DeliveryMethodEnum method = order.getDeliveryMethod();
        Long villeId = order.getVille() != null ? order.getVille().getId() : null;
        Long fokotanyId = order.getFokotany() != null ? order.getFokotany().getId() : null;
        boolean hasAddressInfo = villeId != null || fokotanyId != null;
        if (hasAddressInfo && method != null) {
            return computeOrderDeliveryFee(order, villeId, fokotanyId, method);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal computeOrderDeliveryFee(OrderEntity order, Long villeId, Long fokotanyId, DeliveryMethodEnum method) {
        DeliveryZoneEntity zone = resolveZone(villeId, fokotanyId);
        if (zone == null) {
            return BigDecimal.ZERO;
        }
        Optional<DeliveryRateEntity> rateOpt = rateRepository.findByZoneIdAndMethod(zone.getId(), method);
        if (rateOpt.isEmpty()) {
            return BigDecimal.ZERO;
        }
        DeliveryRateEntity rate = rateOpt.get();
        BigDecimal weight = order.getShippingWeight() != null ? order.getShippingWeight() : BigDecimal.ZERO;
        return rate.getBaseFee().add(rate.getPerKgFee().multiply(weight));
    }

    private DeliveryZoneEntity resolveZone(Long villeId, Long fokotanyId) {
        if (fokotanyId != null) {
            Optional<DeliveryZoneEntity> byFokotany = zoneRepository.findFirstActiveByFokotanyId(fokotanyId);
            if (byFokotany.isPresent()) {
                return byFokotany.get();
            }
        }
        if (villeId != null) {
            return zoneRepository.findFirstActiveByVilleId(villeId).orElse(null);
        }
        return null;
    }

    private void replaceRates(DeliveryZoneEntity zone, List<DeliveryRate> rateRequests) {
        List<DeliveryRateEntity> existing = rateRepository.findByZoneId(zone.getId());
        rateRepository.deleteAll(existing);
        if (rateRequests == null) {
            return;
        }
        for (DeliveryRate req : rateRequests) {
            DeliveryRateEntity rate = new DeliveryRateEntity();
            rate.setZone(zone);
            rate.setMethod(req.getMethod());
            rate.setBaseFee(req.getBaseFee() != null ? req.getBaseFee() : BigDecimal.ZERO);
            rate.setPerKgFee(req.getPerKgFee() != null ? req.getPerKgFee() : BigDecimal.ZERO);
            rate.setEstimatedDaysMin(req.getEstimatedDaysMin());
            rate.setEstimatedDaysMax(req.getEstimatedDaysMax());
            rateRepository.save(rate);
        }
    }

    private List<DeliveryRate> ratesAsModel(Long zoneId) {
        List<DeliveryRate> out = new ArrayList<>();
        for (DeliveryRateEntity r : rateRepository.findByZoneId(zoneId)) {
            out.add(DeliveryRate.fromEntity(r));
        }
        return out;
    }

    private DeliveryZoneEntity loadZone(Long id) {
        return zoneRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Delivery zone not found: " + id));
    }

    private Set<VilleEntity> resolveVilles(Set<Long> ids) {
        Set<VilleEntity> out = new HashSet<>();
        if (ids == null) {
            return out;
        }
        for (Long id : ids) {
            out.add(entityManager.getReference(VilleEntity.class, id));
        }
        return out;
    }

    private Set<FokotanyEntity> resolveFokotanys(Set<Long> ids) {
        Set<FokotanyEntity> out = new HashSet<>();
        if (ids == null) {
            return out;
        }
        for (Long id : ids) {
            out.add(entityManager.getReference(FokotanyEntity.class, id));
        }
        return out;
    }
}
