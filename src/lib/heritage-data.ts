import heroHeritage from "@/assets/hero-heritage.jpg";
import craftWeaving from "@/assets/craft-weaving.jpg";
import festivalImg from "@/assets/festival.jpg";
import manuscriptImg from "@/assets/manuscript.jpg";
import performanceImg from "@/assets/performance.jpg";
import hillTempleImg from "@/assets/hill-temple.jpg";
import modheraSunTempleImg from "@/assets/modhera-sun-temple.jpg";
import golcondaFortImg from "@/assets/golconda-fort.jpg";
import indusValleyImg from "@/assets/indus-valley.jpg";
import type { Locale } from "@/lib/i18n";
import { getIngestedHeritageSite, INGESTED_HERITAGE_SITES } from "./heritage-records-data";

/**
 * DEMO DATASET — clearly labelled mock records.
 * Production records are source-driven and carry `dataOrigin: "verified"`.
 * These carry `dataOrigin: "demo"` so the UI can badge them everywhere.
 */
export type DataOrigin = "demo" | "verified";

export type PreservationStatus = "safe" | "attention" | "risk" | "restoration";
export type ModerationStatus = "pending" | "approved" | "changes" | "rejected";
export type HeritageKind = "physical" | "intangible";

export type LocalizedText = Partial<Record<Locale, string>>;

export type HeritageCategory =
  | "monuments"
  | "crafts"
  | "festivals"
  | "music"
  | "food"
  | "Food Traditions"
  | "food-traditions"
  | "manuscripts"
  | "oral-history"
  | "performing-arts"
  | "temple";

export const CATEGORY_META: Record<
  HeritageCategory,
  { label: string; icon: string; blurb: string }
> = {
  monuments: { label: "Monuments & Sites", icon: "🏛️", blurb: "Temples, forts, stepwells, caves" },
  crafts: { label: "Crafts & Textiles", icon: "🧵", blurb: "Weaves, metalwork, pottery, painting" },
  festivals: { label: "Festivals & Rituals", icon: "🪔", blurb: "Seasonal, temple and harvest festivals" },
  music: { label: "Music & Ragas", icon: "🎶", blurb: "Classical, folk and devotional traditions" },
  food: { label: "Food Traditions", icon: "🍲", blurb: "Regional cuisines, royal kitchens and ritual feasts" },
  "Food Traditions": { label: "Food Traditions", icon: "🍲", blurb: "Regional cuisines, royal kitchens and ritual feasts" },
  "food-traditions": { label: "Food Traditions", icon: "🍲", blurb: "Regional cuisines, royal kitchens and ritual feasts" },
  manuscripts: { label: "Manuscripts", icon: "📜", blurb: "Palm-leaf, paper and inscriptions" },
  "oral-history": { label: "Oral History", icon: "🗣️", blurb: "Memories, ballads and genealogies" },
  "performing-arts": { label: "Performing Arts", icon: "🎭", blurb: "Dance, theatre and puppetry" },
  temple: { label: "Historic Temples", icon: "🛕", blurb: "Sacred sanctums, jyotirlingas, gopurams" },
};

export type CulturalRegion = {
  id: string;
  slug?: string;
  name: string;
  states: string[];
  tagline?: string;
  blurb?: string;
  imageUrl?: string;
  image?: string;
  accentColor?: string;
  highlights?: string[];
  description?: string;
};

export type VerifiedSource = {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url: string;
  kind: "government" | "academic" | "museum" | "community";
};

export type CommunityStory = {
  id: string;
  author: string;
  role: string;
  locale: Locale;
  text: string;
  moderation: ModerationStatus;
};

export type Artisan = {
  id: string;
  name: string;
  craft: string;
  contactNote: string;
};

export type HeritageSite = {
  id: string;
  slug: string;
  title: string;
  name?: string;
  titles: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  state: string;
  district: string;
  region?: string;
  regionId: string;
  lat: number;
  lng: number;
  category: HeritageCategory;
  type?: string;
  period: string;
  era: "ancient" | "medieval" | "colonial" | "modern" | "living";
  kind: HeritageKind;
  unesco: boolean;
  intangibleListed: boolean;
  significance: string;
  accessibility: {
    wheelchair: boolean;
    audioGuide: boolean;
    signLanguage: boolean;
    notes: string;
  };
  languages: Locale[];
  tags: string[];
  image: string;
  gallery: string[];
  images?: string[];
  tourAvailable: boolean;
  panoramaUrl?: string;
  streetViewEmbedUrl?: string;
  streetViewPanoUrl?: string;
  reelId?: string;
  preservation: PreservationStatus;
  preservationNote: string;
  sources: VerifiedSource[];
  stories: CommunityStory[];
  artisans: Artisan[];
  relatedTraditions: string[];
  dataOrigin: DataOrigin;
  updatedAt: string;
  model3dUrl?: string;
  artifactInfo?: {
    name: string;
    period: string;
    description?: string;
  };
  architecturalStyle?: string;
  constructionEra?: string;
  patronDynasty?: string;
  preservationScore?: string;
  visitorDetails?: {
    timings: string;
    entryFee: string;
    bestSeason: string;
    photographyFee?: string;
  };
  audioNarrationScript?: string;
  deity?: string;
  consecrationEra?: string;
  patronMaker?: string;
  history?: string;
  coordinates?: [number, number];
  locationDetails?: {
    state: string;
    district: string;
    nearestCity: string;
    landmark?: string;
  };
  howToReach?: {
    air: string;
    rail: string;
    road: string;
  };
  ticketAndTimings?: string;
  preservationState?: "Safe" | "Active Place of Worship";
};

export const CULTURAL_REGIONS: CulturalRegion[] = [
  {
    id: "deccan-and-south",
    slug: "deccan-and-south",
    name: "Deccan & South",
    states: ["Tamil Nadu", "Kerala", "Karnataka", "Telangana"],
    tagline: "Dravidian temple towns, bronze casting, Carnatic music and temple theatre.",
    blurb: "Dravidian temple towns, bronze casting, Carnatic music and temple theatre.",
    imageUrl: "/images/regions/deccan_south.jpg",
    image: "/images/regions/deccan_south.jpg",
    accentColor: "from-amber-600/80 to-amber-950/90",
    highlights: ["Madurai Gopurams", "Panchaloha Bronzes", "Carnatic Sangeet", "Koodiyattam & Kathakali"],
    description: "Anchored by deep granite traditions and living ritual continuity, the Deccan & South encompasses monumental Dravidian temple towns characterized by soaring concentric gopurams and monolithic halls. From the sacred lost-wax metallurgical mastery of Chola bronze casters along the Kaveri to the mathematical rhythms of Carnatic music and the theatrical fury of Koodiyattam and Kathakali, this region preserves classical arts directly tied to community sanctuaries.",
  },
  {
    id: "western-deserts-and-coast",
    slug: "western-deserts-and-coast",
    name: "Western Deserts & Coast",
    states: ["Rajasthan", "Gujarat", "Maharashtra"],
    tagline: "Stepwells, block printing, bandhani ties and desert ballad traditions.",
    blurb: "Stepwells, block printing, bandhani ties and desert ballad traditions.",
    imageUrl: "/images/regions/western_deserts_coast.jpg",
    image: "/images/regions/western_deserts_coast.jpg",
    accentColor: "from-orange-600/80 to-stone-950/90",
    highlights: ["Rani ki Vav Stepwells", "Ajrakh & Dabu Printing", "Bandhani Tie-Dye", "Manganiyar Ballads"],
    description: "A dynamic corridor of arid sands, salt flats, and maritime trade routes, Western India transforms harsh desert geographies into celebrated architectural and textile wonders. Highly engineered subterranean stepwells served as vital hydraulic and communal sanctums adorned with intricate stone carvings. Across Kutch, Thar, and Bagru, master printers harness riverbeds to yield geometric Ajrakh and intricate Bandhani, set against the hypnotic desert ballads of hereditary folk minstrels.",
  },
  {
    id: "eastern-delta",
    slug: "eastern-delta",
    name: "Eastern Delta",
    states: ["West Bengal", "Odisha", "Bihar"],
    tagline: "Terracotta temples, patachitra scrolls, baul song and river festivals.",
    blurb: "Terracotta temples, patachitra scrolls, baul song and river festivals.",
    imageUrl: "/images/regions/eastern_delta.jpg",
    image: "/images/regions/eastern_delta.jpg",
    accentColor: "from-red-600/80 to-stone-950/90",
    highlights: ["Bishnupur Terracotta", "Patachitra Scrolls", "Baul Minstrels", "Riverine Epics & Chhath"],
    description: "The fertile floodplains and deltas of the Ganges, Brahmaputra, and Mahanadi river systems gave rise to an expressive, clay-and-cloth material heritage. In places like Bishnupur, where stone was scarce, artisans sculpted monumental temples out of burnt alluvial terracotta tiles depicting epic narratives. Complemented by the vibrant mythological storytelling of Patachitra scroll painters and the spiritual wandering of Baul minstrels, this region celebrates cyclic water ecology and agrarian festival traditions.",
  },
  {
    id: "himalayan-belt",
    slug: "himalayan-belt",
    name: "Himalayan Belt",
    states: ["Himachal Pradesh", "Uttarakhand", "Sikkim", "Ladakh"],
    tagline: "Wooden hill temples, monastic murals, mask dances and pastoral memory.",
    blurb: "Wooden hill temples, monastic murals, mask dances and pastoral memory.",
    imageUrl: "/images/regions/himalayan_belt.jpg",
    image: "/images/regions/himalayan_belt.jpg",
    accentColor: "from-teal-600/80 to-slate-950/90",
    highlights: ["Kath-Kuni Timber Temples", "Monastic Cham Mask Dances", "Gompa Thangkas", "Pastoralist Weaving"],
    description: "Rising through the high-altitude passes and cedar forests of the Himalayan ridge, this region represents a unique synthesis of indigenous hill lore and Tibetan Buddhist cosmology. Traditional vernacular architecture thrives through wood-and-stone interlocking Kath-Kuni structures engineered to absorb seismic shifts. Within cliffside gompas and valley shrines, heritage is safeguarded through gilded thangka murals, monastic Cham mask dances embodying cosmic protectors, and nomadic pastoral weaving.",
  },
  {
    id: "north-east",
    slug: "north-east",
    name: "North East",
    states: ["Assam", "Manipur", "Nagaland", "Meghalaya"],
    tagline: "Satras and sattriya dance, living root bridges, loin-loom weaving.",
    blurb: "Satras and sattriya dance, living root bridges, loin-loom weaving.",
    imageUrl: "/images/regions/north_east.jpg",
    image: "/images/regions/north_east.jpg",
    accentColor: "from-emerald-600/80 to-emerald-950/90",
    highlights: ["Living Root Bridges (Jingkieng Jri)", "Majuli Satras & Masks", "Sattriya Monastic Dance", "Backstrap Loin-Loom"],
    description: "A biodiversity hotspot with extraordinary community stewardship, the North East showcases profound ecological integration with cultural identity. From the living root bridges engineered by Khasi and Jaintia communities using trained aerial tree roots, to the island monastic Satras of Majuli where 500-year-old Sattriya dance-dramas and bamboo masks are passed down through oral lineages, this region is celebrated for complex backstrap loin-loom textiles that visually encode clan heritage.",
  },
];

/**
 * Canonical URLs for each citation. UNESCO/ASI/ICH deep links are verified;
 * state portals use the official domain of the publishing institution.
 */
const SOURCE_URLS: Record<string, string> = {
  // UNESCO World Heritage List
  "unesco-vav": "https://whc.unesco.org/en/list/922",
  "asi-tanjore": "https://whc.unesco.org/en/list/250",
  "src-dholavira-unesco": "https://whc.unesco.org/en/list/1645",
  // UNESCO Intangible Cultural Heritage
  "unesco-ich-dp": "https://ich.unesco.org/en/RL/durga-puja-in-kolkata-01659",
  "unesco-baul": "https://ich.unesco.org/en/RL/baul-songs-00146",
  // Archaeological Survey of India
  "asi-vav": "https://asi.nic.in/monument/patan-ki-rani-ki-vav/",
  "src-golconda-asi": "https://asi.nic.in/monument/golconda-fort/",
  "src-modhera-asi": "https://asi.nic.in/monument/modhera-sun-temple/",
  "tn-epigraphy": "https://asi.nic.in/",
  // Government ministries & registries
  "hlk-report": "https://handlooms.nic.in/",
  "gi-bandhani": "https://ipindia.gov.in/",
  "gi-kanchi": "https://ipindia.gov.in/",
  "nmm-odisha": "https://www.indiaculture.gov.in/",
  // State portals & institutions
  "kutch-museum": "https://kutchmuseum.gujarat.gov.in/",
  "iitg-erosion": "https://www.iitg.ac.in/",
  "assam-culture": "https://assam.gov.in/",
  "cg-akademi": "https://cgstate.gov.in/",
  "hp-heritage": "https://himachal.nic.in/",
  "kerala-tourism": "https://www.keralatourism.org/",
  "odisha-museum": "https://odisha.gov.in/",
  "sangeet-natak": "https://sangeetnatak.gov.in/",
  "tn-food": "https://www.tn.gov.in/",
  "visva-bharati": "https://visvabharati.ac.in/",
  "wb-culture": "https://wb.nic.in/",
};

