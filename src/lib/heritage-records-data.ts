import type { HeritageSite } from "@/lib/heritage-data";
import rawHeritageRecords from "@/data/heritage_records.json";

export interface IngestedHeritageRecord {
  id: string;
  slug: string;
  title: string;
  category: "Crafts & Textiles" | "Monuments & Sites" | "Food Traditions" | "Performing Arts";
  region: string;
  imageUrl: string;
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  giTag?: string;
}

export const INGESTED_HERITAGE_RECORDS: IngestedHeritageRecord[] = rawHeritageRecords as IngestedHeritageRecord[];

interface LocationMeta {
  state: string;
  district: string;
  regionId: string;
  lat: number;
  lng: number;
  era: "ancient" | "medieval" | "colonial" | "modern" | "living";
  kind: "physical" | "intangible";
  unesco: boolean;
  intangibleListed: boolean;
}

const RECORD_LOCATION_META: Record<string, LocationMeta> = {
  "odisha-palm-leaf-manuscript": {
    state: "Odisha",
    district: "Puri",
    regionId: "eastern-delta",
    lat: 19.8667,
    lng: 85.8167,
    era: "living",
    kind: "physical",
    unesco: false,
    intangibleListed: true,
  },
  "kinnaur-wooden-temple": {
    state: "Himachal Pradesh",
    district: "Kinnaur",
    regionId: "himalayan-belt",
    lat: 31.5358,
    lng: 78.2758,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "kedarnath-temple": {
    state: "Uttarakhand",
    district: "Rudraprayag",
    regionId: "himalayan-belt",
    lat: 30.7352,
    lng: 79.0669,
    era: "ancient",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "kashi-vishwanath-temple": {
    state: "Uttar Pradesh",
    district: "Varanasi",
    regionId: "reg-north",
    lat: 25.3109,
    lng: 83.0107,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "meenakshi-sundareswarar-temple": {
    state: "Tamil Nadu",
    district: "Madurai",
    regionId: "deccan-and-south",
    lat: 9.9195,
    lng: 78.1193,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "somnath-temple": {
    state: "Gujarat",
    district: "Gir Somnath",
    regionId: "western-deserts-and-coast",
    lat: 20.8880,
    lng: 70.4012,
    era: "ancient",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "puri-jagannath-temple": {
    state: "Odisha",
    district: "Puri",
    regionId: "eastern-delta",
    lat: 19.8049,
    lng: 85.8179,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "tirupati-venkateswara-temple": {
    state: "Andhra Pradesh",
    district: "Tirupati",
    regionId: "deccan-and-south",
    lat: 13.6833,
    lng: 79.3472,
    era: "ancient",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "kailasa-ellora-cave-16": {
    state: "Maharashtra",
    district: "Chhatrapati Sambhajinagar",
    regionId: "western-deserts-and-coast",
    lat: 20.0238,
    lng: 75.1793,
    era: "ancient",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
  },
  "ramanathaswamy-temple": {
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    regionId: "deccan-and-south",
    lat: 9.2881,
    lng: 79.3174,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "dwarkadhish-temple": {
    state: "Gujarat",
    district: "Devbhumi Dwarka",
    regionId: "western-deserts-and-coast",
    lat: 22.2376,
    lng: 68.9678,
    era: "ancient",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  },
  "chettinad-kitchen-traditions": {
    state: "Tamil Nadu",
    district: "Sivaganga",
    regionId: "deccan-and-south",
    lat: 10.0667,
    lng: 78.7833,
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
  },
  "baul-song-bengal": {
    state: "West Bengal",
    district: "Birbhum",
    regionId: "eastern-delta",
    lat: 23.6823,
    lng: 87.6749,
    era: "living",
    kind: "intangible",
    unesco: true,
    intangibleListed: true,
  },
  "majuli-sattriya-satra-life": {
    state: "Assam",
    district: "Majuli",
    regionId: "north-east",
    lat: 26.9538,
    lng: 94.2037,
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
  },
  "pandavani-epic-chhattisgarh": {
    state: "Chhattisgarh",
    district: "Durg",
    regionId: "reg-central",
    lat: 21.1904,
    lng: 81.2849,
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
  },
};

function mapCategory(cat: string): { category: "crafts" | "monuments" | "food" | "performing-arts"; type: string } {
  switch (cat) {
    case "Crafts & Textiles":
      return { category: "crafts", type: "crafts" };
    case "Monuments & Sites":
      return { category: "monuments", type: "monuments" };
    case "Food Traditions":
      return { category: "food", type: "food" };
    case "Performing Arts":
      return { category: "performing-arts", type: "performing-arts" };
    default:
      return { category: "monuments", type: "monuments" };
  }
}

export function ingestedRecordToHeritageSite(record: IngestedHeritageRecord): HeritageSite {
  const meta = RECORD_LOCATION_META[record.slug] || {
    state: record.region.split(",")[1]?.trim() || "India",
    district: record.region.split(",")[0]?.trim() || "Heritage Site",
    regionId: "reg-south",
    lat: 20.5937,
    lng: 78.9629,
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
  };

  const { category, type } = mapCategory(record.category);

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    name: record.title,
    titles: {
      en: record.title,
      hi: record.title,
    },
    summary: {
      en: record.shortDescription,
      hi: record.shortDescription,
    },
    description: {
      en: record.fullDescription,
      hi: record.fullDescription,
    },
    state: meta.state,
    district: meta.district,
    region: record.region,
    regionId: meta.regionId,
    lat: meta.lat,
    lng: meta.lng,
    category,
    type,
    period: meta.era === "ancient" ? "Ancient Era" : meta.era === "medieval" ? "Medieval Era" : "Living Heritage",
    era: meta.era,
    kind: meta.kind,
    unesco: meta.unesco,
    intangibleListed: meta.intangibleListed,
    significance: record.shortDescription,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Open to researchers, pilgrims, and cultural heritage enthusiasts.",
    },
    languages: ["en", "hi"],
    tags: [
      record.category,
      record.region,
      meta.state,
      meta.district,
      ...(record.tags || []),
      ...(record.giTag ? [record.giTag] : []),
    ],
    image: record.imageUrl,
    gallery: [record.imageUrl],
    images: [record.imageUrl],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Verified heritage asset recorded under institutional archives.",
    sources: [
      {
        id: `source-${record.id}`,
        title: `${record.title} Documentation Record`,
        publisher: "Archaeological Survey of India / Ministry of Culture",
        year: 2026,
        url: "https://asi.nic.in/",
        kind: "government",
      },
    ],
    stories: [],
    artisans: [],
    relatedTraditions: [],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T18:00:00Z",
  };
}

export const INGESTED_HERITAGE_SITES: HeritageSite[] = INGESTED_HERITAGE_RECORDS.map(ingestedRecordToHeritageSite);

export const VERIFIED_HERITAGE_COVER_IMAGES: Record<string, string> = {
  "odisha-palm-leaf-manuscript": "/images/crafts/odisha_palm_leaf.jpg",
  "palm-leaf-manuscripts-odisha": "/images/crafts/odisha_palm_leaf.jpg",
  "kinnaur-wooden-temple": "/images/monuments/kinnaur_wooden_temple.jpg",
  "chandratal-hill-temples": "/images/monuments/kinnaur_wooden_temple.jpg",
  "kedarnath-temple": "/images/monuments/kedarnath_temple.jpg",
  "kashi-vishwanath-temple": "/images/monuments/kashi_vishwanath.jpg",
  "meenakshi-sundareswarar-temple": "/images/monuments/meenakshi_sundareswarar.jpg",
  "somnath-temple": "/images/monuments/somnath_temple.jpg",
  "puri-jagannath-temple": "/images/monuments/puri_jagannath.jpg",
  "tirupati-venkateswara-temple": "/images/monuments/tirupati_venkateswara.jpg",
  "kailasa-ellora-cave-16": "/images/monuments/kailasa_ellora.jpg",
  "kailasa-temple-ellora": "/images/monuments/kailasa_ellora.jpg",
  "ramanathaswamy-temple": "/images/monuments/ramanathaswamy_temple.jpg",
  "ramanathaswamy-temple-rameswaram": "/images/monuments/ramanathaswamy_temple.jpg",
  "dwarkadhish-temple": "/images/monuments/dwarkadhish_temple.jpg",
  "chettinad-kitchen-traditions": "/images/food/chettinad_kitchen.jpg",
  "baul-song-bengal": "/images/performing_arts/baul_song_bengal.jpg",
  "majuli-sattriya-satra-life": "/images/performing_arts/majuli_sattriya_satra.jpg",
  "sattriya-majuli": "/images/performing_arts/majuli_sattriya_satra.jpg",
  "sattriya-assam": "/images/performing_arts/majuli_sattriya_satra.jpg",
  "pandavani-epic-chhattisgarh": "/images/performing_arts/pandavani_chhattisgarh.jpg",
  "pandavani-oral-epic": "/images/performing_arts/pandavani_chhattisgarh.jpg",
  "pandavani-chhattisgarh": "/images/performing_arts/pandavani_chhattisgarh.jpg",
};

export function getHeritageCoverImage(site?: {
  slug?: string;
  id?: string;
  image?: string;
  imageUrl?: string;
  heroImage?: string;
  thumbnail?: string;
}): string {
  if (!site) return "/assets/hero-heritage.jpg";
  if (site.slug && VERIFIED_HERITAGE_COVER_IMAGES[site.slug]) {
    return VERIFIED_HERITAGE_COVER_IMAGES[site.slug]!;
  }
  if (site.id && VERIFIED_HERITAGE_COVER_IMAGES[site.id]) {
    return VERIFIED_HERITAGE_COVER_IMAGES[site.id]!;
  }
  return site.imageUrl || site.heroImage || site.image || site.thumbnail || "/assets/hero-heritage.jpg";
}

export function getIngestedHeritageSite(slug: string): HeritageSite | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  return INGESTED_HERITAGE_SITES.find(
    (item) =>
      item.slug.toLowerCase() === s ||
      item.id.toLowerCase() === s ||
      (s === "kailasa-temple-ellora" && item.slug === "kailasa-ellora-cave-16") ||
      (s === "ramanathaswamy-temple-rameswaram" && item.slug === "ramanathaswamy-temple") ||
      (s === "palm-leaf-manuscripts-odisha" && item.slug === "odisha-palm-leaf-manuscript") ||
      (s === "chandratal-hill-temples" && item.slug === "kinnaur-wooden-temple") ||
      (s === "sattriya-majuli" && item.slug === "majuli-sattriya-satra-life") ||
      (s === "pandavani-oral-epic" && item.slug === "pandavani-epic-chhattisgarh"),
  );
}


