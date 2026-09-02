package mg.taxibrousse.entities.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Statuts de commande Taxibrousse / livraison gare.
 *
 * <p>Flux logistique principal (après paiement) :
 * READY_IN_STORE → DELIVERY_TO_STATION → DELIVERY_IN_PROGRESS
 * → AVAILABLE_AT_COUNTER → DELIVERED
 *
 * <p>L'admin / guichet peut basculer librement entre les statuts opérationnels
 * (voir {@link #canTransitionTo(OrderStatusEnum)} et le service qui autorise
 * toujours si un adminUserId est présent).
 */
public enum OrderStatusEnum {

    PENDING,
    CONFIRMED,
    PAYMENT_FAILED,
    PROCESSING,
    /** @deprecated Prefer READY_IN_STORE / DELIVERY_* for the gare flow */
    SHIPPED,
    READY_IN_STORE,
    DELIVERY_TO_STATION,
    DELIVERY_IN_PROGRESS,
    AVAILABLE_AT_COUNTER,
    DELIVERED,
    CANCELLED;

    /** Les 5 statuts métier demandés (parcours colis jusqu'au guichet). */
    public static final Set<OrderStatusEnum> LOGISTICS_FLOW = EnumSet.of(
            READY_IN_STORE,
            DELIVERY_TO_STATION,
            DELIVERY_IN_PROGRESS,
            AVAILABLE_AT_COUNTER,
            DELIVERED
    );

    /** Statuts entre lesquels l'opérateur peut naviguer librement. */
    private static final Set<OrderStatusEnum> FREE_OPERATOR_STATUSES = EnumSet.of(
            PENDING,
            CONFIRMED,
            PROCESSING,
            SHIPPED,
            READY_IN_STORE,
            DELIVERY_TO_STATION,
            DELIVERY_IN_PROGRESS,
            AVAILABLE_AT_COUNTER,
            DELIVERED
    );

    private static final Map<OrderStatusEnum, Set<OrderStatusEnum>> ALLOWED_TRANSITIONS = Map.ofEntries(
            Map.entry(PENDING, EnumSet.of(CONFIRMED, PROCESSING, PAYMENT_FAILED, CANCELLED, READY_IN_STORE)),
            Map.entry(CONFIRMED, EnumSet.of(PROCESSING, CANCELLED, READY_IN_STORE, DELIVERY_TO_STATION)),
            Map.entry(PAYMENT_FAILED, EnumSet.of(PENDING, CANCELLED)),
            Map.entry(PROCESSING, EnumSet.of(
                    SHIPPED, READY_IN_STORE, DELIVERY_TO_STATION, DELIVERY_IN_PROGRESS, CANCELLED)),
            Map.entry(SHIPPED, EnumSet.of(
                    DELIVERED, AVAILABLE_AT_COUNTER, DELIVERY_IN_PROGRESS, CANCELLED)),
            Map.entry(READY_IN_STORE, EnumSet.copyOf(FREE_OPERATOR_STATUSES)),
            Map.entry(DELIVERY_TO_STATION, EnumSet.copyOf(FREE_OPERATOR_STATUSES)),
            Map.entry(DELIVERY_IN_PROGRESS, EnumSet.copyOf(FREE_OPERATOR_STATUSES)),
            Map.entry(AVAILABLE_AT_COUNTER, EnumSet.copyOf(FREE_OPERATOR_STATUSES)),
            // DELIVERED / CANCELLED : transitions strictes côté enum ;
            // le service admin peut encore forcer si besoin métier.
            Map.entry(DELIVERED, EnumSet.of(AVAILABLE_AT_COUNTER, READY_IN_STORE)),
            Map.entry(CANCELLED, EnumSet.of(PENDING, PROCESSING, READY_IN_STORE))
    );

    public boolean canTransitionTo(OrderStatusEnum next) {
        if (next == null || next == this) {
            return false;
        }
        // Navigation libre entre statuts opérationnels (guichet / magasin / livraison)
        if (FREE_OPERATOR_STATUSES.contains(this) && FREE_OPERATOR_STATUSES.contains(next)) {
            return true;
        }
        return ALLOWED_TRANSITIONS.getOrDefault(this, EnumSet.noneOf(OrderStatusEnum.class)).contains(next);
    }

    /** Prochain statut logique dans le parcours gare (null si déjà livré ou hors flux). */
    public OrderStatusEnum suggestedNext() {
        return switch (this) {
            case PENDING, CONFIRMED, PROCESSING, SHIPPED, PAYMENT_FAILED -> READY_IN_STORE;
            case READY_IN_STORE -> DELIVERY_TO_STATION;
            case DELIVERY_TO_STATION -> DELIVERY_IN_PROGRESS;
            case DELIVERY_IN_PROGRESS -> AVAILABLE_AT_COUNTER;
            case AVAILABLE_AT_COUNTER -> DELIVERED;
            default -> null;
        };
    }
}
