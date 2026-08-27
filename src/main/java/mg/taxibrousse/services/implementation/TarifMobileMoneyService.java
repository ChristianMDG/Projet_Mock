package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.TarifMobileMoneyEntity;
import mg.taxibrousse.models.TarifMobileMoney;
import mg.taxibrousse.repositories.ITarifMobileMoneyRepository;
import mg.taxibrousse.services.ITarifMobileMoneyService;
import mg.taxibrousse.entities.enums.MobileMoneyEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TarifMobileMoneyService implements ITarifMobileMoneyService {

    private final ITarifMobileMoneyRepository repository;

    @Override
    @Transactional(readOnly = true)
    public Optional<TarifMobileMoney> findById(Long id) {
        return repository.findById(id).map(TarifMobileMoney::fromEntity);
    }

    @Override
    @Transactional
    public TarifMobileMoney save(TarifMobileMoney tarifMobileMoney) {
        if (tarifMobileMoney == null) {
            throw new IllegalArgumentException("TarifMobileMoney cannot be null");
        }
        TarifMobileMoneyEntity entity;
        if (tarifMobileMoney.getId() == null) {
            entity = new TarifMobileMoneyEntity();
        } else {
            entity = repository.findById(tarifMobileMoney.getId()).orElseGet(TarifMobileMoneyEntity::new);
        }

        entity = tarifMobileMoney.toEntity(entity);
        TarifMobileMoneyEntity saved = repository.save(entity);
        log.info("Saved TarifMobileMoney with id: {}", saved.getId());
        return TarifMobileMoney.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
        log.info("Deleted TarifMobileMoney with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TarifMobileMoney> findTarifMobileMoney(String operatorName, BigDecimal amount) {
        if (StringUtils.hasText(operatorName) && Objects.nonNull(amount) && amount.signum() > 0) {
            try {
                MobileMoneyEnum normalized = MobileMoneyEnum.fromName(operatorName);
                return repository.findTarifMobileMoney(normalized.name(), amount)
                        .stream().findFirst()
                        .map(TarifMobileMoney::fromEntity);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid mobile money operator: {}", operatorName);
                return Optional.empty();
            }
        }
        return Optional.empty();
    }
}
