import rawCategoriesSeed from "../data/categories_seed.json";

export type CategoryKey = "festivals" | "performing_arts" | "culinary" | "crafts";

export type RegionKey = "North" | "South" | "East" | "West" | "Central" | "Northeast";

export type HeritageStatusType =
  | "UNESCO Intangible Cultural Heritage"
  | "Classical Tradition"
  | "Folk Theatre"
  | "Folk Tradition"
  | "National Heritage"
  | "Geographical Indication (GI)"
  | string;

export interface CulturalCategoryItem {
  id: string;
  slug?: string;
  title: string;
  category: CategoryKey;
  state: string;
  region?: RegionKey;
  shortDescription: string;
  heritageStatus?: HeritageStatusType;
  imageUrl: string;
  cookingTechnique?: string;
  culturalSignificance?: string;
  tags?: string[];
  fullDescription?: string;
}

export const CULTURAL_CATEGORY_ITEMS: CulturalCategoryItem[] = rawCategoriesSeed as CulturalCategoryItem[];

export const CATEGORY_TAB_CONFIG: Record<
  CategoryKey,
  { label: string; icon: string; description: string }
> = {
  festivals: {
    label: "Festivals",
    icon: "🪔",
    description: "Living seasonal, harvest, and devotional community celebrations across India",
  },
  performing_arts: {
    label: "Performing Arts",
    icon: "🎭",
    description: "Classical and folk dances, theatrical epics, and ancestral musical lineages",
  },
  culinary: {
    label: "Food Traditions",
    icon: "🍲",
    description: "Centuries-old regional gastronomies, royal banquets, and sacred thalis",
  },
  crafts: {
    label: "Crafts & Handlooms",
    icon: "🧵",
    description: "Master artisan weaves, double-ikats, pottery, and natural-pigment scrollwork",
  },
};

export function getItemsByCategory(category: CategoryKey): CulturalCategoryItem[] {
  return CULTURAL_CATEGORY_ITEMS.filter((item) => item.category === category);
}

export function getItemsByRegion(region: RegionKey): CulturalCategoryItem[] {
  return CULTURAL_CATEGORY_ITEMS.filter((item) => item.region === region);
}

export function getCategoryCounts(): Record<CategoryKey, number> {
  const counts: Record<CategoryKey, number> = {
    festivals: 0,
    performing_arts: 0,
    culinary: 0,
    crafts: 0,
  };
  CULTURAL_CATEGORY_ITEMS.forEach((item) => {
    if (item.category in counts) {
      counts[item.category] += 1;
    }
  });
  return counts;
}

export const CATEGORY_OPTIONS = [
  { id: "all", label: "All Categories", icon: "✨", matchCategory: "All" },
  { id: "monuments", label: "Monuments & Sites", icon: "🏛️", matchCategory: "Monuments" },
  { id: "crafts", label: "Crafts & Textiles", icon: "🧵", matchCategory: "Crafts & Textiles" },
  { id: "festivals", label: "Festivals & Rituals", icon: "🪔", matchCategory: "Festivals & Rituals" },
  { id: "performing-arts", label: "Performing Arts", icon: "🎭", matchCategory: "Performing Arts" },
  {
    id: "food-traditions",
    label: "Food Traditions",
    icon: "🍲",
    matchCategory: ["Food Traditions", "Culinary Traditions", "Culinary", "food"],
  },
] as const;

