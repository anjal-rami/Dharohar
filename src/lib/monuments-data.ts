import monumentsJson from "@/data/monuments.json";
import {
  HISTORIC_TEMPLES,
  type TempleEntry,
  type HowToReach,
  type LocationDetails,
} from "@/lib/chatbot-guardrails";
import type { HeritageSite } from "@/lib/heritage-data";

export { HISTORIC_TEMPLES, type TempleEntry, type HowToReach, type LocationDetails };

export interface VisitorDetails {
  timings: string;
  entryFee: string;
  bestSeason: string;
  photographyFee?: string;
}

export interface MonumentDossier {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  architecturalStyle: string;
  constructionEra: string;
  patronDynasty: string;
  preservationScore: string;
  unesco: boolean;
  unescoYear?: number;
  visitorDetails: VisitorDetails;
  audioNarrationScript: string;
  audioDurationSeconds: number;
  heroImage: string;
  thumbnail: string;
  highlights: string[];
  // Temple-specific additions
  deity?: string;
  consecrationEra?: string;
  patronMaker?: string;
  history?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  locationDetails?: LocationDetails;
  howToReach?: HowToReach;
  ticketAndTimings?: string;
  category?: "monuments" | "temple";
  preservationState?: "Safe" | "Active Place of Worship";
}

export const MONUMENT_DOSSIERS: MonumentDossier[] = monumentsJson as unknown as MonumentDossier[];

/**
 * Retrieves a detailed monument or temple dossier by slug or name alias.
 */
export function getMonumentDossier(slugOrName?: string): MonumentDossier | undefined {
  if (!slugOrName) return undefined;
  const s = slugOrName.toLowerCase().trim();

  // 1. Direct match on central JSON dossier
  const matched = MONUMENT_DOSSIERS.find(
    (m) =>
      m.slug.toLowerCase() === s ||
      s.includes(m.slug.toLowerCase()) ||
      m.slug.toLowerCase().includes(s) ||
      m.name.toLowerCase() === s ||
      m.name.toLowerCase().includes(s) ||
      s.includes(m.name.toLowerCase()) ||
      s.includes(m.city.toLowerCase().split(",")[0]?.trim() || ""),
  );
  if (matched) return matched;

  // 2. Fallback check against HISTORIC_TEMPLES knowledge base
  const temple = HISTORIC_TEMPLES.find(
    (t) =>
      t.slug === s ||
      s.includes(t.slug) ||
      t.aliases.some((a) => s.includes(a) || a.includes(s)),
  );
  if (temple) {
    const locState = temple.locationDetails?.state ?? "India";
    const locCity = temple.locationDetails
      ? `${temple.locationDetails.district}, ${temple.locationDetails.nearestCity}`
      : "Sacred Site";

    return {
      id: `temple-${temple.slug}`,
      slug: temple.slug,
      name: temple.name,
      city: locCity,
      state: locState,
      lat: temple.coordinates?.[1] ?? 20.5937,
      lng: temple.coordinates?.[0] ?? 78.9629,
      architecturalStyle: temple.architecturalStyle,
      constructionEra: temple.consecrationEra,
      patronDynasty: temple.patronMaker,
      preservationScore: temple.preservationState === "Safe" ? "96% Safe" : "Active Place of Worship",
      unesco: false,
      visitorDetails: {
        timings: temple.ticketAndTimings.split(".")[0] || "06:00 AM – 09:00 PM",
        entryFee: "Free general entry",
        bestSeason: "October to March",
      },
      audioNarrationScript: temple.history,
      audioDurationSeconds: 25,
      heroImage: temple.heroImage || "/assets/hero-heritage.jpg",
      thumbnail: temple.heroImage || "/assets/hero-heritage.jpg",
      highlights: [
        `Presiding Deity: ${temple.deity}`,
        `Architectural Style: ${temple.architecturalStyle}`,
        `Maker: ${temple.patronMaker}`,
      ],
      deity: temple.deity,
      consecrationEra: temple.consecrationEra,
      patronMaker: temple.patronMaker,
      history: temple.history,
      coordinates: temple.coordinates,
      locationDetails: temple.locationDetails,
      howToReach: temple.howToReach,
      ticketAndTimings: temple.ticketAndTimings,
      category: "temple",
      preservationState: temple.preservationState,
    };
  }

  return undefined;
}

/**
 * Retrieves a monument or temple dossier by slug alias with fallback safe handling.
 */
export function getMonumentBySlug(slug?: string): MonumentDossier | undefined {
  return getMonumentDossier(slug);
}

