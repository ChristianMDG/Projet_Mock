-- VOYAGE ROUTE SYNC SCRIPT
-- Updates route_id on every Voyage row by matching departure_gare_id
-- and arrival_gare_id against the Route table.
--
-- Entities involved:
--   VoyageEntity  (table: voyage) → route_id, departure_gare_id, arrival_gare_id
--   RouteEntity   (table: route)  → id, departure_gare_id, arrival_gare_id

DO $$
    DECLARE
        updated_count   integer;
        unmatched_count integer;
    BEGIN
        RAISE NOTICE '=== Voyage → Route sync starting ===';

        -- ----------------------------------------------------------------
        -- 1. Preview: voyages WITH a matching route
        -- ----------------------------------------------------------------
        RAISE NOTICE 'Voyages with a matching route:';
        FOR updated_count IN
            SELECT COUNT(*)
            FROM voyage v
            JOIN route r
              ON r.departure_gare_id = v.departure_gare_id
             AND r.arrival_gare_id   = v.arrival_gare_id
             AND r.is_active         = true
            WHERE v.route_id IS DISTINCT FROM r.id
        LOOP
            RAISE NOTICE '  → % voyage(s) will be updated', updated_count;
        END LOOP;

        -- ----------------------------------------------------------------
        -- 2. Perform the UPDATE
        -- ----------------------------------------------------------------
        UPDATE voyage v
        SET    route_id = r.id
        FROM   route r
        WHERE  r.departure_gare_id = v.departure_gare_id
          AND  r.arrival_gare_id   = v.arrival_gare_id
          AND  r.is_active         = true
          AND  v.route_id IS DISTINCT FROM r.id;

        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'Updated % voyage row(s) with matching route_id.', updated_count;

        -- ----------------------------------------------------------------
        -- 3. Report: voyages WITHOUT a matching active route
        -- ----------------------------------------------------------------
        SELECT COUNT(*) INTO unmatched_count
        FROM voyage v
        WHERE NOT EXISTS (
            SELECT 1
            FROM route r
            WHERE r.departure_gare_id = v.departure_gare_id
              AND r.arrival_gare_id   = v.arrival_gare_id
              AND r.is_active         = true
        );

        IF unmatched_count > 0 THEN
            RAISE WARNING '% voyage(s) could not be matched to any active route (departure_gare_id / arrival_gare_id pair not found in route table).', unmatched_count;
            RAISE NOTICE 'Run the query below to inspect unmatched voyages:';
            RAISE NOTICE '  SELECT v.id, v.departure_gare_id, v.arrival_gare_id, v.route_id'
                         ' FROM voyage v'
                         ' WHERE NOT EXISTS ('
                         '   SELECT 1 FROM route r'
                         '   WHERE r.departure_gare_id = v.departure_gare_id'
                         '     AND r.arrival_gare_id   = v.arrival_gare_id'
                         '     AND r.is_active = true'
                         ' );';
        ELSE
            RAISE NOTICE 'All voyages have been successfully matched to an active route.';
        END IF;

        RAISE NOTICE '=== Voyage → Route sync complete ===';
    END;
$$;

-- ----------------------------------------------------------------
-- Optional: standalone diagnostic queries (run manually as needed)
-- ----------------------------------------------------------------

-- List voyages with their matched route (after sync)
-- SELECT v.id            AS voyage_id,
--        v.route_id,
--        v.departure_gare_id,
--        v.arrival_gare_id,
--        r.name         AS route_name
-- FROM   voyage v
-- LEFT JOIN route r ON r.id = v.route_id
-- ORDER  BY v.id;

-- List voyages still missing a route
-- SELECT v.id, v.departure_gare_id, v.arrival_gare_id
-- FROM   voyage v
-- WHERE  v.route_id IS NULL
-- ORDER  BY v.id;
