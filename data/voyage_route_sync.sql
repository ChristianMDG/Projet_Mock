-- VOYAGE ROUTE SYNC SCRIPT
-- 1. Updates route_id on every Voyage row by matching departure_gare_id
--    and arrival_gare_id against the Route table.
-- 2. Updates frais_taxibrousse on every Route with the minimum price_per_seat
--    from all voyages associated with that route.
--
-- Entities involved:
--   VoyageEntity  (table: voyage) → route_id, departure_gare_id, arrival_gare_id, price_per_seat
--   RouteEntity   (table: route)  → id, departure_gare_id, arrival_gare_id, frais_taxibrousse

DO $$
    DECLARE
        updated_count   integer;
        unmatched_count integer;
        price_updated_count integer;
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
        -- 2. Perform the route_id UPDATE
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
        -- 3. Update route frais_taxibrousse with minimum voyage price
        -- ----------------------------------------------------------------
        RAISE NOTICE 'Syncing route prices with minimum voyage price_per_seat...';
        
        UPDATE route r
        SET    frais_taxibrousse = voyage_prices.min_price
        FROM (
            SELECT v.route_id,
                   MIN(v.price_per_seat) AS min_price
            FROM   voyage v
            WHERE  v.route_id IS NOT NULL
              AND  v.price_per_seat IS NOT NULL
            GROUP BY v.route_id
        ) AS voyage_prices
        WHERE  r.id = voyage_prices.route_id
          AND  (r.frais_taxibrousse IS DISTINCT FROM voyage_prices.min_price);

        GET DIAGNOSTICS price_updated_count = ROW_COUNT;
        RAISE NOTICE 'Updated % route(s) with minimum voyage price.', price_updated_count;

        -- ----------------------------------------------------------------
        -- 4. Report: voyages WITHOUT a matching active route
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
