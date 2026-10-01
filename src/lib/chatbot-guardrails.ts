/**
 * Chatbot Guardrails & Historic Temples Knowledge Base for AI Assistant Bharti
 * Dharohar / VisionX Cultural Intelligence Platform
 */

export interface HowToReach {
  air: string;
  rail: string;
  road: string;
}

export interface LocationDetails {
  state: string;
  district: string;
  nearestCity: string;
  landmark?: string;
}

export interface TempleEntry {
  name: string;
  slug: string;
  deity: string;
  consecrationEra: string;
  patronMaker: string;
  history: string;
  coordinates: [number, number]; // [longitude, latitude]
  locationDetails: LocationDetails;
  howToReach: HowToReach;
  architecturalStyle: string;
  ticketAndTimings: string;
  category: "temple";
  preservationState: "Safe" | "Active Place of Worship";
  heroImage?: string;
  aliases: string[];
}

export const HISTORIC_TEMPLES: TempleEntry[] = [
  {
    name: "Kedarnath Temple",
    slug: "kedarnath-temple",
    deity: "Lord Shiva (Jyotirlinga)",
    consecrationEra: "8th Century CE (revived by Adi Shankaracharya; Pandava legendary origins)",
    patronMaker: "Adi Shankaracharya (re-consecration); Pandava lineage (mythological origins)",
    history:
      "Perched at 3,584 metres in the Garhwal Himalayas near the Mandakini River source, Kedarnath is the most sacred and highest among the twelve Jyotirlingas of Lord Shiva. According to the Mahabharata, the Pandavas sought Shiva to absolve the karma of the Kurukshetra war, where the Lord took the form of a cosmic bull whose hump materialized at this exact sacred site. Constructed from massive grey granite blocks interlocked with iron clamps without mortar, the temple has remarkably withstood centuries of harsh Himalayan avalanches and glacial floods.",
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
    architecturalStyle: "Garhwal Himalayan Nagara / Katyuri Stone Style",
    ticketAndTimings:
      "Darshan: 04:00 AM – 09:00 PM (Gates open Akshaya Tritiya in April/May to Bhai Dooj in October/November; temple closes during heavy sub-zero winter snowfall). Free general entry; VIP/Maha Abhishek bookings via Shri Badrinath Kedarnath Temple Committee (BKTC).",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/hill-temple.jpg",
    aliases: ["kedarnath", "kedarnath temple", "kedarnatha", "shri kedarnath", "kedar"],
  },
  {
    name: "Kashi Vishwanath Temple",
    slug: "kashi-vishwanath-temple",
    deity: "Lord Shiva (Vishveshwara / Jyotirlinga)",
    consecrationEra: "1780 CE (Present sanctum; ancient Puranic origins spanning millennia)",
    patronMaker: "Maharani Ahilyabai Holkar of Indore; modern corridor developed by Government of India (2021)",
    history:
      "Standing on the sacred western bank of the River Ganga in Varanasi, Kashi Vishwanath is revered as the spiritual capital of Hinduism, where Lord Shiva is believed to grant liberation (Moksha). After repeated medieval demolitions, the sanctum was resurrectively rebuilt in 1780 by the pious Maratha queen Maharani Ahilyabai Holkar of Indore, and its 15.5-metre spires were later adorned with 800 kilograms of pure gold leaf donated in 1839 by Maharaja Ranjit Singh of Punjab. The historic 2021 Kashi Vishwanath Corridor transformed the pilgrimage experience, providing an unobstructed 50,000-square-metre sacred pedestrian promenade connecting the Manikarnika and Lalita Ghats directly to the sanctum.",
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
    architecturalStyle: "Nagara Architecture (Quadrangle Sanctum with Gold Shikhara & Sabha Mandapa)",
    ticketAndTimings:
      "Darshan: 03:00 AM – 11:00 PM daily. Mangala Aarti at 03:00 AM, Bhog Aarti at 11:15 AM, Sandhya Aarti at 07:00 PM, Shringar Aarti at 09:00 PM. Free general entry; Sugam Darshan passes available online via temple trust.",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/hero-heritage.jpg",
    aliases: [
      "kashi vishwanath",
      "kashi",
      "vishwanath temple",
      "banaras temple",
      "varanasi temple",
      "kashi vishwanath temple",
    ],
  },
  {
    name: "Meenakshi Sundareswarar Temple",
    slug: "meenakshi-sundareswarar-temple",
    deity: "Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva)",
    consecrationEra: "1623–1655 CE (Current monumental complex; ancient Sangam origins dating to 6th Century BCE)",
    patronMaker: "King Tirumala Nayaka of the Madurai Nayaka Dynasty",
    history:
      "Anchoring the ancient lotus-shaped city of Madurai along the Vaigai River, Meenakshi Sundareswarar Temple is a crowning jewel of Dravidian architecture where Goddess Meenakshi holds primary ritual supremacy over Shiva. The sacred complex covers 14 acres surrounded by fourteen magnificent gopurams (gateway towers), the tallest southern tower soaring to 52 metres adorned with thousands of vibrantly sculpted stucco deities, celestial beings, and mythic figures. Inside lies the celebrated Hall of Thousand Pillars (Aayiram Kaal Mandapam) displaying 985 exquisitely carved granite pillars, along with five historic musical pillars that resonate with saptaswara notes when tapped.",
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
    architecturalStyle: "Madurai Nayaka Dravidian Architecture",
    ticketAndTimings:
      "Darshan: 05:00 AM – 12:30 PM & 04:00 PM – 10:00 PM. Free general darshan; Special darshan tickets ₹50–₹100; Thousand Pillar Hall museum ₹50. Traditional modest attire mandatory (dhoti/kurta for men, saree/salwar for women).",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/performance.jpg",
    aliases: [
      "meenakshi",
      "meenakshi temple",
      "madurai meenakshi",
      "meenakshi amman",
      "meenakshi sundareswarar",
      "meenakshi amman temple",
    ],
  },
  {
    name: "Somnath Temple",
    slug: "somnath-temple",
    deity: "Lord Shiva (First of the 12 Jyotirlingas)",
    consecrationEra: "1951 CE (Modern revival; original Chaulukya foundations dating to 1st millennium CE)",
    patronMaker: "Sardar Vallabhbhai Patel (reconstruction initiator), Prabhashankar Sompura (architect); ancient Chaulukya kings",
    history:
      "Revered as the first among the twelve holy Jyotirlingas, Somnath sits dramatically on the Saurashtra coast where the Arabian Sea crashes against its fortress-like sandstone walls. On its sea-facing promontory stands the historic Baan Stambh (Arrow Pillar), inscribed with the remarkable geodetic truth that an uninterrupted sea line extends from Somnath straight to Antarctica with zero landmass. Repeatedly raided and destroyed across centuries of foreign invasions, Somnath was rebuilt sixteen times, earning its status as the 'Eternal Shrine' symbolizing civilizational resilience, resurrected in 1951 through the vision of Sardar Vallabhbhai Patel and consecrated by India's first President, Dr. Rajendra Prasad.",
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
    architecturalStyle: "Chaulukya / Maru-Gurjara Kailash Mahameru Prasad Style",
    ticketAndTimings:
      "Darshan: 06:00 AM – 10:00 PM. Aarti at 07:00 AM, 12:00 PM, and 07:00 PM; 'Jay Somnath' Light & Sound show at 08:00 PM. Free entry; all electronic devices, cameras, and mobiles must be deposited at trust lockers.",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/modhera-sun-temple.jpg",
    aliases: [
      "somnath",
      "somnath temple",
      "prabhas patan",
      "first jyotirlinga",
      "shri somnath",
    ],
  },
  {
    name: "Puri Jagannath Temple",
    slug: "puri-jagannath-temple",
    deity: "Lord Jagannath, Balabhadra, and Subhadra",
    consecrationEra: "12th Century CE (c. 1161 CE)",
    patronMaker: "King Anantavarman Chodaganga & King Anangabhima Deva of the Eastern Ganga Dynasty",
    history:
      "One of the sacred Char Dham pilgrimage destinations, the Jagannath Temple at Puri rises 65 metres high near the Bay of Bengal, enshrining holy neem-wood deities that undergo ritual rebirth (Nabakalebara) every 12 to 19 years. The temple is famed for architectural and atmospheric wonders: its sacred Nilachakra flag flutters counter to the prevailing coastal wind, no shadows are cast on the ground at high noon, and birds never fly over the sanctum dome. Its ancient Rosaghara is the world's largest traditional kitchen, where hundreds of sevayats cook Chhappan Bhog (56 delicacies) in stacked earthen pots over wood fires to nourish thousands at the sacred Ananda Bazar.",
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
    architecturalStyle: "Kalinga Architecture (Reha Deula, Jagamohana, Natamandapa, Bhogamandapa)",
    ticketAndTimings:
      "Darshan: 05:00 AM – 11:00 PM. Dwaraphita at 05:00 AM; Pahuda at 11:00 PM. Free general entry (entry restricted to practicing Hindus according to ancient custom); Mahaprasad served daily from 01:00 PM at Ananda Bazar.",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/festival.jpg",
    aliases: [
      "puri jagannath",
      "jagannath temple",
      "jagannath",
      "puri temple",
      "shree jagannath",
      "jagannatha",
    ],
  },
  {
    name: "Tirupati Venkateswara Temple",
    slug: "tirupati-venkateswara-temple",
    deity: "Lord Venkateswara (Vishnu / Srinivasa / Balaji)",
    consecrationEra: "Circa 300 CE onwards (Expanded across 12th–16th Centuries CE)",
    patronMaker: "Patronized by Pallavas, Cholas, and extensively expanded by Sri Krishnadevaraya of Vijayanagara",
    history:
      "Enthroned amidst the sacred Seven Hills of Seshachalam in Tirumala, the Tirupati Venkateswara Temple is the most visited spiritual sanctuary on earth, revered as the Vaikuntha of Kali Yuga where Vishnu manifested to grant solace. The sanctum features the magnificent Ananda Nilayam Vimana, a three-tiered golden tower hovering over the self-manifested (Swayambhu) black stone deity adorned with precious gemstones and fragrant flower garlands. Devotees participate in sacred tonsuring (Kalyanakatta) and receive the renowned GI-tagged Tirupati Laddu Prasadam, with offerings supporting extensive complimentary pilgrim dining halls, free hospitals, and educational trusts.",
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
    architecturalStyle: "Dravidian Architecture (Gilded Ananda Nilayam Vimana & Chola-Vijayanagara Mandapas)",
    ticketAndTimings:
      "Darshan: 03:00 AM – 01:30 AM (Open ~22 hours daily). Free Sarvadarshanam (SSD token) or ₹300 Special Entry Darshan (SED booked online via TTD portal). Strict traditional attire mandatory (dhoti/pyjama with upper cloth for men; saree/half-saree/churidar with dupatta for women).",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/hill-temple.jpg",
    aliases: [
      "tirupati",
      "tirupati balaji",
      "venkateswara",
      "tirumala",
      "balaji temple",
      "tirupati venkateswara",
      "srinivasa",
      "venkateswara temple",
    ],
  },
  {
    name: "Kailasa Temple (Cave 16, Ellora)",
    slug: "kailasa-temple-ellora",
    deity: "Lord Shiva",
    consecrationEra: "8th Century CE (756–773 CE)",
    patronMaker: "King Krishna I of the Rashtrakuta Dynasty",
    history:
      "Considered the zenith of monolithic rock-cut engineering worldwide, Kailasa Temple at Ellora (Cave 16) was carved top-down from a vertical basalt cliff face, scooping out over 200,000 tonnes of volcanic stone without cranes, mortar, or scaffolding. Commissioned by Rashtrakuta King Krishna I to recreate Mount Kailash on earth, the temple rises across two storeys featuring a 32-metre vimana, life-sized carved war elephants, and two freestanding 15-metre victory pillars (Dhvaja Stambhas). Its monumental bas-reliefs depict high drama from Indian epics, including the celebrated panel of Demon King Ravana attempting to shake Mount Kailash while Shiva serenely stabilizes the cosmos with his toe.",
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
    architecturalStyle: "Monolithic Rock-cut Dravidian / Rashtrakuta Architecture",
    ticketAndTimings:
      "Timings: 06:00 AM – 06:00 PM (Closed on Tuesdays). Entry fee: ₹40 for Indian/BIMSTEC citizens; ₹600 for Foreign tourists; Free for children under 15 years. Best season: October to March.",
    category: "temple",
    preservationState: "Safe",
    heroImage: "/uploads/golconda-fort.jpg",
    aliases: [
      "kailasa temple",
      "kailash temple",
      "ellora cave 16",
      "ellora kailasa",
      "cave 16",
      "kailasa",
      "kailash ellora",
    ],
  },
  {
    name: "Ramanathaswamy Temple",
    slug: "ramanathaswamy-temple-rameswaram",
    deity: "Lord Shiva (Ramanathaswamy Jyotirlinga)",
    consecrationEra: "12th Century CE (Expanded by Pandya and Jaffna Sethupathi rulers through 18th Century)",
    patronMaker: "Pandya Dynasty and Jaffna kings of Sethupathi lineage (King Muthuramalinga Sethupathi)",
    history:
      "Perched on the holy island of Rameswaram, Ramanathaswamy Temple is both one of the four sacred Char Dham destinations and one of the twelve divine Jyotirlingas, revered as the holy site where Lord Rama consecrated a Shiva Linga crafted by Sita to seek atonement following his victory over Ravana. The temple is universally celebrated for housing the longest pillared corridor in the world, with its outer third corridor stretching 1,212 metres lined by 1,212 intricately sculpted monolithic granite pillars. Before entering the sanctum, pilgrims traditionally take holy dips in twenty-two sacred theerthams (water kunds) within the temple compound, each containing fresh water with documented mineral compositions.",
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
    architecturalStyle: "Dravidian Architecture (World's Longest Outer Corridor & Soaring Gopurams)",
    ticketAndTimings:
      "Darshan: 05:00 AM – 01:00 PM & 03:00 PM – 09:00 PM daily. 22 holy kund theertham bathing: 05:30 AM – 12:00 PM. Free general entry; Special Darshan ₹50; Spatika Linga Darshan 05:00 AM – 06:00 AM.",
    category: "temple",
    preservationState: "Active Place of Worship",
    heroImage: "/uploads/hero-heritage.jpg",
    aliases: [
      "ramanathaswamy",
      "rameswaram temple",
      "rameshwaram",
      "ramanathaswamy temple",
      "rameswaram",
      "rameshwaram temple",
    ],
  },
];