/**
 * Adapts a MonumentDossier into a complete HeritageSite model for seamless route rendering.
 */
export function monumentDossierToHeritageSite(dossier: MonumentDossier): HeritageSite {
  const heroImg = dossier.heroImage || "/assets/hero-heritage.jpg";
  const thumbImg = dossier.thumbnail || heroImg;
  const gallery = [heroImg, thumbImg];

  const site: HeritageSite = {
    id: dossier.id || `monument-${dossier.slug}`,
    slug: dossier.slug,
    title: dossier.name,
    name: dossier.name,
    titles: {
      en: dossier.name,
      hi: dossier.name,
    },
    summary: {
      en: dossier.audioNarrationScript || `${dossier.name} located in ${dossier.city}, ${dossier.state}.`,
      hi: dossier.audioNarrationScript || `${dossier.name} located in ${dossier.city}, ${dossier.state}.`,
    },
    description: {
      en: dossier.history || dossier.audioNarrationScript || `${dossier.name} is a national monument of India.`,
      hi: dossier.history || dossier.audioNarrationScript || `${dossier.name} is a national monument of India.`,
    },
    state: dossier.state || dossier.locationDetails?.state || "India",
    district: dossier.city || dossier.locationDetails?.district || "",
    regionId: "north",
    lat: dossier.lat ?? dossier.coordinates?.[1] ?? 20.5937,
    lng: dossier.lng ?? dossier.coordinates?.[0] ?? 78.9629,
    category: dossier.category === "temple" ? "temple" : "monuments",
    period: dossier.constructionEra || dossier.consecrationEra || "Historical",
    era: "medieval",
    kind: "physical",
    unesco: Boolean(dossier.unesco),
    intangibleListed: false,
    significance:
      dossier.highlights?.[0] ||
      dossier.architecturalStyle ||
      "Monument of National Cultural Importance",
    accessibility: {
      wheelchair: true,
      audioGuide: Boolean(dossier.audioNarrationScript),
      signLanguage: false,
      notes: "ASI & Cultural Trust protected heritage complex.",
    },
    languages: ["en", "hi"],
    tags: [
      "monument",
      "heritage",
      dossier.category || "monuments",
      ...(dossier.highlights || []),
    ].filter(Boolean),
    image: heroImg,
    gallery,
    images: gallery,
    tourAvailable: true,
    preservation: "safe",
    preservationScore: dossier.preservationScore || "94% Intact",
    preservationNote: `Conserved by official heritage cell. Preservation score: ${dossier.preservationScore || "94% Intact"}.`,
    sources: [],
    stories: [],
    artisans: [],
    relatedTraditions: dossier.highlights || [],
    dataOrigin: "verified",
    updatedAt: "2026-09-25",
  };

  if (dossier.architecturalStyle) site.architecturalStyle = dossier.architecturalStyle;
  const cEra = dossier.constructionEra || dossier.consecrationEra;
  if (cEra) site.constructionEra = cEra;
  const pDyn = dossier.patronDynasty || dossier.patronMaker;
  if (pDyn) site.patronDynasty = pDyn;
  if (dossier.visitorDetails) site.visitorDetails = dossier.visitorDetails;
  if (dossier.audioNarrationScript) site.audioNarrationScript = dossier.audioNarrationScript;
  if (dossier.deity) site.deity = dossier.deity;
  if (dossier.consecrationEra) site.consecrationEra = dossier.consecrationEra;
  if (dossier.patronMaker) site.patronMaker = dossier.patronMaker;
  if (dossier.history) site.history = dossier.history;
  if (dossier.coordinates) site.coordinates = dossier.coordinates;
  if (dossier.locationDetails) site.locationDetails = dossier.locationDetails;
  if (dossier.howToReach) site.howToReach = dossier.howToReach;
  if (dossier.ticketAndTimings) site.ticketAndTimings = dossier.ticketAndTimings;
  if (dossier.preservationState) site.preservationState = dossier.preservationState;

  return site;
}

/**
 * Returns all enriched primary monument & temple dossiers.
 */
export function getAllMonumentDossiers(): MonumentDossier[] {
  return MONUMENT_DOSSIERS;
}

/**
 * Returns all 8 historic temples.
 */
export function getAllHistoricTemples(): TempleEntry[] {
  return HISTORIC_TEMPLES;
}

/**
 * Retrieves a temple entry directly by slug.
 */
export function getTempleBySlug(slug: string): TempleEntry | undefined {
  return HISTORIC_TEMPLES.find((t) => t.slug === slug);
}
