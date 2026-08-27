export type SeoLanguage = 'mg' | 'fr' | 'en';

export const SEO_LANGUAGES = ['mg', 'fr', 'en'] as const satisfies readonly SeoLanguage[];

export function toSeoLanguage(language: string): SeoLanguage {
  if ((SEO_LANGUAGES as readonly string[]).includes(language)) return language as SeoLanguage;
  return 'mg';
}

export const BASE_TAXIBROUSSE_KEYWORDS: Record<SeoLanguage, readonly string[]> = {
  mg: [
    'location de voitures',
    'location utilitaires',
    'manofa fiara',
    'manofa sprinter',
    'location voiture Madagascar',
    'louer voiture Madagascar',
    'location 4x4',
    'fiara hofaina',
    'sprinter hofaina',
    'Antananarivo',
    'Toamasina',
    'Mahajanga',
    'Fianarantsoa',
    'Antsirabe',
    'Toliara',
    'Diego Suarez',
    'Morondava',
  ],
  fr: [
    'location de voiture',
    'location utilitaire',
    'location de voitures Madagascar',
    'louer voiture Madagascar',
    'location de vehicules',
    'location 4x4',
    'location de voiture pas cher',
    'agence de location de voiture',
    'louer utilitaire',
    'déménagement Madagascar',
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
  ],
  en: [
    'car rental',
    'van rental',
    'car rental Madagascar',
    'rent a car Madagascar',
    'hire car Madagascar',
    '4x4 rental',
    'cheap car rental',
    'car rental agency',
    'rent utility vehicle',
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
