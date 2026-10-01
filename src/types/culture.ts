export interface PerformingArtDossier {
  id: string;
  slug: string;
  title: string;
  name?: string;
  nativeTitle: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast" | string;
  category: "Classical Dance" | "Folk Dance" | "Temple Theatre" | "Folk Ballad" | "Martial Art" | string;
  unescoStatus?: "UNESCO Intangible Cultural Heritage of Humanity" | "Sangeet Natak Akademi Recognized Classical Form" | "National Heritage Form" | string | undefined;
  heroImage: string;
  imageUrl?: string;
  shortDescription?: string;
  historicalOrigin: {
    period: string;
    lineageText: string;
    traditionOrGharana?: string;
  };
  signatureElements: {
    title: string;
    description: string;
  }[];
  costumeAndAttire: string;
  musicalAccompaniment: string[];
  socioEconomicImpact: string;
}

export interface CulinaryDossier {
  id: string;
  slug: string;
  dishName: string;
  title?: string;
  name?: string;
  category?: string;
  nativeName?: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast" | string;
  heritageClassification: "GI Tag Certified" | "Centuries-Old Royal Heritage" | "Traditional Community Feast" | "Sacred Temple Prasad" | string;
  heroImage: string;
  imageUrl?: string;
  tags?: string[];
  shortDescription?: string;
  fullDescription?: string;
  cookingTechnique?: string;
  historicalGenesis: {
    period: string;
    lineageText: string;
    culturalContext?: string;
  };
  keyIngredients: string[];
  traditionalPreparationMethod: {
    stage: string;
    description: string;
  }[];
  nutritionalAndAyurvedicWisdom?: string;
  culturalServingTradition?: string;
}

export type { CraftDossier } from "./craft";
