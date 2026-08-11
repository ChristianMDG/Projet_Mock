export type SeoLanguage = 'mg' | 'fr' | 'en';

export const SEO_LANGUAGES = ['mg', 'fr', 'en'] as const satisfies readonly SeoLanguage[];

export function toSeoLanguage(language: string): SeoLanguage {
  if ((SEO_LANGUAGES as readonly string[]).includes(language)) return language as SeoLanguage;
  return 'mg';
}

export const BASE_TAXIBROUSSE_KEYWORDS: Record<SeoLanguage, readonly string[]> = {
  mg: [
    'taxi-brousse',
    'Taxibrousse',
    'taxi an-tanàn-dehibe',
    'taxi nasionaly',
    'taxi anelanelan-tanàna',
    'famandrihana taxi-brousse',
    'famandrihana tapakila',
    'fitaterana an-dalana',
    'fitaterana nasionaly',
    'dia',
    'gara',
    'koperativa',
    'Madagasikara',
    'famandrihana an-tserasera',
    'tapakila taxi-brousse',
    'vidiny taxi-brousse',
    'fotoana fiaingana',
    'lalana taxi-brousse',
    'Antananarivo',
    'Toamasina',
    'Mahajanga',
    'Fianarantsoa',
    'Antsirabe',
    'Toliara',
    'Diego Suarez',
    'Morondava',
    'Tana',
    'taxi azo antoka',
    'fitaterana mora',
    'seza taxi-brousse',
    'fandaharam-potoana',
    'dia isan-andro',
    'dia alina',
    'cotisse',
    'sprinter',
    'minibus',
    'crafter',
  ],
  fr: [
    'taxi-brousse',
    'Taxibrousse',
    'taxi urbain',
    'taxi national',
    'taxi interurbain',
    'réservation taxi-brousse',
    'billet taxi-brousse',
    'transport interurbain',
    'transport national',
    'voyage',
    'gare routière',
    'coopérative',
    'Madagascar',
    'réservation en ligne',
    'acheter billet taxi-brousse',
    'prix taxi-brousse',
    'tarif taxi-brousse',
    'horaires taxi-brousse',
    'trajet taxi-brousse',
    'Antananarivo',
    'Toamasina',
    'Tamatave',
    'Mahajanga',
    'Majunga',
    'Fianarantsoa',
    'Antsirabe',
    'Toliara',
    'Tuléar',
    'Diego Suarez',
    'Antsiranana',
    'Morondava',
    'Tana',
    'transport sécurisé',
    'transport confortable',
    'place taxi-brousse',
    'départ quotidien',
    'voyage de nuit',
    'cotisse Madagascar',
    'sprinter Madagascar',
    'minibus Madagascar',
    'crafter Madagascar',
  ],
  en: [
    'taxi-brousse',
    'Taxibrousse',
    'urban taxi',
    'national taxi',
    'intercity taxi',
    'taxi-brousse booking',
    'bus ticket booking',
    'intercity transport',
    'national transport',
    'trip',
    'bus station',
    'cooperative',
    'Madagascar',
    'online booking Madagascar',
    'buy taxi-brousse ticket',
    'taxi-brousse price',
    'taxi-brousse fare',
    'taxi-brousse schedule',
    'Madagascar travel',
    'Antananarivo',
    'Toamasina',
    'Tamatave',
    'Mahajanga',
    'Majunga',
    'Fianarantsoa',
    'Antsirabe',
    'Toliara',
    'Tulear',
    'Diego Suarez',
    'Antsiranana',
    'Morondava',
    'Tana',
    'safe transport Madagascar',
    'comfortable travel',
    'seat reservation',
    'daily departure',
    'night travel Madagascar',
    'Madagascar bus',
    'Madagascar minibus',
    'Madagascar long distance',
    'Madagascar crafter',
  ],
};

const SEO_META_KEYWORDS_MAX_KEYWORDS = 60;
const SEO_META_KEYWORDS_MAX_CHARS = 600;

function capKeywordsForMeta(keywords: readonly string[]): string[] {
  const cappedByCount = keywords.slice(0, SEO_META_KEYWORDS_MAX_KEYWORDS);

  const cappedByChars: string[] = [];
  let currentLength = 0;

  for (const keyword of cappedByCount) {
    const prefix = cappedByChars.length === 0 ? '' : ', ';
    const additionLength = prefix.length + keyword.length;
    if (currentLength + additionLength > SEO_META_KEYWORDS_MAX_CHARS) break;

    cappedByChars.push(keyword);
    currentLength += additionLength;
  }

  if (cappedByChars.length > 0) return cappedByChars;
  if (cappedByCount.length === 0) return [];
  return [cappedByCount[0].slice(0, SEO_META_KEYWORDS_MAX_CHARS)];
}

function normalizeKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function mergeUniqueKeywords(
  base: readonly string[],
  extra?: string | Array<string | null | undefined> | null,
): string[] {
  const extraList = typeof extra === 'string' ? [extra] : (extra ?? []);

  const merged = [...base, ...extraList].map(keyword => (keyword ?? '').trim()).filter(Boolean);

  const seen = new Set<string>();
  const unique: string[] = [];

  for (const keyword of merged) {
    const normalized = normalizeKeyword(keyword);
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    unique.push(keyword);
  }

  return unique;
}

export function buildSeoKeywordsContent(
  language: string,
  extra?: string | Array<string | null | undefined> | null,
): string {
  const lang = toSeoLanguage(language);
  const keywords = mergeUniqueKeywords(BASE_TAXIBROUSSE_KEYWORDS[lang], extra);
  return capKeywordsForMeta(keywords).join(', ');
}
