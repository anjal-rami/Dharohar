export interface PerformingArtDossier {
  id: string;
  slug: string;
  title: string;
  nativeTitle: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  category: "Classical Dance" | "Folk Dance" | "Temple Theatre" | "Folk Ballad" | "Martial Art";
  unescoStatus?: "UNESCO Intangible Cultural Heritage of Humanity" | "Sangeet Natak Akademi Recognized Classical Form" | "National Heritage Form" | undefined;
  heroImage: string;
  historicalOrigin: {
    period: string;
    lineageText: string;
    traditionOrGharana: string;
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
  nativeName: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  heritageClassification: "GI Tag Certified" | "Centuries-Old Royal Heritage" | "Traditional Community Feast" | "Sacred Temple Prasad";
  heroImage: string;
  historicalGenesis: {
    period: string;
    lineageText: string;
    culturalContext: string;
  };
  keyIngredients: string[];
  traditionalPreparationMethod: {
    stage: string;
    description: string;
  }[];
  nutritionalAndAyurvedicWisdom: string;
  culturalServingTradition: string;
}
