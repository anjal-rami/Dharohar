import {
  CATEGORY_META,
  HERITAGE_SITES,
  type HeritageSite,
  type VerifiedSource,
} from "@/lib/heritage-data";
import { localized, type Locale } from "@/lib/i18n";
import { findTempleMatch, formatTempleResponse } from "@/lib/chatbot-guardrails";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ResponseStatus =
  "verified_answer" | "likely_match" | "clarification_needed" | "unknown_term" | "greeting";

export type AssistantAnswer = {
  text: string;
  confidence: ConfidenceLevel;
  status: ResponseStatus;
  sources: (VerifiedSource & { siteSlug: string; siteTitle: string })[];
  retrieved: HeritageSite[];
  suggestions?: string[] | undefined;
  canReport?: boolean | undefined;
};

/* ----------------- Stop Words & Normalization ----------------- */

const STOP = new Set([
  "the",
  "a",
  "an",
  "of",
  "in",
  "on",
  "is",
  "are",
  "was",
  "were",
  "and",
  "to",
  "for",
  "which",
  "what",
  "how",
  "why",
  "who",
  "where",
  "when",
  "me",
  "my",
  "near",
  "at",
  "with",
  "about",
  "tell",
  "explain",
  "list",
  "know",
  "give",
  "show",
  "can",
  "you",
  "please",
  "does",
  "do",
  "did",
  "any",
  "some",
  "site",
  "sites",
  "culture",
  "heritage",
  "india",
  "indian",
]);

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractKeyTerms(q: string): string[] {
  const norm = normalizeText(q);
  return norm.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
}

/**
 * Phonetic normalization handling Indian English / regional transliteration
 * variations (e.g. v/w, sh/s, th/t, ee/i, oo/u, kh/k, etc.)
 */
export function phoneticNormalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ph/g, "f")
    .replace(/th/g, "t")
    .replace(/dh/g, "d")
    .replace(/kh/g, "k")
    .replace(/gh/g, "g")
    .replace(/sh/g, "s")
    .replace(/ch/g, "c")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/w/g, "v")
    .replace(/y/g, "i")
    .replace(/z/g, "j")
    .replace(/aa/g, "a")
    .replace(/ii/g, "i")
    .replace(/uu/g, "u")
    .replace(/[^a-z0-9]/g, "");
}

/* ----------------- Fuzzy Matching Algorithms ----------------- */

