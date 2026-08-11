-- ============================================================
-- VOYAGE STORED PROCEDURES
-- ============================================================

-- ------------------------------------------------------------
-- delete_voyage(p_voyage_id)
--
-- Supprime un voyage et TOUTES ses données dépendantes :
--   1. Instances générées (parent_template_id → Voyage)  [récursif]
--   2. Facturation  (reservation_id → Reservation → voyage_id)
--   3. Seat         (voyage_id → Voyage)
--   4. Reservation  (voyage_id → Voyage)
--   5. Voyage       (id)
--
-- Usage :
--   CALL delete_voyage(42);
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE delete_voyage(p_voyage_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_child_id  BIGINT;
    v_exists    BOOLEAN;
BEGIN
    -- Vérifier que le voyage existe
    SELECT EXISTS(SELECT 1 FROM voyage WHERE id = p_voyage_id) INTO v_exists;
    IF NOT v_exists THEN
        RAISE WARNING 'delete_voyage: Voyage id=% introuvable, opération ignorée.', p_voyage_id;
        RETURN;
    END IF;

    -- 1. Supprimer récursivement les voyages enfants (instances générées)
    FOR v_child_id IN
        SELECT id FROM voyage WHERE parent_template_id = p_voyage_id
    LOOP
        CALL delete_voyage(v_child_id);
    END LOOP;

    -- 2. Supprimer les Facturation liées aux réservations de ce voyage
    DELETE FROM facturation
    WHERE reservation_id IN (
        SELECT id FROM reservation WHERE voyage_id = p_voyage_id
    );

    -- 3. Supprimer tous les Seat du voyage
    --    (couvre les sièges libres ET ceux liés à une réservation)
    DELETE FROM seat WHERE voyage_id = p_voyage_id;

    -- 4. Supprimer les Reservation du voyage
    DELETE FROM reservation WHERE voyage_id = p_voyage_id;

    -- 5. Supprimer le Voyage lui-même
    DELETE FROM voyage WHERE id = p_voyage_id;

    RAISE NOTICE 'delete_voyage: Voyage id=% et toutes ses données dépendantes supprimés.', p_voyage_id;
END;
$$;
