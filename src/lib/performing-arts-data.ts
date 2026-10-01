import type { PerformingArtDossier } from "@/types/culture";
import type { HeritageSite } from "@/lib/heritage-data";
import performingArtsSeed from "@/data/performing_arts_seed.json";

export const PERFORMING_ARTS_DOSSIERS: PerformingArtDossier[] = performingArtsSeed as unknown as PerformingArtDossier[];

const STATE_COORDINATES: Record<string, [number, number]> = {
  Kerala: [10.5276, 76.2144],
  "Tamil Nadu": [13.0827, 80.2707],
  Gujarat: [23.0225, 72.5714],
  Rajasthan: [26.9124, 75.7873],
  Assam: [26.9538, 94.2037],
  "West Bengal": [23.6823, 87.6749],
  Odisha: [20.2961, 85.8245],
  Karnataka: [13.3409, 74.7421],
  Manipur: [24.817, 93.9368],
  Punjab: [31.634, 74.8723],
  Chhattisgarh: [21.2787, 81.8661],
  "Uttar Pradesh": [26.8467, 80.9462],
  Jharkhand: [23.3441, 85.3096],
};

export function performingArtDossierToHeritageSite(art: PerformingArtDossier): HeritageSite {
  const coords = STATE_COORDINATES[art.state] || [20.5937, 78.9629];
  const title = art.title || art.name || "Performing Art Tradition";
  const img = art.imageUrl || art.heroImage || "/images/performing_arts/kathakali.jpg";

  return {
    id: art.id,
    slug: art.slug,
    title,
    name: title,
    titles: {
      en: title,
      hi: art.nativeTitle || title,
    },
    summary: {
      en: art.shortDescription || "",
      hi: art.shortDescription || "",
    },
    description: {
      en: art.historicalOrigin?.lineageText || art.shortDescription || "",
      hi: art.historicalOrigin?.lineageText || art.shortDescription || "",
    },
    state: art.state,
    district: `${art.state} Performing Stage`,
    region: art.region,
    regionId: art.region ? `reg-${art.region.toLowerCase()}` : "reg-south",
    lat: coords[0],
    lng: coords[1],
    category: "performing-arts",
    type: "performing-arts",
    period: art.historicalOrigin?.period || "Living Traditional Art",
    era: "living",
    kind: "intangible",
    significance: art.shortDescription || art.unescoStatus || "Classical Performing Art Tradition",
    unesco: Boolean(art.unescoStatus && art.unescoStatus.includes("UNESCO")),
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Auditoriums, temple koothambalams and open stage grounds are accessible.",
    },
    languages: ["en", "hi"],
    tags: [
      "Performing Arts",
      art.category || "Classical Dance",
      art.state,
      ...(art.musicalAccompaniment || []),
    ],
    image: img,
    gallery: [img],
    images: [img],
    tourAvailable: false,
    preservation: "safe",
    preservationNote: art.unescoStatus || "Living Performing Arts Heritage",
    sources: [],
    stories: [],
    artisans: [],
    relatedTraditions: [],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  };
}

export const PERFORMING_ARTS_HERITAGE_SITES: HeritageSite[] = PERFORMING_ARTS_DOSSIERS.map(performingArtDossierToHeritageSite);

export function getPerformingArtDossier(slug: string): PerformingArtDossier | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return PERFORMING_ARTS_DOSSIERS.find(
    (art) =>
      art.slug.toLowerCase() === normalized ||
      art.id.toLowerCase() === normalized ||
      art.slug.toLowerCase().includes(normalized) ||
      normalized.includes(art.slug.toLowerCase()) ||
      (normalized.includes("kathakali") && art.slug.includes("kathakali")) ||
      (normalized.includes("sattriya") && art.slug.includes("sattriya"))
  );
}