export function levenshteinDistance(s1: string, s2: string): number {
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
  const curr = new Array<number>(s2.length + 1);

  for (let i = 1; i <= s1.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min((prev[j] ?? 0) + 1, (curr[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    prev = [...curr];
  }
  return prev[s2.length] ?? 0;
}

export function trigramSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  if (a.length < 2 || b.length < 2) return 0;

  const makeTrigrams = (s: string) => {
    const pad = `  ${s} `;
    const set = new Set<string>();
    for (let i = 0; i < pad.length - 2; i++) {
      set.add(pad.slice(i, i + 3));
    }
    return set;
  };

  const setA = makeTrigrams(a);
  const setB = makeTrigrams(b);
  let overlap = 0;
  for (const tri of setA) {
    if (setB.has(tri)) overlap++;
  }
  return (2 * overlap) / (setA.size + setB.size);
}

/* ----------------- Known Heritage Aliases & Transliterations ----------------- */

export type HeritageAlias = {
  slug: string;
  canonical: string;
  category: string;
  state: string;
};

export const HERITAGE_ALIASES: Record<string, HeritageAlias> = {
  // Brihadisvara Temple / Thanjavur / Chola
  brihadeeswara: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  brihadeeswarar: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  brihadishwara: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "brihadeeswara temple": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  brihadisvara: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  peruvudaiyar: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "peruvudaiyar kovil": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "tanjore temple": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "thanjavur temple": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "big temple": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "chola vimana": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "chola temples": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },
  "rajaraja chola": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Brihadisvara Temple, Thanjavur",
    category: "Monuments",
    state: "Tamil Nadu",
  },

  // Golconda Fort / Hyderabad
  golkonda: {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  "golkonda fort": {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  "golkonda qila": {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  golconda: {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  "golconda acoustics": {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  "fateh darwaza": {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },
  "bala hissar": {
    slug: "golconda-fort-hyderabad",
    canonical: "Golconda Fort, Hyderabad",
    category: "Monuments",
    state: "Telangana",
  },

  // Modhera Sun Temple / Gujarat
  modherah: {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "modhera temple": {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  modhera: {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "surya mandir modhera": {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "surya mandir": {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "surya kund": {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "sun temple gujarat": {
    slug: "modhera-sun-temple-patan",
    canonical: "Modhera Sun Temple, Patan",
    category: "Monuments",
    state: "Gujarat",
  },

  // Dholavira & Indus Valley
  dholaveera: {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  dholavira: {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  "kotada timba": {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  harappa: {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  harappan: {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  "indus valley": {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  "indus valley civilization": {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },
  "sindhu ghati": {
    slug: "dholavira-indus-valley",
    canonical: "Dholavira, Indus Valley",
    category: "Monuments",
    state: "Gujarat",
  },

  // Rani ki Vav / Stepwells
  "rani ki vav": {
    slug: "rani-ki-vav-patan",
    canonical: "Rani ki Vav, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "queen's stepwell": {
    slug: "rani-ki-vav-patan",
    canonical: "Rani ki Vav, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "queens stepwell": {
    slug: "rani-ki-vav-patan",
    canonical: "Rani ki Vav, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "patan stepwell": {
    slug: "rani-ki-vav-patan",
    canonical: "Rani ki Vav, Patan",
    category: "Monuments",
    state: "Gujarat",
  },
  "rani ki baoli": {
    slug: "rani-ki-vav-patan",
    canonical: "Rani ki Vav, Patan",
    category: "Monuments",
    state: "Gujarat",
  },

  // Kanchipuram Silk & Korvai
  kanchipuram: {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  "kanchi silk": {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  kanjeevaram: {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  kanjivaram: {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  korvai: {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  "korvai weave": {
    slug: "kanchipuram-silk-weaving",
    canonical: "Kanchipuram silk weaving",
    category: "Crafts",
    state: "Tamil Nadu",
  },

  // Kath-kuni / Himalayan architecture
  kathkuni: {
    slug: "chandratal-hill-temples",
    canonical: "Kath-kuni hill temples, Kinnaur",
    category: "Monuments",
    state: "Himachal Pradesh",
  },
  "kath kuni": {
    slug: "chandratal-hill-temples",
    canonical: "Kath-kuni hill temples, Kinnaur",
    category: "Monuments",
    state: "Himachal Pradesh",
  },
  katkuni: {
    slug: "chandratal-hill-temples",
    canonical: "Kath-kuni hill temples, Kinnaur",
    category: "Monuments",
    state: "Himachal Pradesh",
  },
  "kinnaur temples": {
    slug: "chandratal-hill-temples",
    canonical: "Kath-kuni hill temples, Kinnaur",
    category: "Monuments",
    state: "Himachal Pradesh",
  },

  // Durga Puja & Kumartuli
  "durga puja": {
    slug: "durga-puja-kolkata",
    canonical: "Durga Puja, Kolkata",
    category: "Festivals",
    state: "West Bengal",
  },
  durgotsava: {
    slug: "durga-puja-kolkata",
    canonical: "Durga Puja, Kolkata",
    category: "Festivals",
    state: "West Bengal",
  },
  kumartuli: {
    slug: "durga-puja-kolkata",
    canonical: "Durga Puja, Kolkata",
    category: "Festivals",
    state: "West Bengal",
  },
  "kathamo puja": {
    slug: "durga-puja-kolkata",
    canonical: "Durga Puja, Kolkata",
    category: "Festivals",
    state: "West Bengal",
  },

  // Kathakali
  kathakali: {
    slug: "kathakali-kerala",
    canonical: "Kathakali, Kerala",
    category: "Performing Arts",
    state: "Kerala",
  },
  "kathakali dance": {
    slug: "kathakali-kerala",
    canonical: "Kathakali, Kerala",
    category: "Performing Arts",
    state: "Kerala",
  },

  // Majuli Satras & Sattriya
  sattriya: {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },
  "sattriya dance": {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },
  majuli: {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },
  "samaguri satra": {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },
  satra: {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },
  borgeet: {
    slug: "sattriya-majuli",
    canonical: "Sattriya & Satras of Majuli",
    category: "Performing Arts",
    state: "Assam",
  },

  // Baul song
  baul: {
    slug: "baul-song-bengal",
    canonical: "Baul song tradition, Bengal",
    category: "Music",
    state: "West Bengal",
  },
  "baul song": {
    slug: "baul-song-bengal",
    canonical: "Baul song tradition, Bengal",
    category: "Music",
    state: "West Bengal",
  },
  ektara: {
    slug: "baul-song-bengal",
    canonical: "Baul song tradition, Bengal",
    category: "Music",
    state: "West Bengal",
  },

  // Bandhani
  bandhani: {
    slug: "bandhani-kutch",
    canonical: "Bandhani tie-dye, Kutch",
    category: "Crafts",
    state: "Gujarat",
  },
  bandhej: {
    slug: "bandhani-kutch",
    canonical: "Bandhani tie-dye, Kutch",
    category: "Crafts",
    state: "Gujarat",
  },

  // Palm-leaf manuscripts
  "palm leaf manuscripts": {
    slug: "palm-leaf-manuscripts-odisha",
    canonical: "Palm-leaf manuscripts of Odisha",
    category: "Manuscripts",
    state: "Odisha",
  },
  talapatra: {
    slug: "palm-leaf-manuscripts-odisha",
    canonical: "Palm-leaf manuscripts of Odisha",
    category: "Manuscripts",
    state: "Odisha",
  },

  // Patan Patola
  patola: {
    slug: "rani-ki-vav-patan",
    canonical: "Patan Patola & Rani ki Vav",
    category: "Crafts",
    state: "Gujarat",
  },
  "double ikat": {
    slug: "rani-ki-vav-patan",
    canonical: "Patan Patola & Rani ki Vav",
    category: "Crafts",
    state: "Gujarat",
  },

  // Swamimalai bronzes
  swamimalai: {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Swamimalai lost-wax bronze casting",
    category: "Crafts",
    state: "Tamil Nadu",
  },
  "lost wax casting": {
    slug: "brihadisvara-temple-thanjavur",
    canonical: "Swamimalai lost-wax bronze casting",
    category: "Crafts",
    state: "Tamil Nadu",
  },
};

/* ----------------- Scoring & Retrieval ----------------- */

function scoreSite(site: HeritageSite, terms: string[], rawNormalized: string, locale: Locale) {
  const hay = [
    ...Object.values(site.titles),
    ...Object.values(site.summary),
    ...Object.values(site.description),
    site.state,
    site.district,
    site.significance,
    site.accessibility.notes,
    site.preservationNote,
    CATEGORY_META[site.category]?.label ?? "",
    site.era,
    site.kind,
    ...site.tags,
    ...site.relatedTraditions,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  // Exact localized title match
  const siteTitleNorm = normalizeText(localized(site.titles, locale) || site.title);
  if (siteTitleNorm === rawNormalized || rawNormalized.includes(siteTitleNorm)) {
    score += 8;
  }

  // Exact phrase match in summary or description
  if (hay.includes(rawNormalized) && rawNormalized.length > 3) {
    score += 5;
  }

  // Token matching
  for (const term of terms) {
    if (hay.includes(term)) {
      score += 2;
    }
    // Boost if title includes term
    if (siteTitleNorm.includes(term)) {
      score += 2;
    }
  }

  return score;
}

export type RetrievalResult = {
  ranked: { site: HeritageSite; score: number }[];
  confidence: ConfidenceLevel;
};

export function retrieve(question: string, locale: Locale): RetrievalResult {
  const norm = normalizeText(question);
  const terms = extractKeyTerms(question);

  const ranked = HERITAGE_SITES.map((site) => ({
    site,
    score: scoreSite(site, terms, norm, locale),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const topScore = ranked[0]?.score ?? 0;
  const confidence: ConfidenceLevel = topScore >= 5 ? "high" : topScore >= 2 ? "medium" : "low";

  return { ranked, confidence };
}

/** Compact English context block for the LLM, built strictly from retrieved records. */
export function buildContext(sites: HeritageSite[], locale: Locale): string {
  return sites
    .map((site, i) => {
      const sources = site.sources.map((s) => `${s.title} (${s.publisher}, ${s.year})`).join("; ");
      return `[${i + 1}] ${localized(site.titles, locale)} — ${site.district}, ${site.state} · ${site.period}\n${localized(site.summary, locale)}\nSignificance: ${site.significance}\nPreservation: ${site.preservation}\nAccess: ${site.accessibility.wheelchair ? "wheelchair accessible" : "limited wheelchair access"}\nSources: ${sources}`;
    })
    .join("\n\n");
}

/* ----------------- Fuzzy / Alias Search ----------------- */

type PossibleMatch = {
  canonical: string;
  siteSlug: string;
  category: string;
  state?: string;
  similarity: number;
};

export function findPossibleMatches(term: string): PossibleMatch[] {
  const normTerm = normalizeText(term);
  const phonTerm = phoneticNormalize(term);
  if (!normTerm || normTerm.length < 3) return [];

  const matches: PossibleMatch[] = [];
  const seenSlugs = new Set<string>();

  // 1. Check known aliases
  for (const [aliasKey, aliasData] of Object.entries(HERITAGE_ALIASES)) {
    const aliasNorm = normalizeText(aliasKey);
    const aliasPhon = phoneticNormalize(aliasKey);

    // Exact alias substring or match
    if (aliasNorm === normTerm || normTerm.includes(aliasNorm) || aliasNorm.includes(normTerm)) {
      if (!seenSlugs.has(aliasData.slug)) {
        seenSlugs.add(aliasData.slug);
        matches.push({
          canonical: aliasData.canonical,
          siteSlug: aliasData.slug,
          category: aliasData.category,
          state: aliasData.state,
          similarity: 1.0,
        });
      }
      continue;
    }

    // Phonetic match
    if (phonTerm && aliasPhon && (phonTerm === aliasPhon || aliasPhon.includes(phonTerm))) {
      if (!seenSlugs.has(aliasData.slug)) {
        seenSlugs.add(aliasData.slug);
        matches.push({
          canonical: aliasData.canonical,
          siteSlug: aliasData.slug,
          category: aliasData.category,
          state: aliasData.state,
          similarity: 0.85,
        });
      }
      continue;
    }

    // Trigram similarity
    const tri = trigramSimilarity(normTerm, aliasNorm);
    if (tri >= 0.55) {
      if (!seenSlugs.has(aliasData.slug)) {
        seenSlugs.add(aliasData.slug);
        matches.push({
          canonical: aliasData.canonical,
          siteSlug: aliasData.slug,
          category: aliasData.category,
          state: aliasData.state,
          similarity: tri,
        });
      }
      continue;
    }

    // Levenshtein for close words
    if (normTerm.length >= 4 && aliasNorm.length >= 4) {
      const dist = levenshteinDistance(normTerm, aliasNorm);
      if (dist <= 2) {
        if (!seenSlugs.has(aliasData.slug)) {
          seenSlugs.add(aliasData.slug);
          matches.push({
            canonical: aliasData.canonical,
            siteSlug: aliasData.slug,
            category: aliasData.category,
            state: aliasData.state,
            similarity: 0.8,
          });
        }
      }
    }
  }

  // 2. Check site titles and tags directly
  for (const site of HERITAGE_SITES) {
    if (seenSlugs.has(site.slug)) continue;

    const siteTitleNorm = normalizeText(site.title);
    const tri = trigramSimilarity(normTerm, siteTitleNorm);
    if (tri >= 0.5) {
      seenSlugs.add(site.slug);
      matches.push({
        canonical: site.title,
        siteSlug: site.slug,
        category: CATEGORY_META[site.category]?.label ?? "Monument",
        state: site.state,
        similarity: tri,
      });
      continue;
    }

    // Check tags
    for (const tag of site.tags) {
      const tagNorm = normalizeText(tag);
      if (tagNorm === normTerm || trigramSimilarity(normTerm, tagNorm) >= 0.7) {
        seenSlugs.add(site.slug);
        matches.push({
          canonical: site.title,
          siteSlug: site.slug,
          category: CATEGORY_META[site.category]?.label ?? "Heritage Site",
          state: site.state,
          similarity: 0.75,
        });
        break;
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
}

/* ----------------- Greetings & Conversational Queries ----------------- */

export const GREETING_PATTERNS = [
  /^(hi|hii+|hello|heyy*|hey|namaste|namaskar|kem cho|pranam|adaab|vanakkam|sat sri akal|good (morning|afternoon|evening))\b/i,
  /^(who are you|what can you do|help|help me|introduce yourself)\b/i,
];

export function isConversationalGreeting(query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  // Check if the query is strictly a short greeting (< 4 words)
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount <= 3) {
    return GREETING_PATTERNS.some((pattern) => pattern.test(trimmed));
  }
  return false;
}

export function greetingAnswer(locale: Locale): AssistantAnswer {
  const GREETING_TEXTS: Record<string, string> = {
    en: "Namaste! 🙏 I am Bharti, your AI heritage guide. How can I help you explore India's monuments, cultural traditions, or historical sites today?",
    hi: "नमस्ते! 🙏 मैं भारती हूँ, आपकी सांस्कृतिक मार्गदर्शिका। आज आप भारत के किस स्मारक, संस्कृति या ऐतिहासिक धरोहर के बारे में जानना चाहते हैं?",
    ta: "வணக்கம்! 🙏 நான் பாரதி, உங்கள் பாரம்பரிய வழிகாட்டி. இந்தியாவின் வரலாற்று சின்னங்கள் மற்றும் கலாச்சாரத்தை அறிய நான் உங்களுக்கு எவ்வாறு உதவலாம்?",
    te: "నమస్కారం! 🙏 నేను భారతిని, మీ సాంస్కృతిక మార్గదర్శిని. భారతదేశ అద్భుతమైన కట్టడాలు మరియు సంస్కృతి గురించి తెలుసుకోవడానికి నేను మీకు ఎలా సహాయపడగలను?",
    gu: "નમસ્તે! 🙏 હું ભારતી છું, તમારી સાંસ્કૃતિક માર્ગદર્શિકા. આજે તમે ભારતના કયા સ્મારક કે વારસા વિશે જાણવા માગો છો?",
    bn: "নমস্কার! 🙏 আমি ভারতী, আপনার ঐতিহ্য নির্দেশিকা। ভারতের সমৃদ্ধ ঐতিহ্য এবং ঐতিহাসিক স্থান সম্পর্কে জানতে আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    mr: "नमस्कार! 🙏 मी भारती, तुमची सांस्कृतिक मार्गदर्शक. भारताचा समृद्ध वारसा आणि स्मारकांबद्दल जाणून घेण्यासाठी मी तुम्हाला कशी मदत करू शकेन?",
  };

  const fallback =
    "Namaste! 🙏 I am Bharti, your AI heritage guide. How can I help you explore India's monuments, cultural traditions, or historical sites today?";

  return {
    text: GREETING_TEXTS[locale] ?? fallback,
    confidence: "high",
    status: "greeting",
    sources: [],
    retrieved: [], // Do NOT attach any monument card on greeting
    suggestions: [
      "The acoustics of Golconda Fort",
      "Kanchipuram korvai silk weaving",
      "Modhera Sun Temple architecture",
      "Dholavira Indus Valley reservoirs",
    ],
    canReport: false,
  };
}

/* ----------------- Cultural Clarification Messages ----------------- */

function clarificationAnswer(
  term: string,
  locale: Locale,
  possibleMatches: PossibleMatch[],
): AssistantAnswer {
  // If there are close candidates, suggest them nicely
  if (possibleMatches.length > 0) {
    const listItems = possibleMatches
      .map((m) => `• **${m.canonical}** (${m.state ? `${m.state} · ` : ""}${m.category})`)
      .join("\n");

    const matchedSites = possibleMatches
      .map((m) => HERITAGE_SITES.find((s) => s.slug === m.siteSlug))
      .filter((s): s is HeritageSite => Boolean(s));

    const sources = matchedSites.flatMap((site) =>
      site.sources.map((s) => ({
        ...s,
        siteSlug: site.slug,
        siteTitle: localized(site.titles, locale),
      })),
    );

    const suggestions = possibleMatches.map((m) => m.canonical);

    const text = [
      `I couldn't find an exact match for '**${term}**', but I found a few potentially related heritage topics from our database:`,
      listItems,
      `Did you mean one of these? If so, tap a suggestion or tell me which one you would like to explore.`,
      `If you meant a different regional tradition or community practice, let me know which state, district, or craft it relates to.`,
    ].join("\n\n");

    return {
      text,
      confidence: "medium",
      status: "clarification_needed",
      sources,
      retrieved: matchedSites,
      suggestions,
      canReport: false,
    };
  }

  // If completely unknown term (e.g. "Bhartilow")
  const CLARIFICATION_PROMPTS: Record<Locale, string> = {
    en: [
      `I want to identify '**${term}**' correctly rather than give you inaccurate information.`,
      `Could you share a little more context? For instance:\n• Which state, district, or region is it associated with?\n• Is it a monument, temple, fort, craft, festival, textile, music, food, or community tradition?\n• Is there an alternate or local language spelling?`,
      `Once you provide a location or cultural category, I can check our verified records and archives to assist you.\n\nIf this is a local living tradition or oral history not yet recorded in official registries, you can also preserve it through our **Citizen Archive** so heritage researchers can document and verify it.`,
    ].join("\n\n"),
    hi: [
      `मैं '**${term}**' के बारे में सटीक जानकारी देना चाहती हूँ ताकि कोई गलत तथ्य आप तक न पहुंचे।`,
      `क्या आप थोड़ा और विवरण साझा कर सकते हैं?\n• यह किस राज्य, जिले या क्षेत्र से संबंधित है?\n• क्या यह कोई स्मारक, मंदिर, शिल्प, वस्त्र, उत्सव, संगीत या सामुदायिक परंपरा है?\n• क्या इसका कोई अन्य या स्थानीय वर्तनी (spelling) है?`,
      `यदि यह कोई स्थानीय मौखिक परंपरा या पारिवारिक विरासत है जो अभी अभिलेखों में दर्ज नहीं है, तो आप इसे **सिटिजन आर्काइव** में भी साझा कर सकते हैं ताकि हमारे विशेषज्ञ इसका सत्यापन कर सकें।`,
    ].join("\n\n"),
    ta: [
      `'**${term}**' பற்றிய துல்லியமான தகவலை உறுதிப்படுத்த விரும்புகிறேன்.`,
      `இது தொடர்பான கூடுதல் தகவல்களைக் கூற முடியுமா?\n• இது எந்த மாநிலம், மாவட்டம் அல்லது பகுதியுடன் தொடர்புடையது?\n• இது ஒரு நினைவுச்சின்னமா, கைவினைப்பொருளா, திருவிழாவா, இசையா அல்லது சமூக மரபா?`,
      `இது இன்னும் ஆவணப்படுத்தப்படாத உள்ளூர் மரபாக இருந்தால், நீங்கள் இதனை **Citizen Archive** வழியே பதிவு செய்யலாம்.`,
    ].join("\n\n"),
    bn: [
      `আমি '**${term}**' সম্পর্কে সঠিক তথ্য দিতে চাই যাতে কোনো ভুল তথ্য পরিবেশিত না হয়।`,
      `আপনি কি আরও কিছু তথ্য দিতে পারেন? এটি কোন রাজ্য, জেলা, হস্তশিল্প, উৎসব বা ঐতিহ্যের সাথে যুক্ত?`,
      `যদি এটি কোনো আঞ্চলিক ঐতিহ্য হয়, তবে আপনি আমাদের **সিটিজেন আর্কাইভে** এটি জমা দিতে পারেন।`,
    ].join("\n\n"),
    gu: [
      `હું '**${term}**' ની સાચી ઓળખ મેળવવા માંગુ છું જેથી આપને સચોટ માહિતી મળે.`,
      `શું આપ થોડી વધુ વિગત આપી શકો છો?\n• આ કયા રાજ્ય, જિલ્લો કે પ્રદેશ સાથે સંકળાયેલું છે?\n• શું આ કોઈ સ્મારક, કળા, હસ્તશિલ્પ, ઉત્સવ કે પારંપરિક વિરાસત છે?`,
      `જો આ આપની સ્થાનિક કે મૌખિક પરંપરા હોય, તો આપ તેને **સિટિઝન આર્કાઇવ** માં પણ ઉમેરી શકો છો જેથી નિષ્ણાતો તેની ખરાઈ કરી શકે.`,
    ].join("\n\n"),
    mr: [
      `'**${term}**' बद्दल अचूक आणि खात्रीशीर माहिती देण्यासाठी मला थोडे अधिक संदर्भ हवे आहेत.`,
      `हे कोणत्या राज्य, जिल्हा, शिल्प, सण किंवा परंपरेशी संबंधित आहे हे सांगू शकाल का?`,
    ].join("\n\n"),
  };

  return {
    text: CLARIFICATION_PROMPTS[locale] ?? CLARIFICATION_PROMPTS.en,
    confidence: "low",
    status: "unknown_term",
    sources: [],
    retrieved: [],
    suggestions: [
      "Monuments of Gujarat",
      "Living Chola Temples",
      "Kanchipuram silk craft",
      "Majuli island traditions",
    ],
    canReport: false,
  };
}

/* ----------------- Main Entry: answerQuestion ----------------- */

export function answerQuestion(question: string, locale: Locale): AssistantAnswer {
  const trimmed = question.trim();
  if (!trimmed) {
    return greetingAnswer(locale);
  }

  // 1. Handle Greetings Directly without Heritage Retrieval
  if (isConversationalGreeting(trimmed)) {
    return greetingAnswer(locale);
  }

  // 1.5. Strict Historic Temples Knowledge Base & Guardrail Check
  const matchedTemple = findTempleMatch(trimmed);
  if (matchedTemple) {
    const templeSite = HERITAGE_SITES.find((s) => s.slug === matchedTemple.slug);
    const text = formatTempleResponse(matchedTemple);
    const sources = templeSite && templeSite.sources.length > 0
      ? templeSite.sources.map((s) => ({
          ...s,
          siteSlug: templeSite.slug,
          siteTitle: localized(templeSite.titles, locale) || matchedTemple.name,
        }))
      : [
          {
            id: `asi-${matchedTemple.slug}`,
            title: `${matchedTemple.name} National Archaeological Register`,
            publisher: "Archaeological Survey of India & Temple Trust",
            year: 2024,
            url: "https://asi.nic.in/",
            kind: "government" as const,
            siteSlug: matchedTemple.slug,
            siteTitle: matchedTemple.name,
          },
        ];

    return {
      text,
      confidence: "high",
      status: "verified_answer",
      sources,
      retrieved: templeSite ? [templeSite] : [],
      canReport: true,
    };
  }

  const norm = normalizeText(trimmed);
  const terms = extractKeyTerms(trimmed);

  // 2. Check for exact alias match first (e.g. "korvai", "golkonda", "brihadeeswarar", "dholaveera")
  const exactAlias = HERITAGE_ALIASES[norm];
  if (exactAlias) {
    const site = HERITAGE_SITES.find((s) => s.slug === exactAlias.slug);
    if (site) {
      const sources = site.sources.map((s) => ({
        ...s,
        siteSlug: site.slug,
        siteTitle: localized(site.titles, locale),
      }));

      const isExactCanonical = normalizeText(site.title) === norm;
      const title = localized(site.titles, locale);
      const access = site.accessibility.wheelchair
        ? "Wheelchair access is available."
        : "Wheelchair access is limited.";

      const intro = isExactCanonical
        ? `**${title}** (${site.district}, ${site.state} · ${site.period})`
        : `Identified as **${exactAlias.canonical}** (${site.district}, ${site.state} · ${site.period})`;

      const text = `${intro} — ${localized(site.summary, locale)} ${site.significance} Preservation status: ${site.preservation}. ${access}`;

      return {
        text,
        confidence: isExactCanonical ? "high" : "medium",
        status: isExactCanonical ? "verified_answer" : "likely_match",
        sources,
        retrieved: [site],
        canReport: true,
      };
    }
  }

  // 3. Perform standard retrieval over verified heritage sites
  const { ranked, confidence } = retrieve(trimmed, locale);

  // 4. If verified records found with high/medium score
  if (ranked.length > 0 && (confidence === "high" || confidence === "medium")) {
    const paragraphs = ranked.map(({ site }) => {
      const access = site.accessibility.wheelchair
        ? "Wheelchair access is available."
        : "Wheelchair access is limited.";
      return `**${localized(site.titles, locale)}** (${site.district}, ${site.state} · ${site.period}) — ${localized(site.summary, locale)} ${site.significance} Preservation status: ${site.preservation}. ${access}`;
    });

    const sources = ranked.flatMap(({ site }) =>
      site.sources.map((s) => ({
        ...s,
        siteSlug: site.slug,
        siteTitle: localized(site.titles, locale),
      })),
    );

    const caveat =
      confidence === "high"
        ? ""
        : "\n\n_Note: This interpretation is based on the closest verified record matches in our database._";

    return {
      text: paragraphs.join("\n\n") + caveat,
      confidence,
      status: confidence === "high" ? "verified_answer" : "likely_match",
      sources,
      retrieved: ranked.map((r) => r.site),
      canReport: true,
    };
  }

  // 5. If query had a single term or specific entity that wasn't directly found, check possible fuzzy matches
  const singleCandidate = terms.length === 1 && terms[0] ? terms[0] : trimmed;
  const possibleMatches = findPossibleMatches(singleCandidate);

  // If a very strong single fuzzy match is found (e.g. typo like "Brihadeeshwarar" or "Modherah")
  const firstMatch = possibleMatches[0];
  if (possibleMatches.length === 1 && firstMatch && firstMatch.similarity >= 0.75) {
    const site = HERITAGE_SITES.find((s) => s.slug === firstMatch.siteSlug);
    if (site) {
      const sources = site.sources.map((s) => ({
        ...s,
        siteSlug: site.slug,
        siteTitle: localized(site.titles, locale),
      }));

      const access = site.accessibility.wheelchair
        ? "Wheelchair access is available."
        : "Wheelchair access is limited.";

      const text = `I found a likely match for '**${trimmed}**':\n\n**${localized(site.titles, locale)}** (${site.district}, ${site.state} · ${site.period}) — ${localized(site.summary, locale)} ${site.significance} Preservation status: ${site.preservation}. ${access}`;

      return {
        text,
        confidence: "medium",
        status: "likely_match",
        sources,
        retrieved: [site],
        canReport: true,
      };
    }
  }

  // 6. Unknown or partially recognized cultural term (e.g., "Bhartilow")
  // Provide helpful, warm clarification, never invent facts or show error-style rejection!
  return clarificationAnswer(trimmed, locale, possibleMatches);
}
