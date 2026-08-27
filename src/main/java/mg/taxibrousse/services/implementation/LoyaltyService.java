package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.LoyaltyAccountEntity;
import mg.taxibrousse.entities.LoyaltyConfigEntity;
import mg.taxibrousse.exceptions.LoyaltyException;
import mg.taxibrousse.models.LoyaltyAccount;
import mg.taxibrousse.models.LoyaltyConfig;
import mg.taxibrousse.models.LoyaltyView;
import mg.taxibrousse.repositories.ILoyaltyAccountRepository;
import mg.taxibrousse.repositories.ILoyaltyConfigRepository;
import mg.taxibrousse.services.ILoyaltyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyService implements ILoyaltyService {

    private static final int MONEY_SCALE = 2;
    private static final int RATIO_SCALE = 4;

    private final ILoyaltyAccountRepository loyaltyAccountRepository;
    private final ILoyaltyConfigRepository loyaltyConfigRepository;

    @Override
    @Transactional
    public LoyaltyConfig getConfig() {
        return LoyaltyConfig.fromEntity(loadOrCreateConfig());
    }

    @Override
    @Transactional
    public LoyaltyConfig updateConfig(LoyaltyConfig config) {
        LoyaltyConfigEntity entity = config.toEntity(loadOrCreateConfig());
        return LoyaltyConfig.fromEntity(loyaltyConfigRepository.save(entity));
    }

    @Override
    @Transactional
    public LoyaltyAccount getOrCreateAccount(Long voyageurId) {
        return LoyaltyAccount.fromEntity(loadOrCreateAccount(voyageurId));
    }

    @Override
    @Transactional
    public LoyaltyView getView(Long voyageurId) {
        LoyaltyConfigEntity config = loadOrCreateConfig();
        LoyaltyAccountEntity account = loadOrCreateAccount(voyageurId);

        BigDecimal earned = nz(account.getKmEarned());
        BigDecimal redeemed = nz(account.getKmRedeemed());
        BigDecimal available = earned.subtract(redeemed).max(BigDecimal.ZERO);

        BigDecimal threshold = nz(config.getKmPerFreeVoyage());
        boolean hasThreshold = threshold.compareTo(BigDecimal.ZERO) > 0;

        int freeVoyages = hasThreshold ? available.divide(threshold, 0, RoundingMode.FLOOR).intValue() : 0;
        BigDecimal remainder = hasThreshold ? available.remainder(threshold) : BigDecimal.ZERO;
        BigDecimal kmToNext = hasThreshold ? threshold.subtract(remainder) : BigDecimal.ZERO;
        BigDecimal progress = hasThreshold ? remainder.divide(threshold, RATIO_SCALE, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        return LoyaltyView.builder()
                .voyageurId(voyageurId)
                .kmEarned(earned)
                .kmRedeemed(redeemed)
                .kmAvailable(available)
                .kmPerFreeVoyage(threshold)
                .earnMultiplier(nz(config.getEarnMultiplier()))
                .programActive(Boolean.TRUE.equals(config.getIsActive()))
                .freeVoyagesAvailable(freeVoyages)
                .kmToNextFreeVoyage(kmToNext)
                .progressToNextFreeVoyage(progress)
                .build();
    }

    @Override
    @Transactional
    public LoyaltyAccount creditKm(Long voyageurId, BigDecimal km) {
        if (km == null || km.compareTo(BigDecimal.ZERO) <= 0) {
            return getOrCreateAccount(voyageurId);
        }
        LoyaltyConfigEntity config = loadOrCreateConfig();
        if (Boolean.FALSE.equals(config.getIsActive())) {
            log.debug("Loyalty program inactive; skipping credit for voyageur {}", voyageurId);
            return getOrCreateAccount(voyageurId);
        }
        BigDecimal credited = km.multiply(nz(config.getEarnMultiplier())).setScale(MONEY_SCALE, RoundingMode.HALF_UP);

        LoyaltyAccountEntity entity = loadOrCreateAccount(voyageurId);
        entity.setKmEarned(nz(entity.getKmEarned()).add(credited));
        return LoyaltyAccount.fromEntity(loyaltyAccountRepository.save(entity));
    }

    @Override
    @Transactional
    public LoyaltyAccount redeemKm(Long voyageurId, BigDecimal km) {
        if (km == null || km.compareTo(BigDecimal.ZERO) <= 0) {
            throw new LoyaltyException("error_loyalty_invalid_amount");
        }
        LoyaltyAccountEntity entity = loyaltyAccountRepository.findByVoyageurId(voyageurId).orElseThrow(() -> new LoyaltyException("error_loyalty_account_not_found"));
        if (available(entity).compareTo(km) < 0) {
            throw new LoyaltyException("error_loyalty_insufficient_km");
        }
        entity.setKmRedeemed(nz(entity.getKmRedeemed()).add(km));
        return LoyaltyAccount.fromEntity(loyaltyAccountRepository.save(entity));
    }

    private LoyaltyConfigEntity loadOrCreateConfig() {
        return loyaltyConfigRepository.findAll().stream().findFirst().orElseGet(() -> loyaltyConfigRepository.save(new LoyaltyConfigEntity()));
    }

    private LoyaltyAccountEntity loadOrCreateAccount(Long voyageurId) {
        return loyaltyAccountRepository.findByVoyageurId(voyageurId).orElseGet(() -> {
            LoyaltyAccountEntity created = new LoyaltyAccountEntity();
            created.setVoyageurId(voyageurId);
            return loyaltyAccountRepository.save(created);
        });
    }

    private static BigDecimal available(LoyaltyAccountEntity entity) {
        return nz(entity.getKmEarned()).subtract(nz(entity.getKmRedeemed()));
    }

    private static BigDecimal nz(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
