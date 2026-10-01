import type { CulinaryDossier } from "@/types/culture";
import type { HeritageSite } from "@/lib/heritage-data";
import culinarySeed from "@/data/culinary_seed.json";

export const CULINARY_DOSSIERS: CulinaryDossier[] = culinarySeed as unknown as CulinaryDossier[];

const STATE_COORDINATES: Record<string, [number, number]> = {
  Kerala: [8.5241, 76.9366],
  Telangana: [17.385, 78.4867],
  Gujarat: [23.0225, 72.5714],
  Rajasthan: [26.9124, 75.7873],
  Bihar: [25.5941, 85.1376],
  "West Bengal": [22.5726, 88.3639],
  Punjab: [31.634, 74.8723],
  "Tamil Nadu": [13.0827, 80.2707],
  Goa: [15.2993, 74.124],
  Maharashtra: [19.076, 72.8777],
  Assam: [26.1445, 91.7362],
  "Jammu and Kashmir": [34.0837, 74.7973],
};

export function culinaryDossierToHeritageSite(dish: CulinaryDossier): HeritageSite {
  const coords = STATE_COORDINATES[dish.state] || [20.5937, 78.9629];
  const title = dish.title || dish.name || dish.dishName || "Food Tradition";
  const img = dish.imageUrl || dish.heroImage || "/images/culinary/sadya_feast.jpg";

  return {
    id: dish.id,
    slug: dish.slug,
    title,
    name: title,
    titles: {
      en: title,
      hi: dish.nativeName || title,
    },
    summary: {
      en: dish.shortDescription || dish.fullDescription || "",
      hi: dish.shortDescription || dish.fullDescription || "",
    },
    description: {
      en: dish.fullDescription || dish.shortDescription || "",
      hi: dish.fullDescription || dish.shortDescription || "",
    },
    state: dish.state,
    district: `${dish.state} Culinary Hearth`,
    region: dish.region,
    regionId: dish.region ? `reg-${dish.region.toLowerCase()}` : "reg-south",
    lat: coords[0],
    lng: coords[1],
    category: "food",
    type: "food",
    period: dish.historicalGenesis?.period || "Living Food Tradition",
    era: "living",
    kind: "intangible",
    significance: dish.shortDescription || dish.heritageClassification || "Living Food Tradition",
    unesco: false,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Traditional culinary spaces and dining halls are publicly accessible.",
    },
    languages: ["en", "hi"],
    tags: [
      dish.category || "Food Traditions",
      "Food Traditions",
      "Culinary Traditions",
      dish.state,
      ...(dish.tags || []),
    ],
    image: img,
    gallery: [img],
    images: [img],
    tourAvailable: false,
    preservation: "safe",
    preservationNote: dish.heritageClassification || "Living Culinary Cultural Heritage",
    sources: [],
    stories: [],
    artisans: [],
    relatedTraditions: [],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  };
}

export const CULINARY_HERITAGE_SITES: HeritageSite[] = CULINARY_DOSSIERS.map(culinaryDossierToHeritageSite);

export function getCulinaryDossier(slug: string): CulinaryDossier | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return CULINARY_DOSSIERS.find(
    (dish) =>
      dish.slug.toLowerCase() === normalized ||
      dish.id.toLowerCase() === normalized ||
      dish.slug.toLowerCase().includes(normalized) ||
      normalized.includes(dish.slug.toLowerCase()) ||
      (normalized.includes("sadya") && dish.slug.includes("sadya")) ||
      (normalized.includes("biryani") && dish.slug.includes("biryani"))
  );
}
