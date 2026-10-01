export interface CraftDossier {
  id: string;
  slug: string;
  craftName: string;
  nativeName: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast" | string;
  category: "Textile & Handloom" | "Pottery & Ceramics" | "Metal Craft & Casting" | "Folk Painting" | "Woodcraft & Lacquerware" | string;
  giStatus?: "GI Tag Certified (Geographical Indication)" | "UNESCO Intangible Heritage Recognized" | "National Master Craft Heritage" | string;
  giTag?: string;
  heroImage: string; // e.g. /images/crafts/patola_gujarat.jpg
  historicalLineage?: {
    originCentury: string;
    royalPatronageOrGenesis: string;
    clusterLocation: string; // e.g. "Patan", "Raghurajpur", "Charida"
  };
  rawMaterials?: string[];
  artisanalTechnique?: {
    stage: string;
    description: string;
  }[];
  sustainabilityAndEcosystem?: string; // Natural dyes, zero-carbon footprint, weaver cooperatives
  preservationStatus?: "Thriving" | "Vulnerable" | "Endangered Technique Requiring GI Enforcement" | string;
  title?: string;
  imageUrl?: string;
  shortDescription?: string;
  fullDescription?: string;
  tags?: string[];
}