/**
 * Enforces the strict markdown template required for any temple inquiry.
 */
export function formatTempleResponse(temple: TempleEntry): string {
  return [
    `### ${temple.name}`,
    `- **Presiding Deity**: ${temple.deity}`,
    `- **Consecration & Era**: ${temple.consecrationEra} (${temple.architecturalStyle})`,
    `- **Patron & Maker**: ${temple.patronMaker}`,
    `- **Historical Legacy**: ${temple.history}`,
    `- **Geographic Location**: ${temple.locationDetails.landmark ? `${temple.locationDetails.landmark}, ` : ""}${temple.locationDetails.district}, ${temple.locationDetails.state} (Near ${temple.locationDetails.nearestCity})`,
    `- **How to Reach**:`,
    `  - *Air*: ${temple.howToReach.air}`,
    `  - *Rail*: ${temple.howToReach.rail}`,
    `  - *Road / Trek*: ${temple.howToReach.road}`,
    ``,
    `> **Darshan & Visitor Guide**: ${temple.ticketAndTimings}`,
  ].join("\n");
}

/**
 * Checks if a user's question is asking about one of our iconic temples.
 */
export function findTempleMatch(query: string): TempleEntry | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();

  // 1. Direct slug or name check
  for (const t of HISTORIC_TEMPLES) {
    if (q.includes(t.slug) || q.includes(t.name.toLowerCase())) {
      return t;
    }
    for (const alias of t.aliases) {
      // Check full word match or inclusion
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(q) || q.includes(alias)) {
        return t;
      }
    }
  }

  // 2. Specific intent checks:
  // "Who built Kailasa" -> Kailasa
  if (q.includes("kailasa") || q.includes("kailash") || q.includes("cave 16")) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "kailasa-temple-ellora");
  }
  // "How to reach Somnath" -> Somnath
  if (q.includes("somnath")) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "somnath-temple");
  }
  // "Kedarnath" -> Kedarnath
  if (q.includes("kedarnath") || q.includes("kedar")) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "kedarnath-temple");
  }
  // "Kashi" or "Vishwanath" -> Kashi Vishwanath
  if (q.includes("kashi") || q.includes("vishwanath") || (q.includes("varanasi") && q.includes("temple"))) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "kashi-vishwanath-temple");
  }
  // "Meenakshi" -> Meenakshi Sundareswarar
  if (q.includes("meenakshi") || (q.includes("madurai") && q.includes("temple"))) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "meenakshi-sundareswarar-temple");
  }
  // "Puri" or "Jagannath" -> Puri Jagannath
  if (q.includes("jagannath") || (q.includes("puri") && q.includes("temple"))) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "puri-jagannath-temple");
  }
  // "Tirupati" or "Balaji" or "Venkateswara" -> Tirupati
  if (q.includes("tirupati") || q.includes("balaji") || q.includes("venkateswara") || q.includes("tirumala")) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "tirupati-venkateswara-temple");
  }
  // "Rameswaram" or "Ramanathaswamy" -> Ramanathaswamy
  if (q.includes("rameswaram") || q.includes("rameshwaram") || q.includes("ramanathaswamy")) {
    return HISTORIC_TEMPLES.find((t) => t.slug === "ramanathaswamy-temple-rameswaram");
  }

  return undefined;
}

/**
 * System prompt guidelines for Bharti, ensuring strict temple guardrails.
 */
export const BHARTI_TEMPLE_GUARDRAILS = `
### MANDATORY TEMPLE RESPONSE DIRECTIVE:
When the user asks about any temple (such as Kedarnath, Kashi Vishwanath, Meenakshi Sundareswarar, Somnath, Puri Jagannath, Tirupati Venkateswara, Kailasa Temple, or Ramanathaswamy):
You MUST strictly respond using the exact structured format:
### [Temple Name]
- **Presiding Deity**: [God / Goddess name]
- **Consecration & Era**: [Year / Century & Architectural Style]
- **Patron & Maker**: [King / Dynasty]
- **Historical Legacy**: [2-3 sentences on significance and legends]
- **Geographic Location**: [Precise district, state, landmark]
- **How to Reach**:
  - *Air*: [Nearest airport & distance]
  - *Rail*: [Nearest station]
  - *Road / Trek*: [Route details]

Do not alter these bullet keys. Never omit transit details or patron dynasty names.
`;
