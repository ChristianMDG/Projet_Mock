-- =============================================================================
-- PATCH: Backfill seat_count, commission_seats, commission_fee, frais columns
-- for existing completed transactions.
-- Columns are created by Hibernate ddl-auto:update (with defaults).
--
-- Operator names: ORANGE, TELMA, AIRTEL
-- =============================================================================

BEGIN;

-- 1. Update commission brackets: set min_amount to 500 for the first bracket,
--    add a new 0-500 bracket with zero commission for each koperative
UPDATE commission
SET min_amount = 500.00
WHERE min_amount = 0.00;

INSERT INTO commission (min_amount, max_amount, frais, koperative_id)
SELECT 0.00, 499.00, 0.00, c.koperative_id
FROM commission c
WHERE c.min_amount = 500.00
GROUP BY c.koperative_id
ON CONFLICT DO NOTHING;

-- 2. Backfill price_koperative = price_per_seat - commission.frais
UPDATE voyage v
SET price_koperative = v.price_per_seat - COALESCE(
    (SELECT c.frais FROM commission c
     WHERE c.koperative_id = v.koperative_id
       AND v.price_per_seat >= c.min_amount
       AND v.price_per_seat <= c.max_amount
     LIMIT 1),
    0
)
WHERE v.price_koperative = 0 AND v.price_per_seat > 0;

-- 3. Backfill seat_count from totalAmount / pricePerSeat
UPDATE reservation r
SET seat_count = CASE
    WHEN v.price_per_seat > 0 THEN ROUND(r.total_amount / v.price_per_seat)
    ELSE 0
END
FROM voyage v
WHERE v.id = r.voyage_id
  AND (r.seat_count IS NULL OR r.seat_count = 0);

-- 3. Backfill frais_transaction = amount * (pourcentage / 100)
UPDATE payment_transaction pt
SET frais_transaction = ROUND(
    pt.amount * COALESCE(
        (SELECT ft.pourcentage FROM frais_transaction ft
         WHERE ft.operator_name = pt.operator_name
         LIMIT 1),
        0
    ) / 100, 2
)
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL;

-- 4. Backfill commission_seats and commission_fee for completed reservation transactions
--    Voyages before 2026-07-16: flat fee of 5000 per seat (or flat 5000 for partial payments)
--    Voyages after 2026-07-16: commission.frais based on price_per_seat bracket
--    Exception: TXNA4C86849 partial payment -> commissionSeats = 5000 flat
UPDATE payment_transaction pt
SET commission_seats = COALESCE(
        (SELECT CASE
            WHEN v.created_at < '2026-08-04 11:22:02.854035' THEN
                CASE WHEN pt.amount < r.total_amount THEN 5000
                     ELSE 5000 * r.seat_count
                END
            ELSE (SELECT c.frais * r.seat_count
                  FROM commission c
                  WHERE c.koperative_id = v.koperative_id
                    AND v.price_per_seat >= c.min_amount
                    AND v.price_per_seat <= c.max_amount
                  LIMIT 1)
         END
         FROM facturation f
         JOIN reservation r ON r.id = f.reservation_id
         JOIN voyage v ON v.id = r.voyage_id
         WHERE f.id = pt.facturation_id
         LIMIT 1),
        0
    )
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL
  AND pt.transaction_reference = 'TXNA4C86849';

UPDATE payment_transaction pt
SET commission_fee = CASE
    WHEN pt.amount < (SELECT r.total_amount FROM facturation f JOIN reservation r ON r.id = f.reservation_id WHERE f.id = pt.facturation_id)
    THEN ROUND((SELECT r.total_amount FROM facturation f JOIN reservation r ON r.id = f.reservation_id WHERE f.id = pt.facturation_id) * 0.05, 2)
    ELSE 0
END
WHERE status = 'COMPLETED'
  AND facturation_id IS NOT NULL;

-- 5. Backfill frais_retrait based on: totalAmount - (commissionFee + commissionSeats)
UPDATE payment_transaction pt
SET frais_retrait = COALESCE(
        (SELECT tmm.frais_retrait FROM tarif_mobile_money tmm
         WHERE tmm.operator_name = pt.operator_name
           AND (pt.amount - (pt.commission_fee + pt.commission_seats)) >= tmm.min_amount
           AND (pt.amount - (pt.commission_fee + pt.commission_seats)) <= tmm.max_amount
         LIMIT 1),
        0
    )
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL;

-- 6. Backfill frais_transfert based on: totalAmount - (commissionFee + commissionSeats) + fraisRetrait
UPDATE payment_transaction pt
SET frais_transfert = COALESCE(
        (SELECT tmm.frais_transfert FROM tarif_mobile_money tmm
         WHERE tmm.operator_name = pt.operator_name
           AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) >= tmm.min_amount
           AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) <= tmm.max_amount
         LIMIT 1),
        0
    )
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL;

-- 7. Backfill frais_total = frais_transaction + frais_retrait + frais_transfert
UPDATE payment_transaction
SET frais_total = frais_transaction + frais_retrait + frais_transfert
WHERE status = 'COMPLETED'
  AND facturation_id IS NOT NULL;

