export interface FestivalRitualStep {
  day: string;
  title: string;
  description: string;
}

export interface FestivalDossier {
  id: string;
  slug: string;
  name: string;
  nativeName: string; // e.g. "ગરબા", "দুর্গাপূজা", "छठ पूजा"
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  monthHindi: string; // e.g., "Ashwin (Sept–Oct)", "Kartik"
  significance: string;
  unescoStatus?: "UNESCO Intangible Cultural Heritage of Humanity" | "National Cultural Asset";
  heroImage: string; // Local path e.g. /images/culture/festival_garba_gujarat.jpg
  historicalOrigin: {
    period: string; // e.g. "Vedic era / 10th century CE"
    lineage: string; // Mythological / folklore narrative
    deityOrTheme: string;
  };
  rituals: FestivalRitualStep[];
  culinaryOfferings: {
    dishName: string;
    description: string;
  }[];
  artisanalEcosystem: string; // Economic link: idol makers, potters, bandhani dyers
  folkInstruments: string[]; // e.g. ["Dhol", "Manjira", "Dhak"]
}
