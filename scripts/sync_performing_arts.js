// scripts/sync_performing_arts.js
import fs from 'fs';

const performingArtsEntries = [
  {
    "id": "art-kerala-kathakali",
    "title": "Kathakali & Koodiyattam",
    "category": "performing_arts",
    "state": "Kerala",
    "region": "South",
    "shortDescription": "UNESCO Intangible Cultural Heritage — Classical Sanskrit temple theatre and dance-drama distinguished by green pacha facial makeup, towering kireedam headdresses, and codified eye mudras.",
    "heritageStatus": "UNESCO Intangible Cultural Heritage",
    "imageUrl": "/images/arts/kathakali_kerala.jpg",
    "tags": ["kathakali", "koodiyattam", "unesco", "temple-theatre", "mudra"]
  },
  {
    "id": "art-tn-bharatanatyam",
    "title": "Bharatanatyam",
    "category": "performing_arts",
    "state": "Tamil Nadu",
    "region": "South",
    "shortDescription": "Ancient classical dance originating from Tamil temple devadasis, codified in the Natya Shastra with geometric aramandi postures, intricate rhythmic adavus, and emotive abhinaya.",
    "heritageStatus": "Classical Tradition",
    "imageUrl": "/images/arts/bharatanatyam_tamilnadu.jpg",
    "tags": ["bharatanatyam", "natya-shastra", "classical-dance", "adavus", "tanjore"]
  },
  {
    "id": "art-gujarat-garba-raas",
    "title": "Garba & Raas",
    "category": "performing_arts",
    "state": "Gujarat",
    "region": "West",
    "shortDescription": "UNESCO Intangible Cultural Heritage — Devotional circular folk dance performed with wooden sticks (dandiya) and synchronised claps, symbolising the cyclic nature of time and cosmic creation.",
    "heritageStatus": "UNESCO Intangible Cultural Heritage",
    "imageUrl": "/images/arts/garba_dance_gujarat.jpg",
    "tags": ["garba", "dandiya-raas", "divine-feminine", "unesco", "folk-dance"]
  },
  {
    "id": "art-punjab-bhangra",
    "title": "Bhangra & Giddha",
    "category": "performing_arts",
    "state": "Punjab",
    "region": "North",
    "shortDescription": "Exuberant Punjabi folk dances celebrating the bountiful rabi harvest, propelled by driving dhol beats, chimta tongs, boliyan poetry, and athletic acrobatics.",
    "heritageStatus": "Folk Tradition",
    "imageUrl": "/images/arts/bhangra_punjab.jpg",
    "tags": ["bhangra", "giddha", "dhol", "punjabi-folk", "harvest-dance"]
  },
  {
    "id": "dance-ghoomar-01",
    "title": "Ghoomar Folk Dance",
    "category": "performing_arts",
    "state": "Rajasthan",
    "region": "West",
    "shortDescription": "Graceful royal twirling dance developed by the Bhil tribe and adopted by Rajput royalty, performed by veiled women in swirling multi-hued ghaghras.",
    "heritageStatus": "UNESCO Intangible Cultural Heritage",
    "imageUrl": "/images/arts/ghoomar_rajasthan.jpg",
    "tags": ["ghoomar", "rajasthani-dance", "ghaghra", "unesco", "folk-dance"]
  },
  {
    "id": "art-odisha-odissi",
    "title": "Odissi",
    "category": "performing_arts",
    "state": "Odisha",
    "region": "East",
    "shortDescription": "Sculptural classical temple dance codified in ancient Odishan temple reliefs, renowned for the lyrical tribhanga (three-bend) body posture, fluid torso movements, and Gita Govinda bhakti.",
    "heritageStatus": "Classical Tradition",
    "imageUrl": "/images/arts/odissi_odisha.jpg",
    "tags": ["odissi", "tribhanga", "jagannath", "classical-dance", "odisha"]
  },
  {
    "id": "art-up-kathak",
    "title": "Kathak",
    "category": "performing_arts",
    "state": "Uttar Pradesh",
    "region": "North",
    "shortDescription": "Classical storytelling dance nurtured across temple courtyards and Mughal royal courts of Lucknow and Banaras, renowned for swift pirouettes (chakkars) and rhythmic footwork (tatkar).",
    "heritageStatus": "Classical Tradition",
    "imageUrl": "/images/arts/kathak_up.jpg",
    "tags": ["kathak", "lucknow-gharana", "chakkars", "tatkar", "ghungroo"]
  },
  {
    "id": "art-karnataka-yakshagana",
    "title": "Yakshagana",
    "category": "performing_arts",
    "state": "Karnataka",
    "region": "South",
    "shortDescription": "Vibrant coastal folk theatre combining classical music, energetic battle steps, towering pagade headgear, intricate face makeup, and spontaneous dialogue drawn from the epics.",
    "heritageStatus": "Folk Theatre",
    "imageUrl": "/images/arts/yakshagana_karnataka.jpg",
    "tags": ["yakshagana", "folk-theatre", "kannada", "maddale", "costumes"]
  },
  {
    "id": "art-manipur-raas-leela",
    "title": "Manipuri Raas Leela",
    "category": "performing_arts",
    "state": "Manipur",
    "region": "Northeast",
    "shortDescription": "Classical lyrical dance expressing the divine romance of Radha and Krishna, performed with smooth, continuous circular motions and iconic cylindrical, mirror-embroidered Kumil skirts.",
    "heritageStatus": "Classical Tradition",
    "imageUrl": "/images/arts/manipuri_raas_manipur.jpg",
    "tags": ["manipuri", "raas-leela", "kumil", "radha-krishna", "classical"]
  },
  {
    "id": "art-assam-sattriya",
    "title": "Sattriya",
    "category": "performing_arts",
    "state": "Assam",
    "region": "Northeast",
    "shortDescription": "500-year-old monastery dance created by Vaishnavite saint Srimanta Sankardev in Assam's satras, combining devotional Ankiya Nat drama, cymbals (bartal), and khol drumming.",
    "heritageStatus": "Classical Tradition",
    "imageUrl": "/images/arts/sattriya_assam.jpg",
    "tags": ["sattriya", "sankardev", "satra", "classical-dance", "assam"]
  },
  {
    "id": "art-chhattisgarh-pandavani",
    "title": "Pandavani",
    "category": "performing_arts",
    "state": "Chhattisgarh",
    "region": "Central",
    "shortDescription": "Epic folk ballad singing narrating stories from the Mahabharata with a single stringed tambura / ektara, made legendary internationally by master exponent Teejan Bai.",
    "heritageStatus": "Folk Tradition",
    "imageUrl": "/images/arts/pandavani_chhattisgarh.jpg",
    "tags": ["pandavani", "teejan-bai", "mahabharata", "ballad", "chhattisgarh"]
  },
  {
    "id": "art-east-chhau",
    "title": "Chhau Dance",
    "category": "performing_arts",
    "state": "Jharkhand / West Bengal",
    "region": "East",
    "shortDescription": "UNESCO Intangible Cultural Heritage — Martial and acrobatics-infused masked folk dance depicting episodes from the Ramayana, Mahabharata, and local folklore to the thunderous beats of nagara and dhol.",
    "heritageStatus": "UNESCO Intangible Cultural Heritage",
    "imageUrl": "/images/arts/chhau_dance_east.jpg",
    "tags": ["chhau", "unesco", "martial-dance", "purulia", "seraikella", "masks"]
  }
];

const paths = ['src/data/categories_seed.json', 'app/data/categories_seed.json'];

for (const p of paths) {
  if (fs.existsSync(p)) {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    // Filter out existing performing_arts
    const nonPerforming = raw.filter(item => item.category !== 'performing_arts');
    
    // Find index of first festival item or insert after festivals
    const lastFestIndex = nonPerforming.findLastIndex(item => item.category === 'festivals');
    const insertIndex = lastFestIndex >= 0 ? lastFestIndex + 1 : 0;
    
    nonPerforming.splice(insertIndex, 0, ...performingArtsEntries);
    
    fs.writeFileSync(p, JSON.stringify(nonPerforming, null, 2), 'utf8');
    console.log(`[OK] Successfully updated ${p} with ${performingArtsEntries.length} performing arts entries.`);
  }
}