-- 8. Backfill facturation.commission = (commission_seats + commission_fee) - frais_total
UPDATE facturation f
SET commission = (
    SELECT ROUND(pt.commission_seats + pt.commission_fee - pt.frais_total, 2)
    FROM payment_transaction pt
    WHERE pt.facturation_id = f.id
      AND pt.status = 'COMPLETED'
    ORDER BY pt.completed_at DESC
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM payment_transaction pt
    WHERE pt.facturation_id = f.id
      AND pt.status = 'COMPLETED'
);

COMMIT;

-- Reset frais_retrait to zero for completed payments where reservation was cancelled
UPDATE payment_transaction pt
SET frais_retrait = 0
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM facturation f
    JOIN reservation r ON r.id = f.reservation_id
    WHERE f.id = pt.facturation_id
      AND r.status IN ('CANCELLED_BY_USER', 'CANCELLED_BY_OPERATOR')
  );

-- Recalculate frais_total for those affected transactions
UPDATE payment_transaction pt
SET frais_total = pt.frais_transaction + pt.frais_retrait + pt.frais_transfert
WHERE pt.status = 'COMPLETED'
  AND pt.facturation_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM facturation f
    JOIN reservation r ON r.id = f.reservation_id
    WHERE f.id = pt.facturation_id
      AND r.status IN ('CANCELLED_BY_USER', 'CANCELLED_BY_OPERATOR')
  );

-- Recalculate facturation.commission for cancelled reservations
UPDATE facturation f
SET commission = (
    SELECT ROUND(pt.commission_seats + pt.commission_fee - pt.frais_total, 2)
    FROM payment_transaction pt
    WHERE pt.facturation_id = f.id AND pt.status = 'COMPLETED'
    ORDER BY pt.completed_at DESC LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM reservation r
    WHERE r.id = f.reservation_id
      AND r.status IN ('CANCELLED_BY_USER', 'CANCELLED_BY_OPERATOR')
);

-- Special fix: TXNB9705362 (reservation with 5 seats, partial payment)
UPDATE payment_transaction
SET amount = 165250, commission_seats = 15000, commission_fee = 20250
WHERE transaction_reference = 'TXNB9705362';

UPDATE payment_transaction pt
SET frais_transaction = ROUND(pt.amount * COALESCE(
    (SELECT ft.pourcentage FROM frais_transaction ft WHERE ft.operator_name = pt.operator_name LIMIT 1), 0) / 100, 2),
    frais_retrait = COALESCE(
        (SELECT tmm.frais_retrait FROM tarif_mobile_money tmm
         WHERE tmm.operator_name = pt.operator_name
           AND (pt.amount - (pt.commission_fee + pt.commission_seats)) >= tmm.min_amount
           AND (pt.amount - (pt.commission_fee + pt.commission_seats)) <= tmm.max_amount
         LIMIT 1), 0)
WHERE pt.transaction_reference = 'TXNB9705362';

UPDATE payment_transaction pt
SET frais_transfert = COALESCE(
    (SELECT tmm.frais_transfert FROM tarif_mobile_money tmm
     WHERE tmm.operator_name = pt.operator_name
       AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) >= tmm.min_amount
       AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) <= tmm.max_amount
     LIMIT 1), 0)
WHERE pt.transaction_reference = 'TXNB9705362';

UPDATE payment_transaction
SET frais_total = frais_transaction + frais_retrait + frais_transfert
WHERE transaction_reference = 'TXNB9705362';

UPDATE facturation f SET commission = (
    SELECT ROUND(pt.commission_seats + pt.commission_fee - pt.frais_total, 2)
    FROM payment_transaction pt WHERE pt.facturation_id = f.id AND pt.transaction_reference = 'TXNB9705362'
) WHERE f.id = (SELECT facturation_id FROM payment_transaction WHERE transaction_reference = 'TXNB9705362');

-- Special fix: facturation_id 302 (TXNB9705362) - commissionSeats fixed at 5000 (not per-seat)
UPDATE payment_transaction pt
SET commission_seats = 5000
WHERE pt.facturation_id = 302 AND pt.status = 'COMPLETED';

UPDATE payment_transaction pt
SET frais_retrait = COALESCE(
    (SELECT tmm.frais_retrait FROM tarif_mobile_money tmm
     WHERE tmm.operator_name = pt.operator_name
       AND (pt.amount - (pt.commission_fee + pt.commission_seats)) >= tmm.min_amount
       AND (pt.amount - (pt.commission_fee + pt.commission_seats)) <= tmm.max_amount
     LIMIT 1), 0)
WHERE pt.facturation_id = 302 AND pt.status = 'COMPLETED';

UPDATE payment_transaction pt
SET frais_transfert = COALESCE(
    (SELECT tmm.frais_transfert FROM tarif_mobile_money tmm
     WHERE tmm.operator_name = pt.operator_name
       AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) >= tmm.min_amount
       AND (pt.amount - (pt.commission_fee + pt.commission_seats) + pt.frais_retrait) <= tmm.max_amount
     LIMIT 1), 0)
WHERE pt.facturation_id = 302 AND pt.status = 'COMPLETED';

UPDATE payment_transaction SET frais_total = frais_transaction + frais_retrait + frais_transfert
WHERE facturation_id = 302 AND status = 'COMPLETED';

UPDATE facturation f SET commission = (
    SELECT ROUND(pt.commission_seats + pt.commission_fee - pt.frais_total, 2)
    FROM payment_transaction pt WHERE pt.facturation_id = f.id AND pt.status = 'COMPLETED'
    ORDER BY pt.completed_at DESC LIMIT 1
) WHERE f.id = 302;