const src = (
  id: string,
  title: string,
  publisher: string,
  year: number,
  kind: VerifiedSource["kind"],
): VerifiedSource => ({
  id,
  title,
  publisher,
  year,
  kind,
  url: SOURCE_URLS[id] ?? "https://asi.nic.in/",
});

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: "hs-01",
    slug: "brihadisvara-temple-thanjavur",
    title: "Brihadisvara Temple, Thanjavur",
    titles: {
      en: "Brihadisvara Temple, Thanjavur",
      hi: "बृहदीश्वर मंदिर, तंजावुर",
      ta: "பெருவுடையார் கோயில், தஞ்சாவூர்",
      bn: "বৃহদীশ্বর মন্দির, তাঞ্জাভুর",
    },
    summary: {
      en: "Chola imperial temple with a 66 m vimana carved from granite.",
      hi: "66 मीटर ऊँचे ग्रेनाइट विमान वाला चोल साम्राज्यकालीन मंदिर।",
      ta: "66 மீ கருங்கல் விமானம் கொண்ட சோழர் பெருங்கோயில்.",
      bn: "৬৬ মিটার গ্রানাইট বিমানসহ চোল সাম্রাজ্যের মন্দির।",
    },
    description: {
      en: "Completed in 1010 CE under Rajaraja Chola I, the temple is a high point of Dravidian architecture: a granite vimana rising without mortar, frescoes in the circumambulatory passage, and inscriptions recording the temple's dancers, musicians and endowments. It remains an active place of worship and a living archive of Chola administration.",
      hi: "राजराज चोल प्रथम के शासन में 1010 ई. में पूर्ण, यह मंदिर द्रविड़ स्थापत्य का शिखर है: बिना गारे का ग्रेनाइट विमान, परिक्रमा पथ में भित्तिचित्र, और नर्तकों-वादकों के दान का लेखा रखने वाले शिलालेख।",
      ta: "கி.பி. 1010-இல் முதலாம் ராஜராஜ சோழனால் நிறைவு பெற்ற இக்கோயில், சாந்து இல்லாத கருங்கல் விமானம், சுற்றுப்பாதை ஓவியங்கள், நடனர்-இசைஞர் தான விவரங்களைப் பொறித்த கல்வெட்டுகளால் சிறக்கிறது.",
    },
    state: "Tamil Nadu",
    district: "Thanjavur",
    regionId: "south",
    lat: 10.7828,
    lng: 79.1318,
    category: "monuments",
    period: "1010 CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance:
      "Part of the UNESCO 'Great Living Chola Temples' group; benchmark for granite temple engineering.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Ramped entry at the eastern gateway; inner sanctum has two steps.",
    },
    languages: ["en", "hi", "ta"],
    tags: ["chola", "unesco", "granite", "inscriptions"],
    image: heroHeritage,
    gallery: [heroHeritage, manuscriptImg, performanceImg],
    tourAvailable: true,
    panoramaUrl: "/panoramas/brihadisvara_courtyard_equirect.jpg",
    streetViewEmbedUrl:
      "https://www.google.com/maps/embed?pb=!4v1696000000000!6m8!1m7!1sCAoSK0FGMVFpcE1KcU5vSm9jTXBLNVl4clA4S2s1UXhUbkd3UGR1MmZ2dGFzVEk.!2m2!1d10.782806!2d79.131833!3f150!4f10!5f0.7820865974627469",
    streetViewPanoUrl:
      "https://www.google.com/maps/embed?pb=!4v1696000000000!6m8!1m7!1sCAoSK0FGMVFpcE1KcU5vSm9jTXBLNVl4clA4S2s1UXhUbkd3UGR1MmZ2dGFzVEk.!2m2!1d10.782806!2d79.131833!3f150!4f10!5f0.7820865974627469",
    reelId: "reel-01",
    preservation: "safe",
    preservationNote: "Routine conservation by ASI; visitor load managed during festival weeks.",
    sources: [
      src(
        "asi-tanjore",
        "Great Living Chola Temples — nomination dossier",
        "UNESCO / ASI",
        1987,
        "government",
      ),
      src(
        "tn-epigraphy",
        "South Indian Inscriptions, Vol. II",
        "Dept. of Epigraphy",
        1913,
        "academic",
      ),
    ],
    stories: [
      {
        id: "st-01",
        author: "Meena R.",
        role: "Verified expert · epigraphy",
        locale: "en",
        text: "The wall inscriptions name 400 devadasis and their households — one of India's earliest payroll records.",
        moderation: "approved",
      },
    ],
    artisans: [
      {
        id: "ar-01",
        name: "Swamimalai bronze guild",
        craft: "Lost-wax bronze casting",
        contactNote: "Workshop visits on request",
      },
    ],
    relatedTraditions: ["Carnatic temple music", "Bharatanatyam", "Swamimalai bronzes"],
    architecturalStyle: "Chola Imperial Dravidian Architecture",
    constructionEra: "1010 CE (11th Century CE)",
    patronDynasty: "Chola Empire (Emperor Rajaraja Chola I)",
    preservationScore: "96% Pristine (Intact monolithic granite vimana; active sacred sanctum)",
    visitorDetails: {
      timings: "06:00 AM – 12:30 PM, 04:00 PM – 08:30 PM (Daily pooja hours)",
      entryFee: "Free Entry (Active place of worship & ASI protected monument)",
      bestSeason: "October to March (Cool Tamil Nadu winter; Pongal & Mahashivratri)",
      photographyFee: "Free inside courtyard; prohibited in inner sanctum",
    },
    audioNarrationScript:
      "Rising sixty-six metres without mortar or binding cement, the colossal granite vimana of Brihadisvara Temple was consecrated in 1010 CE by Emperor Rajaraja Chola. Decorated with imperial epigraphs and Chola frescoes, this monument stands as an engineering benchmark and living testament to ancient Indian royal architecture.",
    dataOrigin: "demo",
    updatedAt: "2026-07-14",
  },
  {
    id: "hs-03",
    slug: "durga-puja-kolkata",
    title: "Durga Puja, Kolkata",
    titles: {
      en: "Durga Puja, Kolkata",
      hi: "दुर्गा पूजा, कोलकाता",
      bn: "দুর্গাপূজা, কলকাতা",
      ta: "துர்கா பூஜை, கொல்கத்தா",
    },
    summary: {
      en: "City-scale autumn festival inscribed on UNESCO's intangible heritage list.",
      hi: "यूनेस्को की अमूर्त विरासत सूची में शामिल नगर-व्यापी शरद उत्सव।",
      bn: "ইউনেস্কোর অপার্থিব ঐতিহ্য তালিকায় নথিবদ্ধ শারদীয় উৎসব।",
    },
    description: {
      en: "For five days Kolkata becomes an open-air gallery: bamboo-and-cloth pandals commissioned from artists, clay images from Kumartuli studios, dhaak drumming, community kitchens and night-long crowds. Inscribed by UNESCO in 2021 as an intangible cultural heritage of humanity.",
      hi: "पाँच दिनों तक कोलकाता खुली कला-दीर्घा बन जाता है: कलाकारों द्वारा रचे पंडाल, कुमारटुली की मूर्तियाँ, ढाक की थाप और सामुदायिक भोज। 2021 में यूनेस्को द्वारा अंकित।",
      bn: "পাঁচ দিন কলকাতা এক খোলা গ্যালারি: শিল্পীদের গড়া প্যান্ডেল, কুমারটুলির প্রতিমা, ঢাকের বোল, কমিউনিটি রান্নাঘর। ২০২১ সালে ইউনেস্কো স্বীকৃতি।",
    },
    state: "West Bengal",
    district: "Kolkata",
    regionId: "east",
    lat: 22.5726,
    lng: 88.3639,
    category: "festivals",
    period: "Modern form from 18th century",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    significance: "UNESCO ICH 2021; largest public art commissioning event in South Asia.",
    accessibility: {
      wheelchair: true,
      audioGuide: false,
      signLanguage: true,
      notes: "Major pandals provide ramps and separate queues; crowd density is high after 8 pm.",
    },
    languages: ["en", "bn", "hi"],
    tags: ["unesco-ich", "pandal", "kumartuli", "community"],
    image: festivalImg,
    gallery: [festivalImg, performanceImg],
    tourAvailable: true,
    reelId: "reel-03",
    preservation: "safe",
    preservationNote:
      "Well documented; idol-immersion river pollution monitored by the state board.",
    sources: [
      src("unesco-ich-dp", "Durga Puja in Kolkata — ICH inscription", "UNESCO", 2021, "government"),
      src(
        "wb-culture",
        "Festival documentation series",
        "West Bengal Dept. of Culture",
        2022,
        "government",
      ),
    ],
    stories: [
      {
        id: "st-03",
        author: "Sohini D.",
        role: "Contributor",
        locale: "bn",
        text: "আমাদের পাড়ার প্রতিমা তিন প্রজন্ম ধরে একই পরিবার গড়ে — কাঠামো পুজো থেকেই উৎসব শুরু।",
        moderation: "approved",
      },
    ],
    artisans: [
      {
        id: "ar-03",
        name: "Kumartuli image-makers",
        craft: "Clay idol modelling",
        contactNote: "Studio walks Aug–Oct",
      },
    ],
    relatedTraditions: ["Dhaak drumming", "Patachitra", "Bengali sweet-making"],
    dataOrigin: "demo",
    updatedAt: "2026-06-28",
  },
  {
    id: "hs-04",
    slug: "kathakali-kerala",
    title: "Kathakali, Kerala",
    titles: {
      en: "Kathakali, Kerala",
      hi: "कथकली, केरल",
      ta: "கதகளி, கேரளா",
      bn: "কথাকলি, কেরালা",
    },
    summary: {
      en: "Night-long dance-drama with sculpted make-up and codified hand gestures.",
      hi: "रातभर चलने वाला नृत्य-नाट्य, विशिष्ट रूपसज्जा और मुद्रा-भाषा के साथ।",
      ta: "இரவு முழுவதும் நடக்கும் நடன நாடகம், தனித்துவ ஒப்பனை மற்றும் முத்திரைகள்.",
    },
    description: {
      en: "Kathakali actors train for years in eye exercises, footwork and 24 mudras to narrate Puranic episodes without speech. Chutti make-up built from rice paste and pigment, brass lamps, chenda drumming and sopana-style singing complete the form.",
      hi: "कथकली कलाकार वर्षों तक नेत्र-अभ्यास, पदचाप और 24 मुद्राओं का प्रशिक्षण लेते हैं और बिना संवाद पौराणिक प्रसंग कहते हैं। चुट्टी रूपसज्जा, पीतल दीप और चेंडा वादन इसे पूर्ण करते हैं।",
      ta: "கதகளி நடிகர்கள் கண் பயிற்சி, கால் அடி, 24 முத்திரைகள் கற்று பேச்சின்றி புராணக் கதைகளை நடிக்கின்றனர்.",
    },
    state: "Kerala",
    district: "Thrissur",
    regionId: "south",
    lat: 10.5276,
    lng: 76.2144,
    category: "performing-arts",
    period: "17th century onward",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    significance:
      "Classical form sustained by gurukula training at Kalamandalam and temple patronage.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Kalamandalam auditorium is step-free; performances run past midnight.",
    },
    languages: ["en", "hi", "ta"],
    tags: ["dance-drama", "mudra", "chutti", "gurukula"],
    image: performanceImg,
    gallery: [performanceImg, festivalImg],
    tourAvailable: false,
    reelId: "reel-04",
    preservation: "attention",
    preservationNote: "Fewer full night performances; young performers migrate for stable income.",
    sources: [
      src(
        "sangeet-natak",
        "Kathakali: technique and repertoire",
        "Sangeet Natak Akademi",
        2018,
        "academic",
      ),
      src(
        "kerala-tourism",
        "Classical arts of Kerala",
        "Kerala Dept. of Tourism",
        2023,
        "government",
      ),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-04",
        name: "Chutti artists' collective",
        craft: "Kathakali make-up",
        contactNote: "Pre-show demonstrations",
      },
    ],
    relatedTraditions: ["Koodiyattam", "Chenda melam", "Kalaripayattu"],
    dataOrigin: "demo",
    updatedAt: "2026-05-19",
  },
  {
    id: "hs-05",
    slug: "palm-leaf-manuscripts-odisha",
    title: "Palm-leaf manuscripts of Odisha",
    titles: {
      en: "Palm-leaf manuscripts of Odisha",
      hi: "ओडिशा के ताड़पत्र हस्तलेख",
      bn: "ওড়িশার তালপাতার পুঁথি",
    },
    summary: {
      en: "Iron-stylus etched palm leaves carrying poetry, astronomy and ritual manuals.",
      hi: "लौह लेखनी से उत्कीर्ण ताड़पत्र, जिनमें काव्य, खगोल और कर्मकांड ग्रंथ हैं।",
      bn: "লোহার শলাকায় খোদাই তালপাতা — কাব্য, জ্যোতির্বিদ্যা ও আচার-নির্দেশিকা।",
    },
    description: {
      en: "Scribes cure palm leaves, etch letters with an iron stylus, then rub soot to reveal script. Odia collections include Gita Govinda illustrations, medical compendia and horoscopes. Many household collections remain unread and undigitised.",
      hi: "लेखक ताड़पत्र संसाधित करते हैं, लौह लेखनी से अक्षर उत्कीर्ण करते हैं और कालिख रगड़कर लिपि उभारते हैं। ओड़िया संग्रहों में गीत गोविंद चित्रण और आयुर्वेद ग्रंथ शामिल हैं।",
      bn: "লিপিকর তালপাতা শুকিয়ে লোহার শলাকায় অক্ষর খোদাই করে, পরে কাজল ঘষে লেখা ফুটিয়ে তোলে।",
    },
    state: "Odisha",
    district: "Puri",
    regionId: "east",
    lat: 19.8135,
    lng: 85.8312,
    category: "manuscripts",
    period: "14th–19th century",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Primary source base for Odia literature and temple ritual practice.",
    accessibility: {
      wheelchair: true,
      audioGuide: false,
      signLanguage: false,
      notes: "Reading room accessible; handling requires curator supervision.",
    },
    languages: ["en", "hi", "bn"],
    tags: ["palm-leaf", "digitisation", "odia", "archive"],
    image: "/images/crafts/odisha_palm_leaf.jpg",
    gallery: [manuscriptImg],
    tourAvailable: false,
    reelId: "reel-05",
    preservation: "risk",
    preservationNote:
      "Humidity, insect damage and untrained handling; digitisation backlog is large.",
    sources: [
      src(
        "nmm-odisha",
        "National Mission for Manuscripts state survey",
        "Ministry of Culture",
        2019,
        "government",
      ),
      src(
        "odisha-museum",
        "Catalogue of palm-leaf holdings",
        "Odisha State Museum",
        2015,
        "museum",
      ),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-05",
        name: "Raghurajpur scribes",
        craft: "Palm-leaf etching & patachitra",
        contactNote: "Village workshop cluster",
      },
    ],
    relatedTraditions: ["Patachitra", "Gita Govinda recitation"],
    dataOrigin: "demo",
    updatedAt: "2026-07-30",
  },
  {
    id: "hs-06",
    slug: "chandratal-hill-temples",
    title: "Wooden hill temples of Kinnaur",
    titles: {
      en: "Wooden hill temples of Kinnaur",
      hi: "किन्नौर के काष्ठ पर्वतीय मंदिर",
      bn: "কিন্নরের কাঠের পাহাড়ি মন্দির",
    },
    summary: {
      en: "Deodar-and-slate temples combining Himalayan carpentry with shikhara forms.",
      hi: "देवदार और स्लेट से बने मंदिर, हिमालयी काष्ठकला और शिखर शैली का मेल।",
    },
    description: {
      en: "Kath-kuni construction alternates timber and stone courses without mortar, giving these temples seismic resilience. Carved lintels show local deities, and village committees still rotate custodianship annually.",
      hi: "काठ-कुनी निर्माण में लकड़ी और पत्थर की परतें बिना गारे लगाई जाती हैं, जो भूकंप सहनशीलता देती हैं। ग्राम समितियाँ प्रतिवर्ष देखरेख बदलती हैं।",
    },
    state: "Himachal Pradesh",
    district: "Kinnaur",
    regionId: "himalaya",
    lat: 31.5892,
    lng: 78.2726,
    category: "monuments",
    period: "12th–18th century",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance:
      "Rare surviving kath-kuni religious architecture with active community custodianship.",
    accessibility: {
      wheelchair: false,
      audioGuide: false,
      signLanguage: false,
      notes: "Steep stone approach paths; high-altitude access closed in deep winter.",
    },
    languages: ["en", "hi"],
    tags: ["kath-kuni", "deodar", "himalaya", "seismic"],
    image: "/images/monuments/kinnaur_wooden_temple.jpg",
    gallery: [hillTempleImg],
    tourAvailable: true,
    reelId: "reel-06",
    preservation: "restoration",
    preservationNote:
      "Roof re-slating underway with traditional carpenters; funded by state heritage cell.",
    sources: [
      src(
        "hp-heritage",
        "Himachal vernacular architecture survey",
        "HP Dept. of Language & Culture",
        2021,
        "government",
      ),
    ],
    stories: [
      {
        id: "st-06",
        author: "Tenzin N.",
        role: "Local custodian",
        locale: "hi",
        text: "हर साल गाँव की बारी बदलती है; मरम्मत का काम पुराने बढ़ई ही तय करते हैं।",
        moderation: "pending",
      },
    ],
    artisans: [
      {
        id: "ar-06",
        name: "Kinnauri carpenters' guild",
        craft: "Kath-kuni woodwork",
        contactNote: "Seasonal availability",
      },
    ],
    relatedTraditions: ["Mask dance", "Kinnauri shawl weaving"],
    dataOrigin: "demo",
    updatedAt: "2026-08-11",
  },
  {
    id: "hs-07",
    slug: "chettinad-kitchen-traditions",
    title: "Chettinad kitchen traditions",
    titles: {
      en: "Chettinad kitchen traditions",
      hi: "चेट्टिनाड रसोई परंपराएँ",
      ta: "செட்டிநாடு சமையல் மரபு",
    },
    summary: {
      en: "Spice-forward merchant cuisine tied to mansion architecture and festival calendars.",
      hi: "मसाला-प्रधान व्यापारी पाक-परंपरा, हवेली स्थापत्य और उत्सव पंचांग से जुड़ी।",
      ta: "மசாலா நிறைந்த வணிக சமையல் மரபு, மாளிகைக் கட்டமைப்புடன் இணைந்தது.",
    },
    description: {
      en: "Nattukottai Chettiar households developed sun-dried spice blends, stone-ground masalas and separate ritual and everyday kitchens. Recipes travelled with trading families across Southeast Asia and returned altered.",
      hi: "नाट्टुकोट्टै चेट्टियार परिवारों ने धूप में सुखाए मसाले, पत्थर पर पिसी मसाला-विधियाँ और अलग अनुष्ठान रसोई विकसित कीं।",
      ta: "நாட்டுக்கோட்டை நகரத்தார் குடும்பங்கள் வெயிலில் உலர்த்திய மசாலா, அம்மியில் அரைத்த கலவைகள், தனி சடங்கு சமையலறை உருவாக்கினர்.",
    },
    state: "Tamil Nadu",
    district: "Sivaganga",
    regionId: "south",
    lat: 10.1667,
    lng: 78.7833,
    category: "food",
    period: "19th century onward",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: false,
    significance: "Documents trade-driven culinary exchange between Tamil Nadu and Southeast Asia.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Heritage mansion kitchens have wide corridors and level courtyards.",
    },
    languages: ["en", "ta", "hi"],
    tags: ["cuisine", "spice", "diaspora", "mansions"],
    image: "/images/food/chettinad_kitchen.jpg",
    gallery: [festivalImg, craftWeaving],
    tourAvailable: false,
    preservation: "attention",
    preservationNote:
      "Recipe knowledge concentrated in elderly cooks; oral documentation incomplete.",
    sources: [
      src("tn-food", "Culinary heritage of Tamil Nadu", "Tamil Nadu Archives", 2017, "academic"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-07",
        name: "Kanadukathan cooks' circle",
        craft: "Traditional Chettinad cooking",
        contactNote: "Cooking sessions by booking",
      },
    ],
    relatedTraditions: ["Athangudi tile making", "Chettinad mansion architecture"],
    dataOrigin: "demo",
    updatedAt: "2026-04-22",
  },
  {
    id: "hs-08",
    slug: "baul-song-bengal",
    title: "Baul song of Bengal",
    titles: {
      en: "Baul song of Bengal",
      hi: "बंगाल का बाउल गान",
      bn: "বাংলার বাউল গান",
    },
    summary: {
      en: "Wandering minstrel tradition of syncretic mystic song, on UNESCO's ICH list.",
      hi: "यूनेस्को सूची में शामिल घुमंतू बाउल गायकों की रहस्यवादी परंपरा।",
      bn: "ইউনেস্কো তালিকাভুক্ত ভ্রাম্যমাণ বাউলদের রহস্যময় গানের ধারা।",
    },
    description: {
      en: "Bauls sing of the body as temple, accompanied by ektara, dubki and khamak. The repertoire blends Vaishnava, Sufi and tantric strands and is transmitted through guru-shishya lineages at akhras rather than institutions.",
      hi: "बाउल शरीर को मंदिर मानकर गाते हैं, एकतारा और डुबकी के साथ। परंपरा गुरु-शिष्य क्रम में अखाड़ों में चलती है।",
      bn: "বাউলরা দেহকে মন্দির ধরে গান করেন — একতারা, ডুবকি, খমকসহ। গুরু-শিষ্য ধারায় আখড়ায় শিক্ষা চলে।",
    },
    state: "West Bengal",
    district: "Birbhum",
    regionId: "east",
    lat: 23.6889,
    lng: 87.6833,
    category: "music",
    period: "18th century onward",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    significance: "UNESCO ICH 2008; model of syncretic oral transmission.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Akhra grounds are unpaved; festival seating on mats.",
    },
    languages: ["en", "bn", "hi"],
    tags: ["unesco-ich", "ektara", "mystic", "oral-transmission"],
    image: "/images/performing_arts/baul_song_bengal.jpg",
    gallery: [performanceImg, manuscriptImg],
    tourAvailable: false,
    reelId: "reel-07",
    preservation: "attention",
    preservationNote: "Commercial stage adaptation is diluting akhra-based transmission.",
    sources: [
      src("unesco-baul", "Baul songs — ICH inscription", "UNESCO", 2008, "government"),
      src(
        "visva-bharati",
        "Field recordings of Baul repertoire",
        "Visva-Bharati",
        2016,
        "academic",
      ),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-08",
        name: "Ektara makers of Bolpur",
        craft: "Instrument making",
        contactNote: "Workshop near Bolpur station",
      },
    ],
    relatedTraditions: ["Kirtan", "Sufi qawwali", "Fakiri song"],
    dataOrigin: "demo",
    updatedAt: "2026-07-05",
  },
  {
    id: "hs-09",
    slug: "rani-ki-vav-patan",
    title: "Rani ki Vav, Patan",
    titles: {
      en: "Rani ki Vav, Patan",
      hi: "रानी की वाव, पाटन",
      bn: "রানি কি ভাভ, পাটন",
    },
    summary: {
      en: "Eleventh-century subterranean stepwell with seven levels of sculpture.",
      hi: "ग्यारहवीं सदी की भूमिगत बावड़ी, सात स्तरों की मूर्तिकला के साथ।",
    },
    description: {
      en: "Built as an inverted temple by Queen Udayamati, the stepwell descends through sculpted galleries with over 500 principal figures, including Dashavatara panels. Silted for centuries, it was excavated in the 1980s and inscribed by UNESCO in 2014.",
      hi: "रानी उदयमती द्वारा उलटे मंदिर के रूप में निर्मित इस वाव में 500 से अधिक प्रमुख मूर्तियाँ हैं। सदियों तक गाद में दबी रहकर 1980 के दशक में उत्खनित हुई और 2014 में यूनेस्को सूची में आई।",
    },
    state: "Gujarat",
    district: "Patan",
    regionId: "west",
    lat: 23.8587,
    lng: 72.1017,
    category: "monuments",
    period: "1063 CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "UNESCO World Heritage Site; pinnacle of Maru-Gurjara water architecture.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Viewing platform at ground level is accessible; lower levels are stairs only.",
    },
    languages: ["en", "hi"],
    tags: ["stepwell", "unesco", "sculpture", "water-heritage"],
    image: "/images/monuments/rani_ki_vav.jpg",
    gallery: ["/images/monuments/rani_ki_vav.jpg", manuscriptImg],
    images: ["/images/monuments/rani_ki_vav.jpg", manuscriptImg],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Groundwater and salt crystallisation monitored quarterly.",
    sources: [
      src("unesco-vav", "Rani ki Vav inscription file", "UNESCO", 2014, "government"),
      src("asi-vav", "Conservation notes, Patan circle", "ASI", 2020, "government"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-09",
        name: "Patan Patola weavers",
        craft: "Double-ikat patola",
        contactNote: "Family workshops in old town",
      },
    ],
    relatedTraditions: ["Patola weaving", "Water rituals"],
    architecturalStyle: "Maru-Gurjara (Solanki Stepwell Architecture)",
    constructionEra: "11th Century CE (c. 1063 CE)",
    patronDynasty: "Solanki / Chaulukya Dynasty (Commissioned by Queen Udayamati in memory of King Bhima I)",
    preservationScore: "94% Intact (Subterranean Silt Preservation & ASI Supervised Conservation)",
    visitorDetails: {
      timings: "08:00 AM – 06:00 PM (Open all 7 days)",
      entryFee: "₹40 for Indian & SAARC Citizens; ₹600 for Foreign Tourists; Free for Children under 15",
      bestSeason: "October to March (Mild semi-arid winter; Patan Patola festival in December)",
      photographyFee: "Free for mobile cameras; ₹25 for professional DSLRs (No tripods permitted)",
    },
    audioNarrationScript:
      "Rani ki Vav is an inverted stepwell temple descending through seven subterranean pavilions, adorned with over five hundred monumental stone sculptures of Lord Vishnu and the Dashavatara. Commissioned in 1063 CE by Queen Udayamati as a sacred memorial, it remains an engineering marvel uniting divine sculpture with desert water harvesting.",
    dataOrigin: "demo",
    updatedAt: "2026-03-16",
  },
  {
    id: "hs-10",
    slug: "sattriya-majuli",
    title: "Sattriya and satra life, Majuli",
    titles: {
      en: "Sattriya and satra life, Majuli",
      hi: "सत्रीया और सत्र जीवन, माजुली",
      bn: "সত্রীয়া ও সত্র জীবন, মাজুলি",
    },
    summary: {
      en: "Monastic dance-drama and manuscript culture on a shrinking river island.",
      hi: "घटते नदी-द्वीप पर मठीय नृत्य-नाट्य और हस्तलेख संस्कृति।",
    },
    description: {
      en: "Satras founded in the Vaishnava movement of Srimanta Sankardeva sustain sattriya dance, borgeet singing, mask making and manuscript painting. Majuli's landmass shrinks each monsoon, making the cultural risk inseparable from the geographic one.",
      hi: "श्रीमंत शंकरदेव के वैष्णव आंदोलन से जुड़े सत्र सत्रीया नृत्य, बरगीत, मुखौटा निर्माण और हस्तलेख चित्रण जीवित रखते हैं। माजुली हर वर्षा में सिकुड़ता है।",
    },
    state: "Assam",
    district: "Majuli",
    regionId: "northeast",
    lat: 26.9524,
    lng: 94.1662,
    category: "performing-arts",
    period: "16th century onward",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    significance: "Classical form with unbroken monastic transmission; at direct climate risk.",
    accessibility: {
      wheelchair: false,
      audioGuide: false,
      signLanguage: false,
      notes: "Ferry access only; satra courtyards are packed earth.",
    },
    languages: ["en", "hi", "bn"],
    tags: ["sattriya", "satra", "mask", "climate-risk"],
    image: "/images/performing_arts/majuli_sattriya_satra.jpg",
    gallery: [performanceImg, manuscriptImg, hillTempleImg],
    tourAvailable: false,
    reelId: "reel-08",
    preservation: "risk",
    preservationNote:
      "Brahmaputra erosion has displaced several satras; archives relocated repeatedly.",
    sources: [
      src(
        "assam-culture",
        "Satra institutions of Majuli",
        "Assam Dept. of Cultural Affairs",
        2019,
        "government",
      ),
      src("iitg-erosion", "Majuli erosion assessment", "IIT Guwahati", 2022, "academic"),
    ],
    stories: [
      {
        id: "st-10",
        author: "Bhaskar B.",
        role: "Verified expert · performing arts",
        locale: "en",
        text: "Mask makers now teach in three-week camps because apprenticeships broke after the 2019 floods.",
        moderation: "approved",
      },
    ],
    artisans: [
      {
        id: "ar-10",
        name: "Samaguri satra mask makers",
        craft: "Mukha mask making",
        contactNote: "Demonstrations daily",
      },
    ],
    relatedTraditions: ["Borgeet", "Bhaona theatre", "Mukha mask making"],
    dataOrigin: "demo",
    updatedAt: "2026-08-19",
  },
  {
    id: "hs-11",
    slug: "pandavani-oral-epic",
    title: "Pandavani oral epic, Chhattisgarh",
    titles: {
      en: "Pandavani oral epic, Chhattisgarh",
      hi: "पंडवानी मौखिक गाथा, छत्तीसगढ़",
    },
    summary: {
      en: "Solo narrative singing of the Mahabharata with tambura and gestural theatre.",
      hi: "तंबूरा और भाव-नाट्य के साथ महाभारत की एकल गाथा-गायकी।",
    },
    description: {
      en: "A single performer narrates, sings and acts Mahabharata episodes in Chhattisgarhi, often centring Bhima. The Kapalik and Vedamati styles differ in whether the singer stands and enacts or remains seated.",
      hi: "एक ही कलाकार छत्तीसगढ़ी में महाभारत प्रसंग कहता, गाता और अभिनीत करता है — प्रायः भीम केंद्र में। कापालिक और वेदमती शैलियाँ भिन्न हैं।",
    },
    state: "Chhattisgarh",
    district: "Durg",
    regionId: "east",
    lat: 21.1904,
    lng: 81.2849,
    category: "oral-history",
    period: "Documented from 20th century",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: false,
    significance:
      "Living epic transmission outside written canon; strong women performers' lineage.",
    accessibility: {
      wheelchair: true,
      audioGuide: false,
      signLanguage: false,
      notes: "Village stages are ground-level; performances are usually outdoors.",
    },
    languages: ["en", "hi"],
    tags: ["epic", "tambura", "folk", "chhattisgarhi"],
    image: "/images/performing_arts/pandavani_chhattisgarh.jpg",
    gallery: [performanceImg],
    tourAvailable: false,
    preservation: "attention",
    preservationNote:
      "Few recorded full cycles; most repertoire exists only in performers' memory.",
    sources: [
      src(
        "cg-akademi",
        "Pandavani performers survey",
        "Chhattisgarh Sanskriti Vibhag",
        2018,
        "government",
      ),
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["Panthi dance", "Raut nacha"],
    dataOrigin: "demo",
    updatedAt: "2026-02-09",
  },
  {
    id: "hs-13",
    slug: "golconda-fort-hyderabad",
    title: "Golconda Fort, Hyderabad",
    titles: {
      en: "Golconda Fort, Hyderabad",
      hi: "गोलकोंडा किला, हैदराबाद",
    },
    summary: {
      en: "Acoustic marvel and medieval diamond capital perched on a 120m granite hill.",
      hi: "120 मीटर ग्रेनाइट पहाड़ी पर स्थित ध्वनिकी चमत्कार और मध्यकालीन हीरा राजधानी।",
    },
    description: {
      en: "Erected by the Kakatiyas and expanded by the Qutb Shahi dynasty, Golconda Fort was renowned globally for its diamond trade—producing the Koh-i-Noor and Hope diamonds. Its acoustic engineering is legendary: a clap at the Fateh Darwaza can be heard over a kilometre away at the Bala Hissar summit.",
      hi: "काकतीय शासकों द्वारा निर्मित और कुतुब शाही राजवंश द्वारा विस्तारित, गोलकोंडा किला अपने हीरा व्यापार—जिसमें कोहिनूर और होप हीरे शामिल थे—के लिए विश्वविख्यात था। इसकी ध्वनिक वास्तुकला अद्भुत है: फतेह दरवाज़े पर बजाई गई ताली एक किलोमीटर दूर बाला हिसार तक गूँजती है।",
    },
    state: "Telangana",
    district: "Hyderabad",
    regionId: "south",
    lat: 17.3833,
    lng: 78.4011,
    category: "monuments",
    period: "1518–1687 CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance:
      "World-famed fortress of the Deccan diamond trade and acoustic defensive engineering.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Lower courtyards have smooth access; summit requires climbing stone steps.",
    },
    languages: ["en", "hi"],
    tags: ["qutb-shahi", "deccan", "acoustics", "diamonds", "fortress"],
    image: golcondaFortImg,
    gallery: [golcondaFortImg, heroHeritage],
    tourAvailable: true,
    reelId: "reel-golconda",
    preservation: "safe",
    preservationNote:
      "Protected by the Archaeological Survey of India with restored acoustic corridors.",
    sources: [
      src(
        "src-golconda-asi",
        "Golconda Fort Conservation Monograph",
        "Archaeological Survey of India",
        2023,
        "government",
      ),
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["Deccani metallurgy", "Bidri craft", "Qutb Shahi architecture"],
    dataOrigin: "demo",
    updatedAt: "2026-09-15",
  },
  {
    id: "hs-14",
    slug: "modhera-sun-temple-patan",
    title: "Sun Temple, Modhera",
    titles: {
      en: "Sun Temple, Modhera",
      hi: "सूर्य मंदिर, मोढेरा",
      gu: "સૂર્ય મંદિર, મોઢેરા",
    },
    summary: {
      en: "11th-century Maru-Gurjara masterpiece aligned to catch the equinox dawn sun.",
      hi: "11वीं शताब्दी की मारू-गुर्जर स्थापत्य कृति, विषुव की पहली सूर्य किरणों से आलोकित।",
      gu: "11મી સદીનું મારુ-ગુર્જર સ્થાપત્ય રત્ન, જે વિષુવવૃત્તીય સૂર્યકિરણોને ઝીલે છે.",
    },
    description: {
      en: "Commissioned in 1026 CE by King Bhima I of the Solanki dynasty, the Sun Temple at Modhera is dedicated to the solar deity Surya. Designed so that the first rays of the rising sun illuminated the golden sanctum during equinoxes, the complex features an ornate stepped water reservoir (Surya Kund) with 108 miniature shrines.",
      hi: "सोलंकी वंश के राजा भीम प्रथम द्वारा 1026 ई. में निर्मित, मोढेरा का सूर्य मंदिर भगवान सूर्य को समर्पित है। विषुव के दिन उगते सूर्य की पहली किरणें गर्भगृह को आलोकित करती थीं। यहाँ 108 लघु मंदिरों से सज्जित भव्य सूर्य कुंड स्थित है।",
      gu: "સોલંકી વંશના રાજા ભીમદેવ પ્રથમ દ્વારા ઈ.સ. 1026માં નિર્મિત, મોઢેરાનું સૂર્ય મંદિર અદ્ભુત છે. વિષુવવૃત્ત પર સૂર્યના પ્રથમ કિરણો સીધા ગર્ભગૃહને પ્રકાશિત કરતા. અહીં 108 નાના મંદિરો ધરાવતો ભવ્ય સૂર્ય કુંડ આવેલો છે.",
    },
    state: "Gujarat",
    district: "Mehsana",
    regionId: "west",
    lat: 23.5835,
    lng: 72.1331,
    category: "monuments",
    period: "1026 CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance:
      "Pre-eminent example of Solanki temple architecture with astronomical solar alignments.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Paved pathways around Sabha Mandap; ramp access to main platform.",
    },
    languages: ["en", "hi", "gu"],
    tags: ["solanki", "sun-temple", "stepwell", "astronomy", "unesco"],
    name: "Modhera Sun Temple",
    image: modheraSunTempleImg,
    gallery: [modheraSunTempleImg, heroHeritage],
    images: [modheraSunTempleImg, heroHeritage],
    tourAvailable: true,
    panoramaUrl: modheraSunTempleImg,
    reelId: "reel-modhera",
    preservation: "safe",
    preservationNote:
      "Under active ASI preservation; India's first round-the-clock solar-powered heritage village.",
    sources: [
      src(
        "src-modhera-asi",
        "Modhera Sun Temple Monograph",
        "Archaeological Survey of India",
        2024,
        "government",
      ),
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["Solanki stone carving", "Patan Patola weaving", "Surya worship rites"],
    dataOrigin: "demo",
    updatedAt: "2026-09-15",
    model3dUrl: "/models/ashoka_capital.glb",
    artifactInfo: {
      name: "Carved Sandstone Sun Wheel Fragment",
      period: "Solanki Dynasty (1026 CE)",
      description:
        "Intricately carved sandstone relic featuring solar rays and celestial motifs from the Sabha Mandap ceiling.",
    },
  },
  {
    id: "hs-15",
    slug: "dholavira-indus-valley",
    title: "Dholavira: Indus Valley Harappan City",
    titles: {
      en: "Dholavira: Indus Valley City",
      hi: "धोलावीरा: सिंधु घाटी सभ्यता का महानगर",
      gu: "ધોળાવીરા: સિંધુ ખીણ સભ્યતાનું નગર",
    },
    summary: {
      en: "UNESCO World Heritage Bronze Age metropolis with an extraordinary stone water conservation network.",
      hi: "असाधारण पाषाण जल संचयन प्रणाली वाला यूनेस्को विश्व धरोहर कांस्य युगीन महानगर।",
      gu: "વિશ્વ ધરોહર કાંસ્ય યુગનું મહાનગર, અદ્ભુત પથ્થર જળ વ્યવસ્થાપન પ્રણાલી સાથે.",
    },
    description: {
      en: "Occupied from ~3000 BCE to 1500 BCE, Dholavira in the Rann of Kutch is one of the most remarkable cities of the Indus Valley Civilization. Unlike mud-brick Harappan cities, Dholavira was built of finely dressed stone. It features a massive tripartite citadel, the world's oldest stadium, and a sophisticated cascade of stone reservoirs capable of holding 250,000 cubic metres of monsoon water.",
      hi: "कच्छ के रण में स्थित धोलावीरा लगभग 3000 ईसा पूर्व से 1500 ईसा पूर्व तक बसा रहा। अन्य हड़प्पा नगरों के विपरीत, धोलावीरा तराशे गए पत्थरों से बना था। इसमें त्रिस्तरीय नगर रचना, प्राचीनतम स्टेडियम और मानसून जल संचय के लिए विशाल पाषाण जलाशय मौजूद हैं।",
      gu: "કચ્છના રણમાં આવેલું ધોળાવીરા સિંધુ ખીણ સંસ્કૃતિનું અજોડ નગર છે. પથ્થરથી બનેલા આ નગરમાં ત્રિસ્તરીય સુરક્ષા દુર્ગ અને ચોમાસાનું પાણી સંગ્રહ કરવા વિશાળ જળાશયોનું ઉત્કૃષ્ટ નેટવર્ક હતું.",
    },
    state: "Gujarat",
    district: "Kutch",
    regionId: "west",
    lat: 23.8864,
    lng: 70.2131,
    category: "monuments",
    period: "3000–1500 BCE",
    era: "ancient",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance:
      "Foremost excavated Harappan stone metropolis in South Asia and UNESCO World Heritage Site.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Desert terrain walkways; on-site ASI museum is accessible.",
    },
    languages: ["en", "hi", "gu"],
    tags: ["harappan", "indus-valley", "bronze-age", "water-reservoirs", "unesco"],
    name: "Dholavira: Harappan City",
    image: indusValleyImg,
    gallery: [indusValleyImg, heroHeritage],
    images: [indusValleyImg, heroHeritage],
    tourAvailable: true,
    panoramaUrl: indusValleyImg,
    reelId: "reel-indus",
    preservation: "safe",
    preservationNote: "Maintained under UNESCO World Heritage protection and ASI conservation.",
    sources: [
      src(
        "src-dholavira-unesco",
        "Dholavira: A Harappan City",
        "UNESCO World Heritage Centre",
        2021,
        "government",
      ),
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["Bead making", "Kutch pottery", "Ancient water harvesting"],
    dataOrigin: "demo",
    updatedAt: "2026-09-15",
    model3dUrl: "/models/ashoka_capital.glb",
    artifactInfo: {
      name: "Excavated Harappan Terracotta Artifact",
      period: "Mature Harappan Period (~2500 BCE)",
      description:
        "Ceremonial terracotta relic uncovered from the northern citadel reservoir complex at Dholavira.",
    },
  },
  {
    id: "hs-16",
    slug: "hampi-monuments",
    title: "Group of Monuments at Hampi (Vijayanagara)",
    titles: {
      en: "Group of Monuments at Hampi",
      hi: "हम्पी के स्मारक समूह, विजयनगर",
    },
    summary: {
      en: "Capital of the Vijayanagara Empire with stone chariot and musical granite pillars.",
      hi: "विजयनगर साम्राज्य की भव्य राजधानी, प्रस्तर रथ और संगीतमय स्तंभों से सुशोभित।",
    },
    description: {
      en: "Sprawling across granite boulder hills along the Tungabhadra River, Hampi preserves the royal citadel, Vittala temple with its iconic stone chariot, and multi-pillared mandapas of the Vijayanagara Empire.",
      hi: "तुंगभद्रा नदी के तट पर ग्रेनाइट पहाड़ियों के बीच फैला हम्पी, विजयनगर साम्राज्य का शाही केंद्र और दक्षिण भारतीय वास्तुकला का स्वर्णिम शिखर है।",
    },
    state: "Karnataka",
    district: "Ballari",
    regionId: "south",
    lat: 15.3350,
    lng: 76.4600,
    category: "monuments",
    period: "14th–16th Century CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "UNESCO World Heritage Site; imperial capital of the Vijayanagara Empire.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Battery-operated vehicles connect the parking lot with the Vittala Temple complex.",
    },
    languages: ["en", "hi"],
    tags: ["vijayanagara", "unesco", "granite", "stone-chariot", "temple"],
    image: "/images/monuments/hampi.jpg",
    gallery: ["/images/monuments/hampi.jpg", indusValleyImg],
    images: ["/images/monuments/hampi.jpg", indusValleyImg],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Protected by ASI under the Hampi World Heritage Area Management Authority.",
    sources: [
      src("unesco-hampi", "Group of Monuments at Hampi", "UNESCO", 1986, "government"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-hampi",
        name: "Tungabhadra Stone Sculptors Guild",
        craft: "Soapstone carving & miniature chariots",
        contactNote: "Workshops along Hampi Bazaar",
      },
    ],
    relatedTraditions: ["Soapstone carving", "Carnatic temple hymns"],
    architecturalStyle: "Vijayanagara Dravidian Granite Architecture",
    constructionEra: "14th – 16th Century CE (1336–1565 CE)",
    patronDynasty: "Vijayanagara Empire (Sangama & Tuluva Dynasties; Emperor Krishnadevaraya)",
    preservationScore: "88% Stable (Extensive archaeological protection across 41 sq km open-air museum)",
    visitorDetails: {
      timings: "06:00 AM – 06:00 PM (Vittala Temple & Zenana Enclosure: 08:30 AM – 05:30 PM)",
      entryFee: "₹40 for Indian & BIMSTEC Citizens; ₹600 for Foreign Visitors; Combined entry for Vittala & Lotus Mahal",
      bestSeason: "October to February (Pleasant winter weather; Annual Hampi Utsav in January)",
      photographyFee: "Free for mobile devices; ₹25 for still video camera recording",
    },
    audioNarrationScript:
      "Sprawling across granite boulder hills along the sacred Tungabhadra River, Hampi was the imperial capital of the Vijayanagara Empire, once among the wealthiest metropolises of the medieval world. Here, the legendary monolithic Stone Chariot and the fifty-six musical pillars of Vittala Temple embody the zenith of South Indian artistic glory.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-17",
    slug: "konark-sun-temple",
    title: "Konark Sun Temple (The Black Pagoda)",
    titles: {
      en: "Konark Sun Temple (The Black Pagoda)",
      hi: "कोणार्क सूर्य मंदिर, ओडिशा",
      bn: "কোনারক সূর্য মন্দির",
    },
    summary: {
      en: "13th-century monumental cosmic chariot dedicated to the Sun God Surya.",
      hi: "13वीं शताब्दी का विशाल प्रस्तर सूर्य रथ, 24 चक्रों और 7 अश्वों से सुसज्जित।",
    },
    description: {
      en: "Conceived as a colossal celestial chariot with 24 carved stone sundial wheels drawn by seven galloping horses, Konark is the crowning jewel of Kalinga temple architecture, celebrating solar geometry and divine dance.",
      hi: "सूर्य देव के भव्य रथ के रूप में कल्पित यह मंदिर कलिंग स्थापत्य का सर्वोच्च शिखर है, जिसके 24 प्रस्तर पहिए सौर घड़ी का काम करते हैं।",
    },
    state: "Odisha",
    district: "Puri",
    regionId: "east",
    lat: 19.8876,
    lng: 86.0945,
    category: "monuments",
    period: "1250 CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "UNESCO World Heritage Site; monument of national astronomical and artistic importance.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Ramped outer circumambulation pathway with Braille signage at the ticket counter.",
    },
    languages: ["en", "hi", "bn"],
    tags: ["kalinga", "unesco", "sundial", "sun-temple", "chlorite"],
    image: "/images/monuments/konark_sun_temple.jpg",
    gallery: ["/images/monuments/konark_sun_temple.jpg", manuscriptImg],
    images: ["/images/monuments/konark_sun_temple.jpg", manuscriptImg],
    tourAvailable: true,
    preservation: "restoration",
    preservationNote: "Interior sand-infill stabilization monitored continually by ASI expert committees.",
    sources: [
      src("unesco-konark", "Sun Temple, Konârak Dossier", "UNESCO", 1984, "government"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-konark",
        name: "Raghurajpur Heritage Craft Guild",
        craft: "Pattachitra palm-leaf scrolls & chlorite carving",
        contactNote: "Artisan village near Konark-Puri highway",
      },
    ],
    relatedTraditions: ["Odissi classical dance", "Pattachitra scroll painting", "Konark Dance Festival"],
    architecturalStyle: "Kalinga Architecture (Rekha & Bhadra Deula Sanctuary)",
    constructionEra: "c. 1250 CE (13th Century CE)",
    patronDynasty: "Eastern Ganga Dynasty (King Narasimhadeva I)",
    preservationScore: "86% Conserved (Jagamohana structural infill by ASI; exterior chariot wheels intact)",
    visitorDetails: {
      timings: "06:00 AM – 08:00 PM (Daily; Light & Sound show: 07:00 PM – 08:00 PM)",
      entryFee: "₹40 for Indian & BIMSTEC Citizens; ₹600 for Foreign Tourists",
      bestSeason: "November to February (Mild coastal winter; Konark Dance Festival in December)",
      photographyFee: "Free for non-commercial mobile photography; ₹30 for video cameras",
    },
    audioNarrationScript:
      "Conceived as a colossal cosmic chariot for Surya the Sun God, the Konark temple rests upon twenty-four intricately carved stone wheels drawn by seven galloping celestial horses. Constructed in the thirteenth century by King Narasimhadeva, its green chlorite and khondalite reliefs form an immortal testament to ancient Indian astronomy and sculpture.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-18",
    slug: "amber-fort-jaipur",
    title: "Amer Palace & Fort, Jaipur",
    titles: {
      en: "Amer Palace & Fort, Jaipur",
      hi: "आमेर का किला, जयपुर",
    },
    summary: {
      en: "Hilltop Rajput fortress renowned for the Sheesh Mahal mirror palace and Maota Lake.",
      hi: "अरावली पर्वतमाला पर स्थित भव्य राजपूत दुर्ग, शीश महल और जल प्रणालियों के लिए विख्यात।",
    },
    description: {
      en: "Perched majestically above Maota Lake, Amer Fort features opulent courtyards, marble pavilions, and the dazzling Sheesh Mahal constructed from convex Belgian glass mosaics that illuminate under single candle flame.",
      hi: "मावठा झील के ऊपर स्थित आमेर दुर्ग अपने शीश महल, भव्य गणेश पोल और राजपूत-मुगल स्थापत्य के अनुपम समन्वय के लिए विश्व प्रसिद्ध है।",
    },
    state: "Rajasthan",
    district: "Jaipur",
    regionId: "north",
    lat: 26.9855,
    lng: 75.8513,
    category: "monuments",
    period: "1592 CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "Part of UNESCO Hill Forts of Rajasthan cluster; apex of Rajput military & residential design.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Golf carts and ramps available at the Suraj Pol entrance; lift access to primary diwan courtyards.",
    },
    languages: ["en", "hi"],
    tags: ["rajput", "unesco", "hill-fort", "sheesh-mahal", "palace"],
    image: "/images/monuments/amer_fort.jpg",
    gallery: ["/images/monuments/amer_fort.jpg", festivalImg],
    images: ["/images/monuments/amer_fort.jpg", festivalImg],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Maintained under Department of Archaeology & Museums, Government of Rajasthan.",
    sources: [
      src("unesco-hillforts", "Hill Forts of Rajasthan", "UNESCO", 2013, "government"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-amer",
        name: "Shri Kripal Blue Pottery & Crafts",
        craft: "Blue Pottery & Festive Leheriya",
        contactNote: "Johari Bazaar & Amer Craft Route",
      },
    ],
    relatedTraditions: ["Jaipur Blue Pottery", "Leheriya tie-dye", "Teej festival"],
    architecturalStyle: "Rajput-Mughal Fusion Architecture",
    constructionEra: "c. 1592 CE (16th–17th Century CE)",
    patronDynasty: "Kachwaha Rajput Dynasty (Raja Man Singh I & Mirza Raja Jai Singh)",
    preservationScore: "93% Intact (Active conservation of Sheesh Mahal Belgian glass and water lift circuits)",
    visitorDetails: {
      timings: "08:00 AM – 05:30 PM (Day Visit); 06:30 PM – 09:15 PM (Night Tourism & Light Show)",
      entryFee: "₹100 for Indian Adults; ₹10 for Indian Students; ₹500 for Foreign Visitors",
      bestSeason: "October to March (Cool desert breeze; Teej festival in August)",
      photographyFee: "₹50 for still camera; ₹100 for video camera",
    },
    audioNarrationScript:
      "Perched upon the rugged Aravalli ridges above Maota Lake, Amer Palace unites imposing red sandstone fortifications with the radiant brilliance of the Sheesh Mahal mirror palace. Established in 1592 by Raja Man Singh, its marble courtyards and intricate frescoed gateways echo the chivalry and royal pageantry of the Rajputana era.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-19",
    slug: "sanchi-stupa",
    title: "Great Stupa at Sanchi (Sanchi Stupa Complex)",
    titles: {
      en: "Great Stupa at Sanchi",
      hi: "सांची का महान स्तूप, मध्य प्रदेश",
    },
    summary: {
      en: "Oldest surviving stone structure in India with monumental Buddhist torana gateways.",
      hi: "भारत की सबसे प्राचीन प्रस्तर संरचना, चार अलंकृत तोरण द्वारों और बुद्ध धातु अवशेषों से युक्त।",
    },
    description: {
      en: "Built originally under Emperor Ashoka in the 3rd century BCE, the Great Stupa is encircled by an ornate balustrade with four exquisitely carved ceremonial Torana gateways depicting Jataka tales and life of the Buddha.",
      hi: "सम्राट अशोक द्वारा 3री शताब्दी ई.पू. में स्थापित सांची स्तूप भारत की बौद्ध कला का प्राचीनतम केंद्र है, जिसके चार तोरण द्वार जातक कथाओं के जीवंत दृश्य प्रस्तुत करते हैं।",
    },
    state: "Madhya Pradesh",
    district: "Raisen",
    regionId: "central",
    lat: 23.4795,
    lng: 77.7397,
    category: "monuments",
    period: "3rd Century BCE",
    era: "ancient",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "UNESCO World Heritage Site; foundational benchmark for Buddhist art and stone architecture.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Paved ramps connect the museum, lower promenade, and circular circumambulation terrace.",
    },
    languages: ["en", "hi"],
    tags: ["buddhist", "unesco", "ashoka", "stupa", "mauryan"],
    image: "/images/monuments/sanchi_stupa.jpg",
    gallery: ["/images/monuments/sanchi_stupa.jpg", manuscriptImg],
    images: ["/images/monuments/sanchi_stupa.jpg", manuscriptImg],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Protected by ASI Central Circle; micro-biological crusting treated annually.",
    sources: [
      src("unesco-sanchi", "Buddhist Monuments at Sanchi", "UNESCO", 1989, "government"),
    ],
    stories: [],
    artisans: [
      {
        id: "ar-sanchi",
        name: "Narmada Gond Art & Tribal Crafts Co-op",
        craft: "Gond tribal canvases & terracotta wind bells",
        contactNote: "Tribal Cooperative, Bhopal & Sanchi Road",
      },
    ],
    relatedTraditions: ["Buddhist pilgrimage", "Gond narrative art", "Terracotta bell craft"],
    architecturalStyle: "Early Buddhist & Mauryan Monolithic Architecture",
    constructionEra: "3rd Century BCE to 1st Century CE",
    patronDynasty: "Mauryan Empire (Emperor Ashoka) & Shunga/Satavahana Dynasties",
    preservationScore: "95% Intact (Pristine stone torana gateways and hemispherical dome)",
    visitorDetails: {
      timings: "06:30 AM – 06:30 PM (Sunrise to Sunset daily)",
      entryFee: "₹40 for Indian & SAARC Citizens; ₹600 for Foreign Visitors; Free for Children under 15",
      bestSeason: "November to March (Pleasant Malwa plateau winter breeze; Chethiyagiri festival in Nov)",
      photographyFee: "Free for mobile devices; ₹25 for video cameras",
    },
    audioNarrationScript:
      "Commissioned by Emperor Ashoka in the third century BCE to enshrine sacred relics of the Buddha, the Great Stupa of Sanchi is India's oldest surviving monumental stone structure. Its four intricately sculpted torana gateways narrate the Jataka tales, marking the very dawn of classical Buddhist stone sculpture in ancient Asia.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-20",
    slug: "kedarnath-temple",
    title: "Kedarnath Temple",
    titles: {
      en: "Kedarnath Temple",
      hi: "श्री केदारनाथ ज्योतिर्लिंग मंदिर",
    },
    summary: {
      en: "Highest of the twelve sacred Shiva Jyotirlingas, perched at 3,584m in the Garhwal Himalayas.",
      hi: "गढ़वाल हिमालय में 3,584 मीटर की ऊँचाई पर स्थित भगवान शिव का सर्वोच्च ज्योतिर्लिंग।",
    },
    description: {
      en: "Perched at 3,584 metres near the Mandakini River source, Kedarnath was consecrated by Adi Shankaracharya and legendarily founded by the Pandavas. Built of massive interlocked granite blocks without mortar, it withstands Himalayan avalanches.",
      hi: "मंदाकिनी नदी के उद्गम के पास स्थित केदारनाथ मंदिर आदि शंकराचार्य द्वारा प्रतिष्ठित और पांडवों द्वारा स्थापित माना जाता है। बिना गारे के विशाल ग्रेनाइट पत्थरों से निर्मित यह धाम सदियों से सुरक्षित है।",
    },
    state: "Uttarakhand",
    district: "Rudraprayag",
    regionId: "north",
    lat: 30.7352,
    lng: 79.0669,
    category: "temple",
    period: "8th Century CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Primary Jyotirlinga and Chota Char Dham Himalayan pilgrimage shrine.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Helicopter services and pony/doli palanquins available from Gaurikund/Phata base.",
    },
    languages: ["en", "hi"],
    tags: ["jyotirlinga", "himalayas", "shiva", "shankaracharya", "temple"],
    image: "/images/monuments/kedarnath_temple.jpg",
    gallery: ["/images/monuments/kedarnath_temple.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship conserved by ASI and BKTC.",
    sources: [src("asi-kedarnath", "Shri Kedarnath Shrine Records", "ASI Dehradun Circle", 2014, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Char Dham Yatra", "Garhwali folk chants", "Rudra Abhishek"],
    architecturalStyle: "Garhwal Himalayan Nagara / Katyuri Stone Style",
    constructionEra: "8th Century CE (revived by Adi Shankaracharya; Pandava legendary origins)",
    patronDynasty: "Adi Shankaracharya & Katyuri Dynasty",
    patronMaker: "Adi Shankaracharya (re-consecration); Pandava lineage (mythological origins)",
    history: "Perched at 3,584 metres in the Garhwal Himalayas near the Mandakini River source, Kedarnath is the most sacred and highest among the twelve Jyotirlingas of Lord Shiva. According to the Mahabharata, the Pandavas sought Shiva to absolve the karma of the Kurukshetra war, where the Lord took the form of a cosmic bull whose hump materialized at this exact sacred site. Constructed from massive grey granite blocks interlocked with iron clamps without mortar, the temple has remarkably withstood centuries of harsh Himalayan avalanches and glacial floods.",
    coordinates: [79.0669, 30.7352],
    locationDetails: {
      state: "Uttarakhand",
      district: "Rudraprayag",
      nearestCity: "Gaurikund / Guptkashi",
      landmark: "Mandakini River valley, Garhwal Himalayas",
    },
    howToReach: {
      air: "Jolly Grant Airport Dehradun (238 km)",
      rail: "Rishikesh Railway Station (216 km) / Haridwar (240 km)",
      road: "Drive to Gaurikund via NH-107 -> 16 km mountain trek or helicopter service from Phata/Guptkashi/Sirsi.",
    },
    ticketAndTimings: "Darshan: 04:00 AM – 09:00 PM (Gates open Akshaya Tritiya in April/May to Bhai Dooj in October/November; temple closes during heavy sub-zero winter snowfall). Free general entry; VIP/Maha Abhishek bookings via Shri Badrinath Kedarnath Temple Committee (BKTC).",
    preservationScore: "95% Intact (Conserved by ASI and BKTC after 2013 floods)",
    visitorDetails: {
      timings: "04:00 AM – 09:00 PM (Seasonal: May to November)",
      entryFee: "Free general darshan; Special morning puja passes available via BKTC",
      bestSeason: "May to June & September to October (Avoid peak monsoon landslide risks)",
    },
    audioNarrationScript: "Standing resolute amidst the snow-capped Garhwal Himalayas at over 3,500 metres altitude, Kedarnath Temple is the highest of Shiva's twelve Jyotirlingas. Carved from massive interlocked grey granite blocks without mortar, its enduring stone walls bear witness to over a millennium of Himalayan faith and architectural resilience.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-21",
    slug: "kashi-vishwanath-temple",
    title: "Kashi Vishwanath Temple",
    titles: {
      en: "Kashi Vishwanath Temple",
      hi: "काशी विश्वनाथ मंदिर, वाराणसी",
    },
    summary: {
      en: "Spiritual epicentre of Hinduism with golden shikharas on the western banks of Ganga.",
      hi: "गंगा के पावन तट पर 800 किलो स्वर्ण-जड़ित शिखरों वाला सनातन धर्म का आध्यात्मिक केंद्र।",
    },
    description: {
      en: "Standing on the sacred banks of the River Ganga, Kashi Vishwanath is one of the twelve Jyotirlingas. Rebuilt in 1780 by Maharani Ahilyabai Holkar and crowned with gold by Maharaja Ranjit Singh, its modern corridor connects directly to the sacred Ganga ghats.",
      hi: "मां गंगा के तट पर स्थित काशी विश्वनाथ द्वादश ज्योतिर्लिंगों में प्रमुख है। 1780 में महारानी अहिल्याबाई होल्कर द्वारा पुनर्निर्मित और महाराजा रणजीत सिंह द्वारा स्वर्ण-मंडित यह पावन धाम आज भव्य गलियारे से सुसज्जित है।",
    },
    state: "Uttar Pradesh",
    district: "Varanasi",
    regionId: "north",
    lat: 25.3109,
    lng: 83.0107,
    category: "temple",
    period: "1780 CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Supreme Shiva Jyotirlinga and spiritual centre of Kashi Moksha tradition.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Fully paved pedestrian corridor with battery carts from Godowlia and Ganga ghat gates.",
    },
    languages: ["en", "hi"],
    tags: ["jyotirlinga", "kashi", "varanasi", "ganga", "temple"],
    image: "/images/monuments/kashi_vishwanath.jpg",
    gallery: ["/images/monuments/kashi_vishwanath.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship under Kashi Vishwanath Temple Trust & State Administration.",
    sources: [src("up-kashi", "Shri Kashi Vishwanath Dham Dossier", "Government of UP", 2021, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Ganga Aarti", "Banarasi silk weaving", "Kashi Vishwanath Mangala Aarti"],
    architecturalStyle: "Nagara Architecture (Quadrangle Sanctum with Gold Shikhara & Sabha Mandapa)",
    constructionEra: "1780 CE (Present sanctum; ancient Puranic origins spanning millennia)",
    patronDynasty: "Holkar Maratha Dynasty (Maharani Ahilyabai Holkar)",
    patronMaker: "Maharani Ahilyabai Holkar of Indore; modern corridor developed by Government of India (2021)",
    history: "Standing on the sacred western bank of the River Ganga in Varanasi, Kashi Vishwanath is revered as the spiritual capital of Hinduism, where Lord Shiva is believed to grant liberation (Moksha). After repeated medieval demolitions, the sanctum was resurrectively rebuilt in 1780 by the pious Maratha queen Maharani Ahilyabai Holkar of Indore, and its 15.5-metre spires were later adorned with 800 kilograms of pure gold leaf donated in 1839 by Maharaja Ranjit Singh of Punjab. The historic 2021 Kashi Vishwanath Corridor transformed the pilgrimage experience, providing an unobstructed 50,000-square-metre sacred pedestrian promenade connecting the Manikarnika and Lalita Ghats directly to the sanctum.",
    coordinates: [83.0107, 25.3109],
    locationDetails: {
      state: "Uttar Pradesh",
      district: "Varanasi",
      nearestCity: "Varanasi",
      landmark: "Vishwanath Gali, near Dashashwamedh and Manikarnika Ghats",
    },
    howToReach: {
      air: "Lal Bahadur Shastri Airport Varanasi (25 km)",
      rail: "Varanasi Junction (BSB) (4.5 km) / Banaras Railway Station (6 km)",
      road: "E-rickshaws to Godowlia Chowk -> Pedestrian corridor to Ganga Ghats & Vishwanath Dham.",
    },
    ticketAndTimings: "Darshan: 03:00 AM – 11:00 PM daily. Mangala Aarti at 03:00 AM, Bhog Aarti at 11:15 AM, Sandhya Aarti at 07:00 PM, Shringar Aarti at 09:00 PM. Free general entry; Sugam Darshan passes available online via temple trust.",
    preservationScore: "98% Pristine (State-of-the-art conservation & modern corridor development)",
    visitorDetails: {
      timings: "03:00 AM – 11:00 PM (Daily)",
      entryFee: "Free general darshan; Sugam Darshan: ₹300 (fast-track pass online)",
      bestSeason: "October to March (Pleasant winter weather along the Ganga ghats)",
    },
    audioNarrationScript: "At the eternal heart of Varanasi along the sacred River Ganga, the golden spires of Kashi Vishwanath enshrine the Jyotirlinga of Vishveshwara, the sovereign Lord of the Universe. Rebuilt by Maharani Ahilyabai Holkar and crowned with gold by Maharaja Ranjit Singh, this sanctuary stands as India's enduring symbol of spiritual renewal.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-22",
    slug: "meenakshi-sundareswarar-temple",
    title: "Meenakshi Sundareswarar Temple",
    titles: {
      en: "Meenakshi Sundareswarar Temple",
      ta: "மதுரை மீனாட்சி சுந்தரேசுவரர் கோயில்",
    },
    summary: {
      en: "Epicentre of Nayaka Dravidian architecture with 14 towering gopurams and Hall of 1,000 Pillars.",
      ta: "14 பிரம்மாண்ட கோபுரங்களும் ஆயிரங்கால் மண்டபமும் கொண்ட நாயக்கர் கால திராவிடக் கலைப் பொக்கிஷம்.",
    },
    description: {
      en: "Anchoring historic Madurai, this ancient complex dedicated to Goddess Meenakshi features fourteen vibrant gopurams, the celebrated Hall of Thousand Pillars with musical granite columns, and the sacred Golden Lotus Pond.",
      ta: "வைகை நதிக்கரையில் அமைந்துள்ள மதுரை மீனாட்சியம்மன் கோயில் பதினான்கு கோபுரங்கள், இசைத்தூண்கள் கொண்ட ஆயிரங்கால் மண்டபம் மற்றும் பொற்றாமரைக் குளத்துடன் திகழும் உலகப் புகழ் பெற்ற ஆலயமாகும்.",
    },
    state: "Tamil Nadu",
    district: "Madurai",
    regionId: "south",
    lat: 9.9195,
    lng: 78.1194,
    category: "temple",
    period: "1623–1655 CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Living masterpiece of Nayaka Dravidian architecture and home of the Chithirai festival.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Battery vehicles and ramps accessible through the East and South Rajagopuram entrances.",
    },
    languages: ["en", "ta"],
    tags: ["dravidian", "nayaka", "madurai", "meenakshi", "gopuram", "temple"],
    image: "/images/monuments/meenakshi_sundareswarar.jpg",
    gallery: ["/images/monuments/meenakshi_sundareswarar.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship impeccably maintained by HR&CE Department.",
    sources: [src("tn-meenakshi", "Arulmigu Meenakshi Sundareswarar Temple Guide", "HR&CE Tamil Nadu", 2020, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Chithirai Thiruvizha", "Sungudi saree weaving", "Nadaswaram temple music"],
    architecturalStyle: "Madurai Nayaka Dravidian Architecture",
    constructionEra: "1623–1655 CE (Current monumental complex; ancient Sangam origins dating to 6th Century BCE)",
    patronDynasty: "Madurai Nayaka Dynasty (King Tirumala Nayaka)",
    patronMaker: "King Tirumala Nayaka of the Madurai Nayaka Dynasty",
    history: "Anchoring the ancient lotus-shaped city of Madurai along the Vaigai River, Meenakshi Sundareswarar Temple is a crowning jewel of Dravidian architecture where Goddess Meenakshi holds primary ritual supremacy over Shiva. The sacred complex covers 14 acres surrounded by fourteen magnificent gopurams (gateway towers), the tallest southern tower soaring to 52 metres adorned with thousands of vibrantly sculpted stucco deities, celestial beings, and mythic figures. Inside lies the celebrated Hall of Thousand Pillars (Aayiram Kaal Mandapam) displaying 985 exquisitely carved granite pillars, along with five historic musical pillars that resonate with saptaswara notes when tapped.",
    coordinates: [78.1194, 9.9195],
    locationDetails: {
      state: "Tamil Nadu",
      district: "Madurai",
      nearestCity: "Madurai",
      landmark: "Central Madurai, south of Vaigai River",
    },
    howToReach: {
      air: "Madurai Airport (IXM) (12 km)",
      rail: "Madurai Junction (MDU) (1.5 km)",
      road: "Direct auto/taxis to central gopuram gates via West Veli & Netaji Road.",
    },
    ticketAndTimings: "Darshan: 05:00 AM – 12:30 PM & 04:00 PM – 10:00 PM. Free general darshan; Special darshan tickets ₹50–₹100; Thousand Pillar Hall museum ₹50. Traditional modest attire mandatory (dhoti/kurta for men, saree/salwar for women).",
    preservationScore: "97% Pristine (Living temple complex conserved by HR&CE Department)",
    visitorDetails: {
      timings: "05:00 AM – 12:30 PM & 04:00 PM – 10:00 PM (Daily)",
      entryFee: "Free general entry; Special Darshan: ₹50–₹100; Thousand Pillar Hall: ₹50",
      bestSeason: "October to March (Pleasant weather; Chithirai festival celebrated in April)",
    },
    audioNarrationScript: "Guarded by fourteen colossal gopurams encrusted with thousands of polychromatic stone sculptures, Madurai's Meenakshi Temple is the crown jewel of Nayaka Dravidian architecture. Here, within the legendary Hall of a Thousand Pillars and beside the sacred Golden Lotus Pond, living ritual and stone mastery have flourished unbroken for millennia.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-23",
    slug: "somnath-temple",
    title: "Somnath Temple",
    titles: {
      en: "Somnath Temple",
      gu: "સોમનાથ જ્યોતિર્લિંગ મંદિર",
    },
    summary: {
      en: "The first Jyotirlinga shrine of Lord Shiva, commanding the Arabian Sea shore of Saurashtra.",
      gu: "સૌરાષ્ટ્રના સાગરકાંઠે બિરાજમાન ભગવાન શિવનું પ્રથમ પાવન જ્યોતિર્લિંગ.",
    },
    description: {
      en: "Standing on the shores of the Arabian Sea in Prabhas Patan, Somnath is celebrated as the Eternal Shrine. Reconstructed sixteen times through history, its current Maru-Gurjara sandstone sanctum was revived in 1951 by Sardar Vallabhbhai Patel.",
      gu: "પ્રભાસ પાટણમાં અરબી સમુદ્રના તટે સ્થિત સોમનાથ બાર જ્યોતિર્લિંગોમાં પ્રથમ છે. સરદાર વલ્લભભાઈ પટેલના સંકલ્પથી નિર્મિત આ પવિત્ર ધામ ભારતીય સંસ્કૃતિની અવિનાશી શક્તિનું પ્રતીક છે.",
    },
    state: "Gujarat",
    district: "Gir Somnath",
    regionId: "west",
    lat: 20.8880,
    lng: 70.4013,
    category: "temple",
    period: "1951 CE",
    era: "modern",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "First of the twelve Jyotirlingas, symbolizing resilience of Indian civilization.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Smooth ramps, golf carts, and sea-view promenades accessible for elderly pilgrims.",
    },
    languages: ["en", "gu", "hi"],
    tags: ["jyotirlinga", "somnath", "gujarat", "shiva", "maru-gurjara", "temple"],
    image: "/images/monuments/somnath_temple.jpg",
    gallery: ["/images/monuments/somnath_temple.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship maintained by Shree Somnath Trust.",
    sources: [src("somnath-trust", "Shree Somnath Jyotirlinga Chronicles", "Shree Somnath Trust", 2022, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Triveni Sangam Snan", "Saurashtra bandhani craft", "Somnath Sandhya Aarti"],
    architecturalStyle: "Chaulukya / Maru-Gurjara Kailash Mahameru Prasad Style",
    constructionEra: "1951 CE (Modern revival; original Chaulukya foundations dating to 1st millennium CE)",
    patronDynasty: "Sardar Patel Trust revival; ancient Chaulukya / Solanki Dynasty",
    patronMaker: "Sardar Vallabhbhai Patel (reconstruction initiator), Prabhashankar Sompura (architect); ancient Chaulukya kings",
    history: "Revered as the first among the twelve holy Jyotirlingas, Somnath sits dramatically on the Saurashtra coast where the Arabian Sea crashes against its fortress-like sandstone walls. On its sea-facing promontory stands the historic Baan Stambh (Arrow Pillar), inscribed with the remarkable geodetic truth that an uninterrupted sea line extends from Somnath straight to Antarctica with zero landmass. Repeatedly raided and destroyed across centuries of foreign invasions, Somnath was rebuilt sixteen times, earning its status as the 'Eternal Shrine' symbolizing civilizational resilience, resurrected in 1951 through the vision of Sardar Vallabhbhai Patel and consecrated by India's first President, Dr. Rajendra Prasad.",
    coordinates: [70.4013, 20.8880],
    locationDetails: {
      state: "Gujarat",
      district: "Gir Somnath",
      nearestCity: "Veraval / Prabhas Patan",
      landmark: "Triveni Sangam coast, Prabhas Patan",
    },
    howToReach: {
      air: "Diu Airport (85 km) or Rajkot Airport (195 km)",
      rail: "Veraval Junction (7 km) / Somnath Railway Station (0.5 km)",
      road: "Regular state transport buses, highway connectivity via NH-51 and coastal highway.",
    },
    ticketAndTimings: "Darshan: 06:00 AM – 10:00 PM. Aarti at 07:00 AM, 12:00 PM, and 07:00 PM; 'Jay Somnath' Light & Sound show at 08:00 PM. Free entry; all electronic devices, cameras, and mobiles must be deposited at trust lockers.",
    preservationScore: "99% Pristine (Impeccably maintained shoreline sandstone complex by Shree Somnath Trust)",
    visitorDetails: {
      timings: "06:00 AM – 10:00 PM (Daily)",
      entryFee: "Free general entry; Sound & Light show: ₹30; Free cloaking for bags and electronics",
      bestSeason: "November to February (Pleasant Saurashtra winter breeze; Mahashivratri in February/March)",
    },
    audioNarrationScript: "Standing defiant against the crashing waves of the Arabian Sea, Somnath is the venerable first of the twelve Jyotirlingas of Lord Shiva. Renowned as the Eternal Shrine rebuilt sixteen times through epochs of history, its golden-hued Maru-Gurjara sandstone architecture stands as an indomitable symbol of India's cultural eternity.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-24",
    slug: "puri-jagannath-temple",
    title: "Puri Jagannath Temple",
    titles: {
      en: "Puri Jagannath Temple",
      bn: "পুরী জগন্নাথ মন্দির",
    },
    summary: {
      en: "Sacred Char Dham shrine on the Bay of Bengal, famous for wooden deities and the grand Ratha Yatra.",
      bn: "বঙ্গোপসাগরের তীরে অবস্থিত চারধামের অন্যতম পবিত্র ক্ষেত্র, রথযাত্রা ও মহাপ্রসাদের জন্য বিশ্বখ্যাত।",
    },
    description: {
      en: "Dating to the 12th century under the Eastern Ganga Dynasty, this soaring 65-metre Kalinga sanctuary houses Lord Jagannath, Balabhadra and Subhadra. It features the world's largest traditional temple kitchen feeding thousands daily.",
      bn: "দ্বাদশ শতাব্দীতে পূর্ব গঙ্গ বংশের আমলে নির্মিত এই ৬৫ মিটার উচ্চ কলিঙ্গ স্থাপত্যের মন্দির ভগবান জগন্নাথ, বলভদ্র ও সুভদ্রার আবাস। এর প্রাচীন রন্ধনশালা প্রতিদিন হাজার হাজার ভক্তকে মহাপ্রসাদ যোগায়।",
    },
    state: "Odisha",
    district: "Puri",
    regionId: "east",
    lat: 19.8049,
    lng: 85.8179,
    category: "temple",
    period: "12th Century CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Char Dham pilgrimage site, sanctuary of Nabakalebara and world-renowned Ratha Yatra.",
    accessibility: {
      wheelchair: false,
      audioGuide: true,
      signLanguage: false,
      notes: "Battery vehicles available on Grand Road; inner Anand Bazar accessible via Singhadwara.",
    },
    languages: ["en", "bn", "hi"],
    tags: ["jagannath", "char-dham", "puri", "kalinga", "ratha-yatra", "temple"],
    image: "/images/monuments/puri_jagannath.jpg",
    gallery: [festivalImg, heroHeritage],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship conserved under Shree Jagannath Temple Administration & ASI.",
    sources: [src("odisha-jagannath", "Shree Jagannath Temple Administration Manual", "Government of Odisha", 2022, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Puri Ratha Yatra", "Mahaprasad preparation", "Pattachitra painting of Raghurajpur"],
    architecturalStyle: "Kalinga Architecture (Reha Deula, Jagamohana, Natamandapa, Bhogamandapa)",
    constructionEra: "12th Century CE (c. 1161 CE)",
    patronDynasty: "Eastern Ganga Dynasty (King Anantavarman Chodaganga)",
    patronMaker: "King Anantavarman Chodaganga & King Anangabhima Deva of the Eastern Ganga Dynasty",
    history: "One of the sacred Char Dham pilgrimage destinations, the Jagannath Temple at Puri rises 65 metres high near the Bay of Bengal, enshrining holy neem-wood deities that undergo ritual rebirth (Nabakalebara) every 12 to 19 years. The temple is famed for architectural and atmospheric wonders: its sacred Nilachakra flag flutters counter to the prevailing coastal wind, no shadows are cast on the ground at high noon, and birds never fly over the sanctum dome. Its ancient Rosaghara is the world's largest traditional kitchen, where hundreds of sevayats cook Chhappan Bhog (56 delicacies) in stacked earthen pots over wood fires to nourish thousands at the sacred Ananda Bazar.",
    coordinates: [85.8179, 19.8049],
    locationDetails: {
      state: "Odisha",
      district: "Puri",
      nearestCity: "Puri",
      landmark: "Grand Road (Bada Danda), Puri Town",
    },
    howToReach: {
      air: "Biju Patnaik International Airport Bhubaneswar (60 km)",
      rail: "Puri Railway Station (PURI) (2.5 km)",
      road: "Direct four-lane NH-316 highway corridor from Bhubaneswar.",
    },
    ticketAndTimings: "Darshan: 05:00 AM – 11:00 PM. Dwaraphita at 05:00 AM; Pahuda at 11:00 PM. Free general entry (entry restricted to practicing Hindus according to ancient custom); Mahaprasad served daily from 01:00 PM at Ananda Bazar.",
    preservationScore: "94% Intact (Active conservation of Kalinga sandstone by ASI & Temple Administration)",
    visitorDetails: {
      timings: "05:00 AM – 11:00 PM (Daily)",
      entryFee: "Free general entry (Strict traditional dress code; Hindus only)",
      bestSeason: "October to March (Comfortable coastal temperatures; Ratha Yatra in June/July)",
    },
    audioNarrationScript: "Rising sixty-five metres above the Bay of Bengal coast, the ancient Jagannath Temple at Puri is one of India's four sacred Char Dham shrines. Famous for its monumental Ratha Yatra chariot festival and its sacred wood-fired kitchen feeding tens of thousands daily, this Kalinga marvel embodies living devotion across nine centuries.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-25",
    slug: "tirupati-venkateswara-temple",
    title: "Tirupati Venkateswara Temple",
    titles: {
      en: "Tirupati Venkateswara Temple",
      hi: "तिरुपति बालाजी मंदिर, तिरुमला",
    },
    summary: {
      en: "Sacred sanctuary of Lord Balaji atop the Seven Hills with the golden Ananda Nilayam tower.",
      hi: "सात पहाड़ियों पर स्थित कलियुग के वैकुंठपति भगवान वेंकटेश्वर का स्वर्ण मंडित पावन धाम।",
    },
    description: {
      en: "Located on the sacred Seshachalam Hills, Sri Venkateswara Temple is the world's most visited spiritual shrine. Enshrining the self-manifested Swayambhu deity beneath the gilded Ananda Nilayam Vimana, it has been patronized by Chola, Pallava, and Vijayanagara emperors.",
      hi: "शेषाचलम की पहाड़ियों पर स्थित तिरुमला बालाजी मंदिर विश्व का सर्वाधिक दर्शनार्थी तीर्थ है। चोल, पल्लव और विजयनगर राजाओं द्वारा संवर्धित इस मंदिर का स्वर्ण विमान 'आनंद निलયમ' दर्शनीय है।",
    },
    state: "Andhra Pradesh",
    district: "Tirupati",
    regionId: "south",
    lat: 13.6833,
    lng: 79.3474,
    category: "temple",
    period: "Circa 300 CE",
    era: "ancient",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Most visited pilgrimage site on earth; pinnacle of Vijayanagara and Dravidian temple patronage.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Dedicated queues, elevators, and battery-operated carts for senior citizens and disabled devotees.",
    },
    languages: ["en", "hi", "ta"],
    tags: ["tirupati", "balaji", "venkateswara", "dravidian", "temple"],
    image: "/images/monuments/tirupati_venkateswara.jpg",
    gallery: ["/images/monuments/tirupati_venkateswara.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship managed by Tirumala Tirupati Devasthanams (TTD).",
    sources: [src("ttd-tirupati", "Sri Venkateswara Temple Monograph", "TTD Tirupati", 2023, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Srivari Brahmotsavam", "Tirupati Laddu Prasadam", "Vedic chanting by Vaikhanasa priests"],
    architecturalStyle: "Dravidian Architecture (Gilded Ananda Nilayam Vimana & Chola-Vijayanagara Mandapas)",
    constructionEra: "Circa 300 CE onwards (Expanded across 12th–16th Centuries CE)",
    patronDynasty: "Pallava, Chola, and Vijayanagara Empires (Emperor Sri Krishnadevaraya)",
    patronMaker: "Patronized by Pallavas, Cholas, and extensively expanded by Sri Krishnadevaraya of Vijayanagara",
    history: "Enthroned amidst the sacred Seven Hills of Seshachalam in Tirumala, the Tirupati Venkateswara Temple is the most visited spiritual sanctuary on earth, revered as the Vaikuntha of Kali Yuga where Vishnu manifested to grant solace. The sanctum features the magnificent Ananda Nilayam Vimana, a three-tiered golden tower hovering over the self-manifested (Swayambhu) black stone deity adorned with precious gemstones and fragrant flower garlands. Devotees participate in sacred tonsuring (Kalyanakatta) and receive the renowned GI-tagged Tirupati Laddu Prasadam, with offerings supporting extensive complimentary pilgrim dining halls, free hospitals, and educational trusts.",
    coordinates: [79.3474, 13.6833],
    locationDetails: {
      state: "Andhra Pradesh",
      district: "Tirupati (erstwhile Chittoor)",
      nearestCity: "Tirupati",
      landmark: "Tirumala Hills, Seshachalam Range",
    },
    howToReach: {
      air: "Tirupati Airport (TIR) (40 km) / Chennai International Airport (MAA) (140 km)",
      rail: "Tirupati Main Railway Station (TPTY) (22 km) / Renigunta Junction (RU) (30 km)",
      road: "Dedicated twin ghat roads with APSRTC electric/diesel buses, or scenic pedestrian footpaths via Alipiri (3,550 steps) and Srivari Mettu.",
    },
    ticketAndTimings: "Darshan: 03:00 AM – 01:30 AM (Open ~22 hours daily). Free Sarvadarshanam (SSD token) or ₹300 Special Entry Darshan (SED booked online via TTD portal). Strict traditional attire mandatory (dhoti/pyjama with upper cloth for men; saree/half-saree/churidar with dupatta for women).",
    preservationScore: "99% Pristine (World-class crowd management & heritage conservation by TTD)",
    visitorDetails: {
      timings: "03:00 AM – 01:30 AM (Open nearly 22 hours daily)",
      entryFee: "Free Sarvadarshanam; Special Entry Darshan: ₹300 (Advance online booking required)",
      bestSeason: "September to February (Cooler hill climate; annual Brahmotsavam in September/October)",
    },
    audioNarrationScript: "Enshrined high atop the sacred Seven Hills of Tirumala, Sri Venkateswara Temple is the most visited religious sanctuary on earth. Crowning the sanctum is the dazzling golden Ananda Nilayam Vimana, beneath which the Lord of the Seven Hills has received the devotion and royal patronages of Chola, Pallava, and Vijayanagara emperors for over a millennium.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-26",
    slug: "kailasa-temple-ellora",
    title: "Kailasa Temple (Cave 16, Ellora)",
    titles: {
      en: "Kailasa Temple (Cave 16, Ellora)",
      hi: "कैलाश मंदिर, एलोरा गुफा १६",
      mr: "कैलास मंदिर (वेरूळ लेणी १६)",
    },
    summary: {
      en: "World's largest monolithic rock-cut monument, carved top-down from a single basalt cliff.",
      hi: "एकल विशाल बेसाल्ट चट्टान को ऊपर से नीचे तराशकर बनाया गया विश्व का सबसे बड़ा एकाश्म मंदिर।",
      mr: "एकाच कातळातून वरून खाली कोरलेले जगातील सर्वात मोठे अखंड पाषाणातील भव्य मंदिर.",
    },
    description: {
      en: "Carved from a vertical basalt cliff by King Krishna I of the Rashtrakutas, Kailasa Temple required removing 200,000 tonnes of rock without joints or mortar. It features monumental victory pillars and dynamic Ramayana panels.",
      hi: "राष्ट्रकूट राजा कृष्ण प्रथम द्वारा 8वीं शताब्दी में निर्मित, यह मंदिर 2 लाख टन बेसाल्ट पत्थर काटकर बनाया गया। इसमें रावण द्वारा कैलाश पर्वत हिलाने का विख्यात भित्तिशिल्प मौजूद है।",
      mr: "राष्ट्रकूट राजा कृष्ण पहिला यांच्या काळात निर्माण झालेले हे स्थापत्य आश्चर्य एकाच अखंड खडकातून कोरले गेले आहे.",
    },
    state: "Maharashtra",
    district: "Chhatrapati Sambhaji Nagar",
    regionId: "west",
    lat: 20.0238,
    lng: 75.1780,
    category: "temple",
    period: "8th Century CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: false,
    significance: "UNESCO World Heritage Site; pinnacle of monolithic rock-cut architecture globally.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Paved pathways from ticket counter to Cave 16 forecourt; lower courtyard wheelchair accessible.",
    },
    languages: ["en", "hi", "mr"],
    tags: ["unesco", "ellora", "kailasa", "monolithic", "rashtrakuta", "temple"],
    image: "/images/monuments/kailasa_ellora.jpg",
    gallery: ["/images/monuments/kailasa_ellora.jpg"],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Safe",
    preservationNote: "UNESCO World Heritage site protected and conserved by ASI Western Circle.",
    sources: [src("unesco-ellora", "Ellora Caves Conservation Records", "UNESCO & ASI", 1983, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Paithani silk weaving of Aurangabad", "Himroo weaving craft", "Ellora-Ajanta Festival"],
    architecturalStyle: "Monolithic Rock-cut Dravidian / Rashtrakuta Architecture",
    constructionEra: "8th Century CE (756–773 CE)",
    patronDynasty: "Rashtrakuta Dynasty (King Krishna I)",
    patronMaker: "King Krishna I of the Rashtrakuta Dynasty",
    history: "Considered the zenith of monolithic rock-cut engineering worldwide, Kailasa Temple at Ellora (Cave 16) was carved top-down from a vertical basalt cliff face, scooping out over 200,000 tonnes of volcanic stone without cranes, mortar, or scaffolding. Commissioned by Rashtrakuta King Krishna I to recreate Mount Kailash on earth, the temple rises across two storeys featuring a 32-metre vimana, life-sized carved war elephants, and two freestanding 15-metre victory pillars (Dhvaja Stambhas). Its monumental bas-reliefs depict high drama from Indian epics, including the celebrated panel of Demon King Ravana attempting to shake Mount Kailash while Shiva serenely stabilizes the cosmos with his toe.",
    coordinates: [75.1780, 20.0238],
    locationDetails: {
      state: "Maharashtra",
      district: "Chhatrapati Sambhaji Nagar (Aurangabad)",
      nearestCity: "Ellora / Khuldabad",
      landmark: "Ellora Caves Complex, Cave 16",
    },
    howToReach: {
      air: "Aurangabad Airport (IXU) (35 km)",
      rail: "Chhatrapati Sambhaji Nagar Railway Station (30 km)",
      road: "Smooth highway connection via MH SH-22 with tourist coaches and private taxis from Chhatrapati Sambhaji Nagar.",
    },
    ticketAndTimings: "Timings: 06:00 AM – 06:00 PM (Closed on Tuesdays). Entry fee: ₹40 for Indian/BIMSTEC citizens; ₹600 for Foreign tourists; Free for children under 15 years. Best season: October to March.",
    preservationScore: "96% Intact (Rock-cut basalt longevity; continuous conservation by ASI)",
    visitorDetails: {
      timings: "06:00 AM – 06:00 PM (Closed on Tuesdays)",
      entryFee: "₹40 for Indian & BIMSTEC Citizens; ₹600 for Foreign Visitors; Free for Children under 15",
      bestSeason: "October to March (Comfortable sightseeing weather; Ellora-Ajanta Festival in January)",
    },
    audioNarrationScript: "Carved top-down from a single colossal volcanic basalt cliff without joints or mortar, Kailasa Temple at Ellora is humanity's greatest rock-cut architectural marvel. Commissioned in the eighth century by Rashtrakuta King Krishna the First, this monolithic masterpiece scooped away two hundred thousand tons of solid rock to recreate Mount Kailash on earth.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "hs-27",
    slug: "ramanathaswamy-temple-rameswaram",
    title: "Ramanathaswamy Temple",
    titles: {
      en: "Ramanathaswamy Temple",
      ta: "இராமேஸ்வரம் இராமநாதசுவாமி கோயில்",
    },
    summary: {
      en: "Island Jyotirlinga shrine boasting the longest pillared corridor in the world with 1,212 columns.",
      ta: "1,212 தூண்களைக் கொண்ட உலகின் மிக நீளமான திருச்சுற்றுப் பாதையைக் கொண்ட புனிதத் தலம்.",
    },
    description: {
      en: "Situated on holy Rameswaram Island, Ramanathaswamy Temple is one of the twelve Jyotirlingas and four Char Dhams. It is celebrated for its 1.2-kilometre third corridor supported by 1,212 carved granite pillars and 22 sacred water theerthams.",
      ta: "இராமேஸ்வரம் தீவில் அமைந்துள்ள இந்த சிவாலயம் ஜோதிர்லிங்கமாகவும், நான்கு திருத்தலங்களில் ஒன்றாகவும் திகழ்கிறது. 22 புண்ணிய தீர்த்தங்களும் 1,212 அழகிய தூண்களும் இதன் தனிச்சிறப்பாகும்.",
    },
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    regionId: "south",
    lat: 9.2881,
    lng: 79.3174,
    category: "temple",
    period: "12th Century CE",
    era: "medieval",
    kind: "physical",
    unesco: false,
    intangibleListed: false,
    significance: "Char Dham island shrine, Jyotirlinga, and world record for longest carved temple corridors.",
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Wheelchairs permitted along the broad outer corridor; beach and Kund approach assisted.",
    },
    languages: ["en", "ta"],
    tags: ["jyotirlinga", "char-dham", "rameswaram", "dravidian", "temple"],
    image: "/images/monuments/ramanathaswamy_temple.jpg",
    gallery: [heroHeritage, performanceImg],
    tourAvailable: true,
    preservation: "safe",
    preservationState: "Active Place of Worship",
    preservationNote: "Active Place of Worship conserved by HR&CE Tamil Nadu and ASI.",
    sources: [src("tn-rameswaram", "Arulmigu Ramanathaswamy Temple Monograph", "HR&CE Tamil Nadu", 2021, "government")],
    stories: [],
    artisans: [],
    relatedTraditions: ["Agni Theertham Snan", "Palm leaf shell craft of Rameswaram", "Spatika Linga Puja"],
    architecturalStyle: "Dravidian Architecture (World's Longest Outer Corridor & Soaring Gopurams)",
    constructionEra: "12th Century CE (Expanded by Pandya and Jaffna Sethupathi rulers through 18th Century)",
    patronDynasty: "Pandya Dynasty & Sethupathi Rulers of Ramnad",
    patronMaker: "Pandya Dynasty and Jaffna kings of Sethupathi lineage (King Muthuramalinga Sethupathi)",
    history: "Perched on the holy island of Rameswaram, Ramanathaswamy Temple is both one of the four sacred Char Dham destinations and one of the twelve divine Jyotirlingas, revered as the holy site where Lord Rama consecrated a Shiva Linga crafted by Sita to seek atonement following his victory over Ravana. The temple is universally celebrated for housing the longest pillared corridor in the world, with its outer third corridor stretching 1,212 metres lined by 1,212 intricately sculpted monolithic granite pillars. Before entering the sanctum, pilgrims traditionally take holy dips in twenty-two sacred theerthams (water kunds) within the temple compound, each containing fresh water with documented mineral compositions.",
    coordinates: [79.3174, 9.2881],
    locationDetails: {
      state: "Tamil Nadu",
      district: "Ramanathapuram",
      nearestCity: "Rameswaram",
      landmark: "Rameswaram Island, eastern tip facing Gulf of Mannar",
    },
    howToReach: {
      air: "Madurai Airport (IXM) (175 km)",
      rail: "Rameswaram Railway Station (RMM) (2 km)",
      road: "Scenic coastal highway crossing the historic Pamban Bridge road corridor linking Mandapam to Rameswaram Island.",
    },
    ticketAndTimings: "Darshan: 05:00 AM – 01:00 PM & 03:00 PM – 09:00 PM daily. 22 holy kund theertham bathing: 05:30 AM – 12:00 PM. Free general entry; Special Darshan ₹50; Spatika Linga Darshan 05:00 AM – 06:00 AM.",
    preservationScore: "96% Pristine (Protected island sanctuary conserved by HR&CE and ASI)",
    visitorDetails: {
      timings: "05:00 AM – 01:00 PM & 03:00 PM – 09:00 PM (Daily)",
      entryFee: "Free general entry; Special Darshan: ₹50; Theertham bathing guide fee: ₹25",
      bestSeason: "October to March (Gentle sea breeze; Mahashivratri and Arudra Darshanam in winter)",
    },
    audioNarrationScript: "Situated where the Indian Ocean meets the Bay of Bengal on Rameswaram Island, Ramanathaswamy Temple unites Char Dham holiness with the cosmic presence of a Jyotirlinga. With its breathtaking third corridor stretching over one point two kilometres supported by twelve hundred carved granite pillars, it stands as one of the triumphs of Dravidian sacred architecture.",
    dataOrigin: "demo",
    updatedAt: "2026-09-25",
  },
  {
    id: "chola-bronze-stone",
    slug: "chola-bronze-stone",
    title: "Chola Bronze & Stone",
    name: "Chola Bronze & Stone",
    titles: {
      en: "Chola Bronze & Stone",
      hi: "चोल कांस्य और पाषाण",
      ta: "சோழர் வெண்கலமும் கல்லும்",
    },
    summary: {
      en: "Imperial Chola lost-wax bronze casting and hard granite monolithic sculpting from the Kaveri basin.",
      hi: "कावेरी घाटी से शाही चोल लुप्त-मोम कांस्य ढलाई और कठोर ग्रेनाइट एकाश्मीय मूर्तिकला।",
      ta: "காவிரிப் படுகையின் சோழர் கால மெழுகு வார்ப்பு வெண்கலமும் கருங்கல் சிற்பக் கலையும்.",
    },
    description: {
      en: "The zenith of Dravidian metallurgical mastery, Chola bronzes represent an unbroken lineage of lost-wax casting (cire perdue) nurtured along the Kaveri river banks. Created according to strict mathematical canons of the Shilpa Shastras, these hollow-cast and solid Panchaloha masterpieces—most famously the Nataraja embodying the cosmic cycle of creation and dissolution—are celebrated globally for their rhythmic kinetic poise, sensual anatomical elegance, and intricate ornamentation. Paired with monumental metamorphic granite relief sculptures, they epitomize the spiritual and artistic sovereignty of the Imperial Chola epoch.",
    },
    significance: "Imperial Chola lost-wax bronze casting and hard granite monolithic sculpting from the Kaveri basin.",
    state: "Tamil Nadu",
    district: "Thanjavur",
    regionId: "reg-south",
    lat: 10.7828,
    lng: 79.1318,
    category: "crafts",
    period: "9th–13th century CE",
    era: "medieval",
    kind: "physical",
    unesco: true,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Foundry workshops in Swamimalai and Thanjavur offer guided tactile demonstrations.",
    },
    languages: ["en", "ta", "hi"],
    tags: ["Lost-Wax Casting", "Panchaloha", "Granite Relief", "Imperial Chola", "Nataraja"],
    image: "/images/heritage/chola_bronze_stone.jpg",
    gallery: [
      "/images/heritage/chola_bronze_stone.jpg",
    ],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Living hereditary lineage of Sthapathis protected under Geographical Indication and state craft guilds.",
    sources: [
      {
        id: "src-chola-1",
        title: "South Indian Bronzes and Architectural Canons",
        publisher: "Archaeological Survey of India",
        year: 2024,
        url: "https://asi.nic.in",
        kind: "government",
      },
    ],
    stories: [],
    artisans: [
      {
        id: "art-chola-1",
        name: "Master Sthapathi Rajan",
        craft: "Panchaloha Bronze Casting",
        contactNote: "Swamimalai Hereditary Bronze Guild",
      },
    ],
    relatedTraditions: ["brihadisvara-temple-thanjavur", "kanchipuram-silk-weaving"],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  },
  {
    id: "delta-song-and-scroll",
    slug: "delta-song-and-scroll",
    title: "Delta Song & Scroll",
    name: "Delta Song & Scroll",
    titles: {
      en: "Delta Song & Scroll",
      hi: "डेल्टा गीत और पट",
      ta: "காவேரி கதைப் பட்டு சுருள்",
    },
    summary: {
      en: "Hand-painted narrative textile scrolls synchronized with oral folk epics and riverine ballads.",
      hi: "मौखिक लोक महाकाव्यों और नदी गीतों के साथ समन्वित हस्तनिर्मित आख्यानात्मक वस्त्र स्क्रॉल।",
      ta: "வாய்மொழி காவியங்களோடும் ஆற்றுப் பாடல்களோடும் இணைந்த கையால் வரையப்பட்ட பட்டு சுருள்கள்.",
    },
    description: {
      en: "An ancient audiovisual storytelling medium of Southern riverine deltas, the 'Song and Scroll' lineage weaves painted fabric narratives with sung oral epics. Nomadic storytellers and temple balladeers unrolled massive, vegetable-dyed cotton scrolls—rendered with a bamboo kalam using natural mineral pigments, iron rust, and myrobalan mordants—to accompany melodious Harikatha and seasonal agricultural ballads. Each horizontal register depicts episodes from the epics and regional folklore, transforming visual textile craftsmanship into a participatory community performance of song, memory, and heritage preservation.",
    },
    significance: "Hand-painted narrative textile scrolls synchronized with oral folk epics and riverine ballads.",
    state: "Tamil Nadu",
    district: "Thanjavur",
    regionId: "reg-south",
    lat: 10.9602,
    lng: 79.3845,
    category: "performing-arts",
    period: "Ancient & Medieval",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: true,
      notes: "Auditory narrative storytelling sessions with visual tactile scrolls.",
    },
    languages: ["en", "ta", "hi"],
    tags: ["Kalamkari", "Temple Scrolls", "Harikatha", "Folk Ballads", "Natural Pigments"],
    image: "/images/heritage/delta_song_scroll.jpg",
    gallery: [
      "/images/heritage/delta_song_scroll.jpg",
    ],
    tourAvailable: true,
    preservation: "attention",
    preservationNote: "Living tradition preserved by nomadic bards and temple cooperatives.",
    sources: [
      {
        id: "src-dss-1",
        title: "Kaveri Basin Folk Narratives Archive",
        publisher: "IGNCA",
        year: 2023,
        url: "https://ignca.gov.in",
        kind: "academic",
      },
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["brihadisvara-temple-thanjavur"],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  },
  {
    id: "desert-dye-route",
    slug: "desert-dye-route",
    title: "Desert Dye Route",
    name: "Desert Dye Route",
    titles: {
      en: "Desert Dye Route",
      hi: "रेगिस्तानी रंग मार्ग",
      gu: "અજરખ અને દાબુ રેગિસ્તાન માર્ગ",
    },
    summary: {
      en: "Arid-zone resist printing and natural indigo-madder textile heritage across historic caravan pathways.",
      hi: "ऐतिहासिक कारवां मार्गों पर शुष्क-क्षेत्र प्रतिरोध छपाई और प्राकृतिक नील-मजीठ कपड़ा विरासत।",
      gu: "ઐતિહાસિક કાફલા માર્ગો પર શુષ્ક-વિસ્તાર પ્રતિકારક પ્રિન્ટિંગ અને કુદરતી ગળી-મજીઠ વસ્ત્ર ધરોહર.",
    },
    description: {
      en: "Stretching across the arid sands of Kutch and the Thar Desert, the Desert Dye Route chronicles centuries of nomadic pastoralist trade, mineral alchemy, and geometric resist printing. Centered on legendary crafts like Ajrakh and Dabu, artisans hand-stamp unbleached cotton using hand-chiseled wooden blocks and mud-gum resists before submerging them in biological indigo and wild madder vats. Designed to reflect the cosmological harmony of desert stars and oasis water, these textiles were historically traded across ancient caravan pathways, standing as enduring symbols of ecological resourcefulness and tactile geometry.",
    },
    significance: "Arid-zone resist printing and natural indigo-madder textile heritage across historic caravan pathways.",
    state: "Gujarat",
    district: "Kutch",
    regionId: "reg-west",
    lat: 23.3441,
    lng: 69.6693,
    category: "crafts",
    period: "Medieval to Present",
    era: "living",
    kind: "physical",
    unesco: true,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Ajrakhpur artisanal cooperative workshop is wheelchair accessible.",
    },
    languages: ["en", "gu", "hi"],
    tags: ["Ajrakh", "Dabu Resist", "Natural Indigo", "Hand Block Printing", "Thar Desert"],
    image: "/images/heritage/desert_dye_route.jpg",
    gallery: [
      "/images/heritage/desert_dye_route.jpg",
    ],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "GI Tag protected, actively exported through artisan cooperatives.",
    sources: [
      {
        id: "src-ddr-1",
        title: "Textiles of Kutch and Thar Desert",
        publisher: "Crafts Council of India",
        year: 2024,
        url: "https://craftscouncilofindia.org",
        kind: "community",
      },
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["bandhani-kutch", "rani-ki-vav-patan"],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  },
  {
    id: "bandhani-kutch",
    slug: "bandhani-kutch",
    title: "Bandhani Tie-Dye of Kutch",
    name: "Bandhani Tie-Dye of Kutch",
    titles: {
      en: "Bandhani Tie-Dye of Kutch",
      hi: "कच्छ की बांधणी टाई-डाई",
      gu: "બાંધણી (કચ્છ)",
    },
    summary: {
      en: "Centuries-old resist tie-dye art of Kutch, producing intricate dot constellations using fingernail-plucked thread resists.",
      hi: "कच्छ की सदियों पुरानी रेज़िस्ट टाई-डाई कला, नाखूनों से धागों को बांधकर जटिल बिंदु विन्यास बनाती है।",
      gu: "નખથી દોરા બાંધીને ઝીણી બિંદુઓની ભાત બનાવતી કચ્છની પ્રાચીન બાંધણી કળા.",
    },
    description: {
      en: "Practiced primarily by the Khatri community across Kutch and Saurashtra, Bandhani (derived from the Sanskrit 'Bandh' meaning to tie) is one of the world's oldest resist-dyeing traditions. Artisans use pointed fingernails or metal rings to pluck pinpoint folds of fine silk, georgette, or muslin into tiny knots bound tightly with waxed cotton thread. When immersed in successive baths of natural madder, pomegranate, and indigo, the bound areas resist color absorption. The unpicked textile reveals kaleidoscopic patterns of dots (bindi), paisleys (kodi), and waves (leheriya), celebrated for their distinctive crinkled texture and auspicious wedding significance.",
    },
    significance: "Centuries-old resist tie-dye art of Kutch, producing intricate dot constellations using fingernail-plucked thread resists.",
    state: "Gujarat",
    district: "Kutch",
    regionId: "reg-west",
    lat: 23.242,
    lng: 69.6669,
    category: "crafts",
    period: "6th Century BCE to Present",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Artisanal workshops in Bhuj and Mandvi are ground-level and accessible.",
    },
    languages: ["en", "gu", "hi"],
    tags: ["Tie-Dye", "Khatri Community", "Resist Dyeing", "Natural Dyes", "Kutch Heritage", "GI Registered"],
    image: "/images/crafts/bandhani_kutch.jpg",
    gallery: [
      "/images/crafts/bandhani_kutch.jpg",
    ],
    images: [
      "/images/crafts/bandhani_kutch.jpg",
    ],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Geographical Indication (GI) Registered, actively preserved by Khatri artisan guilds.",
    sources: [
      {
        id: "src-bandhani-1",
        title: "Crafts of Gujarat: Bandhani Traditions",
        publisher: "Gujarat State Handloom and Handicrafts Development Corporation",
        year: 2024,
        url: "https://gurjari.gujarat.gov.in",
        kind: "government",
      },
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["desert-dye-route", "rani-ki-vav-patan"],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  },
  {
    id: "kanchipuram-silk-weaving",
    slug: "kanchipuram-silk-weaving",
    title: "Kanchipuram Silk Weaving",
    name: "Kanchipuram Silk Weaving",
    titles: {
      en: "Kanchipuram Silk Weaving",
      hi: "कांचीपुरम रेशम बुनाई",
      ta: "காஞ்சிபுரம் பட்டு நெசவு",
    },
    summary: {
      en: "Heavy mulberry silk sarees renowned for interlocking contrasting borders woven with pure gold and silver zari.",
      hi: "शुद्ध सोने और चांदी की ज़री से बुने जाने वाले विपरीत किनारों के लिए प्रसिद्ध भारी शहतूत रेशम साड़ियां।",
      ta: "தங்க-வெள்ளி ஜரிகையுடன் முப்பெரும் கோர்வை முறையில் நெய்யப்படும் காஞ்சிபுரம் பட்டு சேலைகள்.",
    },
    description: {
      en: "Woven on traditional wooden pit looms by hereditary weaver communities tracing their descent to Sage Markanda, Kanchipuram silk sarees represent the pinnacle of South Indian handloom mastery. Crafted from three-ply mulberry silk yarn twisted with pure silver electroplated in 24k gold zari, these textiles are distinguished by the 'Korvai' technique—where the contrasting body and border are woven separately and interlocked seamlessly using a specialized three-shuttle interlocking process. The motifs draw directly from Chola and Pallava temple iconography, featuring temple gopuram spires (Thazhampoo rekku), floral creepers (kodi visiri), celestial swans (annapakshi), and mythical winged beasts (yali).",
    },
    significance: "Heavy mulberry silk sarees renowned for interlocking contrasting borders woven with pure gold and silver zari.",
    state: "Tamil Nadu",
    district: "Kanchipuram",
    regionId: "reg-south",
    lat: 12.8342,
    lng: 79.7036,
    category: "crafts",
    period: "10th Century CE to Present",
    era: "living",
    kind: "intangible",
    unesco: false,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Weaver service center and cooperative handloom pavilions in Kanchipuram are accessible.",
    },
    languages: ["en", "ta", "hi"],
    tags: ["Mulberry Silk", "Zari", "Korvai Technique", "Temple Borders", "Dravidian Heritage", "GI Registered"],
    image: "/images/crafts/kanchipuram_silk.jpg",
    gallery: [
      "/images/crafts/kanchipuram_silk.jpg",
    ],
    images: [
      "/images/crafts/kanchipuram_silk.jpg",
    ],
    tourAvailable: true,
    preservation: "safe",
    preservationNote: "Geographical Indication (GI) Registered; guaranteed purity through Silk Mark & cooperative society monitoring.",
    sources: [
      {
        id: "src-kanchi-1",
        title: "Kanchipuram Silk Geographical Indication Dossier",
        publisher: "Geographical Indications Registry, Government of India",
        year: 2005,
        url: "https://ipindia.gov.in",
        kind: "government",
      },
    ],
    stories: [],
    artisans: [],
    relatedTraditions: ["chola-bronze-stone", "delta-song-and-scroll"],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  },
];

export type Reel = {
  id: string;
  siteSlug: string;
  title: LocalizedText;
  caption: LocalizedText;
  durationSec: number;
  poster: string;
  videoSrc?: string;
  narrator: string;
  aiAssisted: boolean;
  reviewed: boolean;
  likes: number;
};

export const REELS: Reel[] = [
  {
    id: "reel-golconda",
    siteSlug: "golconda-fort-hyderabad",
    title: {
      en: "The Acoustics of Golconda Fort",
      hi: "गोलकोंडा किले का रहस्य",
    },
    caption: {
      en: "A single handclap at the entry gate signals the mountaintop palace 1 km away.",
      hi: "फतेह दरवाज़े की एक ताली 1 किमी दूर पहाड़ की चोटी पर स्थित महल में गूँजती है।",
    },
    durationSec: 52,
    poster: golcondaFortImg,
    videoSrc: "/videos/golconda-fort-mystery.mp4",
    narrator: "Dharohar AI · Archaeological Survey",
    aiAssisted: true,
    reviewed: true,
    likes: 4280,
  },
  {
    id: "reel-01",
    siteSlug: "brihadisvara-temple-thanjavur",
    title: {
      en: "The tower that casts no shadow",
      hi: "बृहदीश्वर मंदिर: 80 टन पत्थर का रहस्य",
      ta: "நிழல் விழாத விமானம்",
    },
    caption: {
      en: "How did 11th-century Chola engineers lift an 80-tonne granite dome atop a 66m vimana without cranes?",
      hi: "1,300 टन का शिखर पत्थर, बिना गारा, और 66 मीटर ऊँचे शिखर पर 80 टन का पत्थर उठाने का रहस्य।",
      ta: "1,300 டன் கல், சாந்து இல்லை, 80 டன் கருங்கல்லை ஏற்றிய சோழர் பொறியியல் அற்புதம்.",
    },
    durationSec: 48,
    poster: heroHeritage,
    videoSrc: "/videos/brihadeeswarar-temple-mystery.mp4",
    narrator: "Meena R. · epigraphist",
    aiAssisted: true,
    reviewed: true,
    likes: 5620,
  },
  {
    id: "reel-modhera",
    siteSlug: "modhera-sun-temple-patan",
    title: {
      en: "Sun Temple Modhera: Geometry of the Solstice",
      hi: "मोढेरा सूर्य मंदिर का स्वर्णिम रहस्य",
      gu: "મોઢેરા સૂર્ય મંદિરનો અદભુત ઇતિહાસ",
    },
    caption: {
      en: "Aligned to catch the equinox dawn sun, featuring 108 miniature shrines around the sacred Surya Kund stepwell.",
      hi: "विषुव के पहले सूर्य की किरण से गर्भगृह का अभिषेक और 108 लघु मंदिरों वाला अद्वितीय सूर्य कुंड।",
      gu: "વિષુવવૃત્તીય સૂર્યકિરણોનું ગર્ભગૃહમાં આગમન અને 108 નાના મંદિરોથી ઘેરાયેલો સૂર્ય કુંડ.",
    },
    durationSec: 64,
    poster: modheraSunTempleImg,
    videoSrc: "/videos/modhera-sun-temple.mp4",
    narrator: "Dharohar Explorer · Gujarat Heritage",
    aiAssisted: true,
    reviewed: true,
    likes: 3890,
  },
  {
    id: "reel-indus",
    siteSlug: "dholavira-indus-valley",
    title: {
      en: "Inside the Indus Valley Civilization",
      hi: "AI से देखिए कैसी थी सिंधु घाटी सभ्यता",
      gu: "સિંધુ ખીણ સભ્યતા અને ધોળાવીરા રહસ્ય",
    },
    caption: {
      en: "Explore the 5,000-year-old urban engineering, stone grid streets, and massive prehistoric reservoirs of Dholavira.",
      hi: "5000 साल पुरानी नगर योजना, तराशे हुए पत्थरों की दीवारें और धोलावीरा के अद्भुत जल संचयन कुंड।",
      gu: "5000 વર્ષ જૂની નગર રચના અને ધોળાવીરાની વિશાળ પથ્થર જળ વ્યવસ્થા.",
    },
    durationSec: 75,
    poster: indusValleyImg,
    videoSrc: "/videos/indus-valley-civilization.mp4",
    narrator: "History With AI · Vedic Archeology",
    aiAssisted: true,
    reviewed: true,
    likes: 6740,
  },
  {
    id: "reel-02",
    siteSlug: "kanchipuram-silk-weaving",
    title: {
      en: "Where the border meets the body",
      hi: "जहाँ किनारी शरीर से मिलती है",
      ta: "பார்டர் உடலைச் சேரும் இடம்",
    },
    caption: {
      en: "The korvai join takes three shuttles and about 8,000 hand movements a day.",
      hi: "कोरवै जोड़ में तीन शटल और दिनभर में लगभग 8,000 हस्त-गतियाँ लगती हैं।",
      ta: "கோர்வை இணைப்புக்கு மூன்று ஷட்டில், நாளொன்றுக்கு சுமார் 8,000 கை அசைவுகள்.",
    },
    durationSec: 39,
    poster: craftWeaving,
    narrator: "Arun K. · contributor",
    aiAssisted: false,
    reviewed: true,
    likes: 1518,
  },
  {
    id: "reel-03",
    siteSlug: "durga-puja-kolkata",
    title: { en: "A city turned gallery", hi: "गैलरी बना शहर", bn: "গ্যালারি হয়ে ওঠা শহর" },
    caption: {
      en: "Four thousand pandals, commissioned art, and a river that receives it all back.",
      hi: "चार हज़ार पंडाल, कलाकृतियाँ, और सब कुछ लौटा लेने वाली नदी।",
      bn: "চার হাজার প্যান্ডেল, শিল্পের কমিশন, আর সব ফিরিয়ে নেওয়া নদী।",
    },
    durationSec: 55,
    poster: festivalImg,
    narrator: "Sohini D. · contributor",
    aiAssisted: true,
    reviewed: true,
    likes: 3320,
  },
  {
    id: "reel-04",
    siteSlug: "kathakali-kerala",
    title: { en: "Nine hours of eyes", hi: "नौ घंटे की दृष्टि", ta: "ஒன்பது மணி நேரக் கண்கள்" },
    caption: {
      en: "Before a single step, a Kathakali student trains the eyes for two years.",
      hi: "एक कदम से पहले, कथकली विद्यार्थी दो वर्ष तक नेत्र-अभ्यास करता है।",
      ta: "ஒரு அடி வைப்பதற்கு முன், மாணவர் இரண்டு ஆண்டு கண் பயிற்சி செய்கிறார்.",
    },
    durationSec: 42,
    poster: performanceImg,
    narrator: "Dharohar editorial",
    aiAssisted: true,
    reviewed: false,
    likes: 890,
  },
  {
    id: "reel-05",
    siteSlug: "palm-leaf-manuscripts-odisha",
    title: {
      en: "Soot makes the letters appear",
      hi: "कालिख से उभरते अक्षर",
      bn: "কাজলে ফোটে অক্ষর",
    },
    caption: {
      en: "Etched invisible, revealed with lamp black — and vulnerable to one wet season.",
      hi: "अदृश्य उत्कीर्णन, कालिख से प्रकट — और एक बरसात में नष्ट होने योग्य।",
      bn: "অদৃশ্য খোদাই, কাজলে প্রকাশ — এক বর্ষায় নষ্ট হওয়ার ঝুঁকি।",
    },
    durationSec: 36,
    poster: manuscriptImg,
    narrator: "Odisha State Museum",
    aiAssisted: false,
    reviewed: true,
    likes: 604,
  },
  {
    id: "reel-06",
    siteSlug: "chandratal-hill-temples",
    title: { en: "Timber that survives earthquakes", hi: "भूकंप सहने वाली लकड़ी" },
    caption: {
      en: "Kath-kuni walls flex where masonry cracks — carpentry as seismic design.",
      hi: "काठ-कुनी दीवारें लचकती हैं जहाँ चिनाई चटकती है — काष्ठकला ही भूकंप-रक्षा है।",
    },
    durationSec: 44,
    poster: hillTempleImg,
    narrator: "Tenzin N. · custodian",
    aiAssisted: true,
    reviewed: true,
    likes: 1102,
  },
  {
    id: "reel-07",
    siteSlug: "baul-song-bengal",
    title: {
      en: "One string, whole cosmology",
      hi: "एक तार, पूरा ब्रह्मांड",
      bn: "এক তারে গোটা ব্রহ্মাণ্ড",
    },
    caption: {
      en: "The ektara keeps time while the song argues with the body.",
      hi: "एकतारा ताल संभालता है और गीत शरीर से संवाद करता है।",
      bn: "একতারা তাল রাখে, গান দেহের সঙ্গে তর্ক করে।",
    },
    durationSec: 51,
    poster: performanceImg,
    narrator: "Visva-Bharati archive",
    aiAssisted: false,
    reviewed: true,
    likes: 1975,
  },
  {
    id: "reel-08",
    siteSlug: "sattriya-majuli",
    title: { en: "An island that keeps moving", hi: "खिसकता हुआ द्वीप", bn: "সরে যাওয়া দ্বীপ" },
    caption: {
      en: "Satras have relocated their archives three times in twenty years.",
      hi: "बीस वर्षों में सत्रों ने अपने अभिलेख तीन बार स्थानांतरित किए।",
      bn: "কুড়ি বছরে সত্রগুলি তিনবার আর্কাইভ সরিয়েছে।",
    },
    durationSec: 47,
    poster: performanceImg,
    narrator: "Bhaskar B. · verified expert",
    aiAssisted: true,
    reviewed: true,
    likes: 1460,
  },
  {
    id: "reel-09",
    siteSlug: "bandhani-kutch",
    title: { en: "Ten thousand knots", hi: "दस हज़ार गाँठें" },
    caption: {
      en: "Each dot is a knot tied by fingertip, then dyed light to dark.",
      hi: "हर बिंदु उँगली से बँधी गाँठ है, फिर हल्के से गहरे रंग में रंगी जाती है।",
    },
    durationSec: 33,
    poster: craftWeaving,
    narrator: "Khatri cluster, Bhuj",
    aiAssisted: false,
    reviewed: true,
    likes: 1290,
  },
];

export type TrailStop = {
  siteSlug: string;
  arriveAfterMin: number;
  note: string;
};

export type Trail = {
  id: string;
  slug: string;
  name: LocalizedText;
  blurb: LocalizedText;
  region: string;
  distanceKm: number;
  durationHours: number;
  travelModes: ("walk" | "cycle" | "car" | "transit")[];
  difficulty: "easy" | "moderate" | "immersive";
  stops: TrailStop[];
  services: string[];
  image: string;
};

export const TRAILS: Trail[] = [
  {
    id: "tr-01",
    slug: "chola-bronze-and-stone",
    name: { en: "Chola bronze & stone", hi: "चोल कांस्य और पाषाण", ta: "சோழர் வெண்கலமும் கல்லும்" },
    blurb: {
      en: "Two days across Thanjavur's temple town, bronze foundries and weaving lanes.",
      hi: "तंजावुर के मंदिर नगर, कांस्य भट्टियों और बुनाई गलियों में दो दिन।",
      ta: "தஞ்சை கோயில் நகரம், வெண்கல பட்டறை, நெசவுத் தெருக்கள் — இரு நாள்.",
    },
    region: "Tamil Nadu",
    distanceKm: 68,
    durationHours: 11,
    travelModes: ["car", "walk"],
    difficulty: "moderate",
    stops: [
      {
        siteSlug: "brihadisvara-temple-thanjavur",
        arriveAfterMin: 0,
        note: "Start at dawn before the crowds",
      },
      {
        siteSlug: "kanchipuram-silk-weaving",
        arriveAfterMin: 240,
        note: "Loom demonstration at the cooperative",
      },
      {
        siteSlug: "chettinad-kitchen-traditions",
        arriveAfterMin: 480,
        note: "Midday meal in a heritage mansion",
      },
    ],
    services: [
      "Licensed guide (Tamil/English)",
      "Wheelchair-accessible van",
      "Artisan workshop booking",
    ],
    image: "/images/heritage/chola_bronze_stone.jpg",
  },
  {
    id: "tr-02",
    slug: "delta-song-and-scroll",
    name: { en: "Delta song & scroll", hi: "डेल्टा गीत और पट", bn: "ডেল্টার গান ও পট" },
    blurb: {
      en: "Baul akhras, terracotta temples and palm-leaf archives across the eastern delta.",
      hi: "पूर्वी डेल्टा में बाउल अखाड़े, टेराकोटा मंदिर और ताड़पत्र अभिलेख।",
      bn: "বাউল আখড়া, পোড়ামাটির मंदिर ও তালপাতার আর্কাইভ।",
    },
    region: "West Bengal & Odisha",
    distanceKm: 240,
    durationHours: 20,
    travelModes: ["car", "transit"],
    difficulty: "immersive",
    stops: [
      { siteSlug: "baul-song-bengal", arriveAfterMin: 0, note: "Evening akhra session" },
      { siteSlug: "durga-puja-kolkata", arriveAfterMin: 300, note: "Kumartuli studio walk" },
      {
        siteSlug: "palm-leaf-manuscripts-odisha",
        arriveAfterMin: 720,
        note: "Curator-led reading room visit",
      },
    ],
    services: ["Homestay network", "Bengali/Odia interpreter", "Archive access request support"],
    image: "/images/heritage/delta_song_scroll.jpg",
  },
  {
    id: "tr-03",
    slug: "desert-dye-route",
    name: { en: "Desert dye route", hi: "रेगिस्तानी रंग मार्ग" },
    blurb: {
      en: "Kutch bandhani yards and Patan's stepwell in a single western loop.",
      hi: "एक पश्चिमी चक्र में कच्छ के बंधनी आँगन और पाटन की बावड़ी।",
    },
    region: "Gujarat",
    distanceKm: 310,
    durationHours: 16,
    travelModes: ["car"],
    difficulty: "moderate",
    stops: [
      { siteSlug: "bandhani-kutch", arriveAfterMin: 0, note: "Morning knot-tying session" },
      {
        siteSlug: "rani-ki-vav-patan",
        arriveAfterMin: 420,
        note: "Late afternoon light on the sculpture galleries",
      },
    ],
    services: ["Craft cluster passes", "Accessible viewing platform info", "Gujarati guide"],
    image: "/images/heritage/desert_dye_route.jpg",
  },
  {
    id: "tr-04",
    slug: "himalayan-timber-trail",
    name: { en: "Himalayan timber trail", hi: "हिमालयी काष्ठ पथ" },
    blurb: {
      en: "Kath-kuni temples and carpentry workshops along the Sutlej valley.",
      hi: "सतलुज घाटी में काठ-कुनी मंदिर और बढ़ईगीरी कार्यशालाएँ।",
    },
    region: "Himachal Pradesh",
    distanceKm: 96,
    durationHours: 14,
    travelModes: ["car", "walk"],
    difficulty: "immersive",
    stops: [
      {
        siteSlug: "chandratal-hill-temples",
        arriveAfterMin: 0,
        note: "Restoration site walk-through",
      },
    ],
    services: ["High-altitude permit help", "Village homestays", "Carpenter-led demo"],
    image: hillTempleImg,
  },
  {
    id: "tr-05",
    slug: "river-island-satras",
    name: { en: "River island satras", hi: "नदी-द्वीप के सत्र", bn: "নদী-দ্বীপের সত্র" },
    blurb: {
      en: "Ferry to Majuli for mask making, borgeet and sattriya rehearsal.",
      hi: "मुखौटा निर्माण, बरगीत और सत्रीया अभ्यास के लिए माजुली की नौका यात्रा।",
    },
    region: "Assam",
    distanceKm: 54,
    durationHours: 9,
    travelModes: ["transit", "cycle"],
    difficulty: "easy",
    stops: [
      { siteSlug: "sattriya-majuli", arriveAfterMin: 0, note: "Samaguri satra mask workshop" },
    ],
    services: ["Ferry timings", "Cycle rental", "Assamese guide"],
    image: performanceImg,
  },
];

export type Contribution = {
  id: string;
  title: string;
  contributor: string;
  type: "photo" | "oral-history" | "document" | "tradition";
  state: string;
  submittedAt: string;
  status: ModerationStatus;
  feedback?: string;
  aiTags: string[];
  duplicateScore: number;
};

export const CONTRIBUTIONS: Contribution[] = [
  {
    id: "cb-01",
    title: "Grandmother's Pandavani recording, 1998 cassette",
    contributor: "Ritu S.",
    type: "oral-history",
    state: "Chhattisgarh",
    submittedAt: "2026-08-24",
    status: "pending",
    aiTags: ["pandavani", "audio", "mahabharata"],
    duplicateScore: 0.04,
  },
  {
    id: "cb-02",
    title: "Kath-kuni roof re-slating, step-by-step photos",
    contributor: "Tenzin N.",
    type: "photo",
    state: "Himachal Pradesh",
    submittedAt: "2026-08-20",
    status: "approved",
    feedback: "Approved with attribution. Added to restoration record.",
    aiTags: ["kath-kuni", "restoration", "carpentry"],
    duplicateScore: 0.11,
  },
  {
    id: "cb-03",
    title: "Family patola loom inventory, 1971 ledger scan",
    contributor: "Hiren P.",
    type: "document",
    state: "Gujarat",
    submittedAt: "2026-08-18",
    status: "changes",
    feedback: "Needs a legible page 3 scan and consent note from the ledger owner.",
    aiTags: ["patola", "ledger", "handloom"],
    duplicateScore: 0.07,
  },
  {
    id: "cb-04",
    title: "Kumartuli idol structure ritual (kathamo puja)",
    contributor: "Sohini D.",
    type: "tradition",
    state: "West Bengal",
    submittedAt: "2026-08-12",
    status: "approved",
    feedback: "Verified against two published sources.",
    aiTags: ["durga-puja", "kumartuli", "ritual"],
    duplicateScore: 0.23,
  },
  {
    id: "cb-05",
    title: "Temple gopuram photos (uncredited stock upload)",
    contributor: "anon_user_882",
    type: "photo",
    state: "Tamil Nadu",
    submittedAt: "2026-08-09",
    status: "rejected",
    feedback: "Rejected: duplicate of an existing licensed image set; no provenance provided.",
    aiTags: ["gopuram", "duplicate"],
    duplicateScore: 0.94,
  },
];

export type QuizQuestion = {
  id: string;
  prompt: LocalizedText;
  options: string[];
  answerIndex: number;
  explanation: LocalizedText;
  category: HeritageCategory;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: {
      en: "Which construction technique gives Kinnaur's temples earthquake resilience?",
      hi: "किन्नौर के मंदिरों को भूकंप सहनशीलता कौन-सी निर्माण तकनीक देती है?",
      ta: "கின்னௌர் கோயில்களுக்கு நிலநடுக்க எதிர்ப்பை அளிக்கும் கட்டுமான முறை?",
      bn: "কিন্নরের মন্দিরে ভূমিকম্প সহনশীলতা কোন নির্মাণ কৌশল দেয়?",
    },
    options: ["Kath-kuni", "Chunam plaster", "Corbelled brick", "Rammed earth"],
    answerIndex: 0,
    explanation: {
      en: "Kath-kuni alternates timber and stone courses without mortar, letting walls flex.",
      hi: "काठ-कुनी में लकड़ी और पत्थर की परतें बिना गारे लगती हैं, जिससे दीवारें लचकती हैं।",
    },
    category: "monuments",
  },
  {
    id: "q2",
    prompt: {
      en: "What is the korvai in Kanchipuram weaving?",
      hi: "कांचीपुरम बुनाई में 'कोरवै' क्या है?",
      ta: "காஞ்சிபுரம் நெசவில் 'கோர்வை' என்பது என்ன?",
      bn: "কাঞ্চিপুরম বয়নে 'কোরবাই' কী?",
    },
    options: ["A dye recipe", "A loom pedal", "The body-to-border join", "A festival motif"],
    answerIndex: 2,
    explanation: {
      en: "Korvai is the interlocked join between separately woven body and border.",
      hi: "कोरवै अलग-अलग बुने शरीर और किनारी के बीच का गुँथा हुआ जोड़ है।",
    },
    category: "crafts",
  },
  {
    id: "q3",
    prompt: {
      en: "In which year was Durga Puja in Kolkata inscribed by UNESCO?",
      hi: "कोलकाता की दुर्गा पूजा यूनेस्को सूची में किस वर्ष अंकित हुई?",
      bn: "কলকাতার দুর্গাপূজা কোন বছরে ইউনেস্কো তালিকাভুক্ত হয়?",
    },
    options: ["2008", "2016", "2021", "2023"],
    answerIndex: 2,
    explanation: {
      en: "It was inscribed on the Representative List of Intangible Cultural Heritage in 2021.",
      hi: "इसे 2021 में अमूर्त सांस्कृतिक विरासत की प्रतिनिधि सूची में अंकित किया गया।",
    },
    category: "festivals",
  },
  {
    id: "q4",
    prompt: {
      en: "Which instrument keeps time in Baul performance?",
      hi: "बाउल प्रस्तुति में ताल कौन-सा वाद्य संभालता है?",
      bn: "বাউল পরিবেশনায় তাল রাখে কোন বাদ্যযন্ত্র?",
    },
    options: ["Ektara", "Sarangi", "Mridangam", "Rabab"],
    answerIndex: 0,
    explanation: {
      en: "The single-stringed ektara anchors rhythm and drone together.",
      hi: "एकतारा ताल और स्वर-आधार दोनों संभालता है।",
    },
    category: "music",
  },
  {
    id: "q5",
    prompt: {
      en: "What is the primary threat to Majuli's satra archives?",
      hi: "माजुली के सत्र अभिलेखों के लिए मुख्य खतरा क्या है?",
      bn: "মাজুলির সত্র আর্কাইভের প্রধান হুমকি কী?",
    },
    options: ["Fire", "River erosion", "Earthquakes", "Tourism"],
    answerIndex: 1,
    explanation: {
      en: "Brahmaputra erosion has repeatedly forced satras to relocate their collections.",
      hi: "ब्रह्मपुत्र के कटाव ने सत्रों को बार-बार संग्रह स्थानांतरित करने पर विवश किया है।",
    },
    category: "performing-arts",
  },
  {
    id: "q6",
    prompt: {
      en: "How is script revealed on Odia palm-leaf manuscripts?",
      hi: "ओड़िया ताड़पत्र हस्तलेखों पर लिपि कैसे उभारी जाती है?",
      bn: "ওড়িয়া তালপাতার পুঁথিতে লেখা কীভাবে ফোটানো হয়?",
    },
    options: ["Gold leaf", "Lamp soot rubbed in", "Ink brush", "Heat pressing"],
    answerIndex: 1,
    explanation: {
      en: "Letters are etched with an iron stylus and then darkened with lamp black.",
      hi: "अक्षर लौह लेखनी से उत्कीर्ण होकर कालिख से गहरे किए जाते हैं।",
    },
    category: "manuscripts",
  },
];

export type Badge = {
  id: string;
  name: string;
  icon: string;
  requirement: string;
  earned: boolean;
};

export const BADGES: Badge[] = [
  {
    id: "b1",
    name: "Trail Walker",
    icon: "🥾",
    requirement: "Complete 3 heritage trails",
    earned: true,
  },
  {
    id: "b2",
    name: "Story Keeper",
    icon: "📖",
    requirement: "Contribute 5 approved oral histories",
    earned: true,
  },
  {
    id: "b3",
    name: "Polyglot",
    icon: "🗣️",
    requirement: "Read records in 3 languages",
    earned: true,
  },
  {
    id: "b4",
    name: "Conservation Watch",
    icon: "🛡️",
    requirement: "File 10 preservation reports",
    earned: false,
  },
  {
    id: "b5",
    name: "Master of Ragas",
    icon: "🎼",
    requirement: "Score 100% on the music quiz",
    earned: false,
  },
  {
    id: "b6",
    name: "Archive Scholar",
    icon: "📜",
    requirement: "Study 20 manuscript records",
    earned: false,
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "Sohini D.", points: 8420, streak: 41, state: "West Bengal" },
  { rank: 2, name: "Arun K.", points: 7960, streak: 33, state: "Tamil Nadu" },
  { rank: 3, name: "Tenzin N.", points: 7115, streak: 28, state: "Himachal Pradesh" },
  { rank: 4, name: "You", points: 6480, streak: 12, state: "Karnataka" },
  { rank: 5, name: "Hiren P.", points: 5990, streak: 19, state: "Gujarat" },
  { rank: 6, name: "Ritu S.", points: 5240, streak: 9, state: "Chhattisgarh" },
];

export type PreservationReport = {
  id: string;
  siteSlug: string;
  status: PreservationStatus;
  reportedBy: string;
  date: string;
  note: string;
};

export const PRESERVATION_REPORTS: PreservationReport[] = [
  {
    id: "pr-01",
    siteSlug: "palm-leaf-manuscripts-odisha",
    status: "risk",
    reportedBy: "Odisha State Museum",
    date: "2026-08-21",
    note: "Insect activity found in two household collections; fumigation requested.",
  },
  {
    id: "pr-02",
    siteSlug: "sattriya-majuli",
    status: "risk",
    reportedBy: "Bhaskar B. · verified expert",
    date: "2026-08-19",
    note: "Bank erosion within 400 m of the satra boundary after monsoon peak.",
  },
  {
    id: "pr-03",
    siteSlug: "chandratal-hill-temples",
    status: "restoration",
    reportedBy: "HP heritage cell",
    date: "2026-08-11",
    note: "Slate roof replacement 60% complete using traditional joinery.",
  },
  {
    id: "pr-04",
    siteSlug: "kanchipuram-silk-weaving",
    status: "attention",
    reportedBy: "Kamakshi Weavers Coop",
    date: "2026-08-04",
    note: "Eleven household looms idle this quarter due to yarn costs.",
  },
  {
    id: "pr-05",
    siteSlug: "brihadisvara-temple-thanjavur",
    status: "safe",
    reportedBy: "ASI Thanjavur circle",
    date: "2026-07-14",
    note: "Quarterly inspection clear; visitor routing adjusted for festival season.",
  },
];

export const ASSISTANT_SUGGESTIONS: LocalizedText[] = [
  {
    en: "Which heritage sites near Thanjavur are wheelchair accessible?",
    hi: "तंजावुर के पास कौन-से विरासत स्थल व्हीलचेयर सुलभ हैं?",
    ta: "தஞ்சாவூர் அருகில் சக்கர நாற்காலி அணுகல் உள்ள இடங்கள் எவை?",
    bn: "তাঞ্জাভুরের কাছে কোন ঐতিহ্যস্থল হুইলচেয়ার-বান্ধব?",
  },
  {
    en: "Explain the korvai technique in simple terms.",
    hi: "कोरवै तकनीक सरल शब्दों में समझाइए।",
    ta: "கோர்வை நுட்பத்தை எளிமையாக விளக்குங்கள்.",
    bn: "কোরবাই কৌশল সহজভাবে বোঝান।",
  },
  {
    en: "Which intangible traditions in my dataset are at risk, and why?",
    hi: "मेरे डेटासेट में कौन-सी अमूर्त परंपराएँ संकट में हैं और क्यों?",
    ta: "எந்த அருவப் பாரம்பரியங்கள் அபாயத்தில் உள்ளன, ஏன்?",
    bn: "কোন অপার্থিব ঐতিহ্য ঝুঁকিতে এবং কেন?",
  },
  {
    en: "Plan a two-day trail combining crafts and temples in Tamil Nadu.",
    hi: "तमिलनाडु में शिल्प और मंदिरों को जोड़कर दो दिन का पथ बनाइए।",
    ta: "தமிழ்நாட்டில் கைவினை மற்றும் கோயில்களை இணைத்து இரு நாள் பாதை வகுக்கவும்.",
    bn: "তামিলনাড়ুতে কারুশিল্প ও মন্দির মিলিয়ে দু'দিনের পথ সাজান।",
  },
];

/* ---------- helpers ---------- */

export const STATES = Array.from(new Set([...HERITAGE_SITES, ...INGESTED_HERITAGE_SITES].map((s) => s.state))).sort();
export const DISTRICTS = Array.from(new Set([...HERITAGE_SITES, ...INGESTED_HERITAGE_SITES].map((s) => s.district))).sort();
export const ERAS = ["ancient", "medieval", "colonial", "modern", "living"] as const;

export function getSite(slug?: string) {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  const ingested = getIngestedHeritageSite(s);
  if (ingested) return ingested;
  return HERITAGE_SITES.find(
    (item) =>
      item.slug === s ||
      (s === "modhera-sun-temple" && item.slug === "modhera-sun-temple-patan") ||
      (s === "brihadeeswara-thanjavur" && item.slug === "brihadisvara-temple-thanjavur") ||
      (s === "brihadeeswara" && item.slug === "brihadisvara-temple-thanjavur") ||
      (s === "brihadisvara" && item.slug === "brihadisvara-temple-thanjavur") ||
      (s === "chola-bronze-and-stone" && item.slug === "chola-bronze-stone") ||
      (s === "chola-bronze-stone" && item.slug === "chola-bronze-stone") ||
      (s === "rani-ki-vav" && (item.slug === "rani-ki-vav-patan" || item.slug.includes("rani-ki-vav"))) ||
      (s === "hampi" && (item.slug === "hampi-monuments" || item.slug.includes("hampi"))) ||
      (s === "konark" && (item.slug === "konark-sun-temple" || item.slug.includes("konark"))) ||
      (s === "amer-fort" && (item.slug === "amer-fort-jaipur" || item.slug.includes("amer-fort"))) ||
      (s === "sanchi-stupa" && (item.slug === "sanchi-stupa-bhopal" || item.slug.includes("sanchi-stupa"))) ||
      (s === "kedarnath" && item.slug === "kedarnath-temple") ||
      (s === "somnath" && item.slug === "somnath-temple") ||
      (s === "kashi-vishwanath" && item.slug === "kashi-vishwanath-temple") ||
      (s === "meenakshi" && item.slug === "meenakshi-amman-temple") ||
      (s === "tirupati" && item.slug === "tirupati-balaji-temple") ||
      (s === "jagannath" && item.slug === "jagannath-temple-puri") ||
      (s === "kamakhya" && item.slug === "kamakhya-temple") ||
      (s === "akshardham" && item.slug === "akshardham-temple-delhi") ||
      item.slug.replace(/-/g, "") === s.replace(/-/g, ""),
  );
}

export function getReel(id?: string) {
  return REELS.find((r) => r.id === id);
}

export function trailsForSite(slug: string) {
  return TRAILS.filter((t) => t.stops.some((s) => s.siteSlug === slug));
}

export function reportsForSite(slug: string) {
  return PRESERVATION_REPORTS.filter((r) => r.siteSlug === slug);
}

/** Haversine distance in km — stands in for a PostGIS ST_Distance query. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export function nearbySites(slug: string, limit = 4) {
  const origin = getSite(slug);
  if (!origin) return [];
  return HERITAGE_SITES.filter((s) => s.slug !== slug)
    .map((s) => ({ site: s, km: distanceKm(origin, s) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

/** Simple equirectangular projection onto the stylised India map (0–100%). */
export function projectToMap(lat: number, lng: number) {
  const x = ((lng - 67.5) / (98 - 67.5)) * 100;
  const y = ((37.5 - lat) / (37.5 - 6.5)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(98, Math.max(2, y)) };
}

export const PRESERVATION_LABEL_KEY: Record<PreservationStatus, string> = {
  safe: "status.safe",
  attention: "status.attention",
  risk: "status.risk",
  restoration: "status.restoration",
};

export const MODERATION_LABEL_KEY: Record<ModerationStatus, string> = {
  pending: "moderation.pending",
  approved: "moderation.approved",
  changes: "moderation.changes",
  rejected: "moderation.rejected",
};
