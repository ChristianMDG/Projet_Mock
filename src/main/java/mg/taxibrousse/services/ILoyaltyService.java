package mg.taxibrousse.services;

import mg.taxibrousse.models.LoyaltyAccount;
import mg.taxibrousse.models.LoyaltyConfig;
import mg.taxibrousse.models.LoyaltyView;

import java.math.BigDecimal;

public interface ILoyaltyService {

    /**
     * Returns the singleton loyalty config, creating it with default values
     * on first access.
     */
    LoyaltyConfig getConfig();

    /**
     * Update the singleton loyalty config (admin only).
     */
    LoyaltyConfig updateConfig(LoyaltyConfig config);

    /**
     * Returns the loyalty account for the given voyageur, creating an empty
     * one on first access.
     */
    LoyaltyAccount getOrCreateAccount(Long voyageurId);

    /**
     * Aggregated read-only view combining the account and the current config.
     */
    LoyaltyView getView(Long voyageurId);

    /**
     * Credit the given amount of kilometres to a voyageur's loyalty account.
     * Applies the {@code earnMultiplier} from the config. Used by the
     * reservation completion hook (later).
     */
    LoyaltyAccount creditKm(Long voyageurId, BigDecimal km);

    /**
     * Redeem kilometres from a voyageur's loyalty account (e.g. when claiming
     * a free voyage). Throws if not enough km are available.
     */
    LoyaltyAccount redeemKm(Long voyageurId, BigDecimal km);
}
