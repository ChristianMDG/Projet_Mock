CREATE OR REPLACE PROCEDURE pop_guichets()
LANGUAGE sql
AS $$
-- Sync the sequence to the maximum existing ID
SELECT setval(pg_get_serial_sequence('public.guichet', 'id'), (SELECT COALESCE(MAX(id), 0) FROM public.guichet));

INSERT INTO public.guichet (
    name,
    koperative_id,
    gare_id,
    phones,
    is_active,
    created_at,
    updated_at
)
SELECT DISTINCT
    k.name || ' (' || v.name || ')',
    k.id,
    g.id,
    k.phone,
    true,
    NOW(),
    NOW()
FROM public.koperative k
JOIN public.koperative_ville kv ON k.id = kv.koperative_id
JOIN public.ville v ON kv.villes_id = v.id
JOIN public.gare g ON v.id = g.ville_id
WHERE k.status = 'ACTIVE'
  AND v.is_active = true
  AND g.is_closed = false
ON CONFLICT (koperative_id, gare_id) DO NOTHING;

-- Populate guichet_destinations
INSERT INTO public.guichet_destinations (guichet_id, gare_id)
SELECT DISTINCT
    g_origin.id,
    g_dest.id
FROM public.guichet g_origin
JOIN public.gare gare_origin ON g_origin.gare_id = gare_origin.id
JOIN public.koperative k ON g_origin.koperative_id = k.id
JOIN public.koperative_ville kv_dest ON k.id = kv_dest.koperative_id
JOIN public.gare g_dest ON kv_dest.villes_id = g_dest.ville_id
WHERE gare_origin.ville_id != g_dest.ville_id
  AND g_dest.is_closed = false
ON CONFLICT (guichet_id, gare_id) DO NOTHING;
$$;
