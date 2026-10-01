const fs = require('fs');

const heritageRecords = JSON.parse(fs.readFileSync('src/data/heritage_records.json', 'utf8'));

// 1. Sync Monuments in src/data/monuments.json & app/data/monuments.json
const monumentEntries = [
  {
    id: "monument-kinnaur-temple",
    slug: "kinnaur-wooden-temple",
    name: "Wooden Hill Temple Architecture of Kinnaur",
    city: "Kinnaur Valley",
    state: "Himachal Pradesh",
    lat: 31.5358,
    lng: 78.2758,
    architecturalStyle: "Kath-Kuni Himalayan Timber Architecture",
    constructionEra: "12th – 15th Century CE",
    patronDynasty: "Bushahr State & Himalayan Village Republics",
    preservationScore: "92% Stable (Community Timber Care & Earthquake-Resistant Engineering)",
    unesco: false,
    visitorDetails: {
      timings: "06:00 AM – 06:00 PM (Daily)",
      entryFee: "Free entry for all pilgrims and visitors",
      bestSeason: "April to October (Pleasant Himalayan summer and harvest season)",
      photographyFee: "Free outside sanctum"
    },
    audioNarrationScript: "Deep within the Sutlej and Baspa river valleys of Kinnaur, indigenous village shrines represent the architectural peak of Himalayan timber construction. Engineered using the traditional Kath-Kuni technique, alternating courses of hand-hewn Himalayan deodar logs and metamorphic stone are interlocked without nails or mortar.",
    audioDurationSeconds: 25,
    heroImage: "/images/monuments/kinnaur_wooden_temple.jpg",
    thumbnail: "/images/monuments/kinnaur_wooden_temple.jpg",
    highlights: [
      "Interlocking dry-stone and deodar wood Kath-Kuni framework",
      "Multi-tiered slate pagoda roofs and cantilevered wooden balconies",
      "Intricate low-relief carvings of serpents and village protector deities"
    ]
  },
  {
    id: "monument-dwarkadhish-temple",
    slug: "dwarkadhish-temple",
    name: "Dwarkadhish Temple (Jagat Mandir)",
    city: "Dwarka",
    state: "Gujarat",
    lat: 22.2376,
    lng: 68.9678,
    architecturalStyle: "Chalukya-Nagara Coastal Sandstone Architecture",
    constructionEra: "16th Century CE (Current Edifice; Consecrated 2,200+ years BP)",
    patronDynasty: "Vajranabha (Grandson of Krishna) / Later Western Satraps & Chalukyas",
    preservationScore: "95% Intact (Active Char Dham Sanctum Protected by ASI)",
    unesco: false,
    visitorDetails: {
      timings: "06:30 AM – 01:00 PM, 05:00 PM – 09:30 PM",
      entryFee: "Free entry; VIP Darshan passes available via temple trust",
      bestSeason: "October to March (Pleasant coastal breezes; Janmashtami festivities in Aug/Sep)",
      photographyFee: "No electronic devices allowed inside sanctum"
    },
    audioNarrationScript: "Revered as Jagat Mandir, Dwarkadhish stands at the confluence of the sacred Gomti River and the Arabian Sea. Supported by 72 exquisitely sculpted limestone pillars, this five-story sanctuary is crowned by a 52-yard ceremonial banner hoisted five times daily.",
    audioDurationSeconds: 24,
    heroImage: "/images/monuments/dwarkadhish_temple.jpg",
    thumbnail: "/images/monuments/dwarkadhish_temple.jpg",
    highlights: [
      "Five-story Chalukya-Nagara limestone shikhara on 72 sculpted pillars",
      "Ritual hoisting of the 52-yard Dhwaja displaying the Sun and Moon",
      "Sacred Sangam Ghat at the confluence of Gomti River and the Arabian Sea"
    ]
  }
];

function syncMonuments() {
  const paths = ['src/data/monuments.json', 'app/data/monuments.json'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      
      // Update existing records with verified image paths and slugs
      for (const item of list) {
        if (item.slug === 'kedarnath-temple') {
          item.heroImage = '/images/monuments/kedarnath_temple.jpg';
          item.thumbnail = '/images/monuments/kedarnath_temple.jpg';
        }
        if (item.slug === 'kashi-vishwanath-temple') {
          item.heroImage = '/images/monuments/kashi_vishwanath.jpg';
          item.thumbnail = '/images/monuments/kashi_vishwanath.jpg';
        }
        if (item.slug === 'meenakshi-sundareswarar-temple') {
          item.heroImage = '/images/monuments/meenakshi_sundareswarar.jpg';
          item.thumbnail = '/images/monuments/meenakshi_sundareswarar.jpg';
        }
        if (item.slug === 'somnath-temple') {
          item.heroImage = '/images/monuments/somnath_temple.jpg';
          item.thumbnail = '/images/monuments/somnath_temple.jpg';
        }
        if (item.slug === 'puri-jagannath-temple') {
          item.heroImage = '/images/monuments/puri_jagannath.jpg';
          item.thumbnail = '/images/monuments/puri_jagannath.jpg';
        }
        if (item.slug === 'tirupati-venkateswara-temple') {
          item.heroImage = '/images/monuments/tirupati_venkateswara.jpg';
          item.thumbnail = '/images/monuments/tirupati_venkateswara.jpg';
        }
        if (item.slug === 'kailasa-temple-ellora' || item.slug === 'kailasa-ellora-cave-16') {
          item.slug = 'kailasa-ellora-cave-16';
          item.heroImage = '/images/monuments/kailasa_ellora.jpg';
          item.thumbnail = '/images/monuments/kailasa_ellora.jpg';
        }
        if (item.slug === 'ramanathaswamy-temple-rameswaram' || item.slug === 'ramanathaswamy-temple') {
          item.slug = 'ramanathaswamy-temple';
          item.heroImage = '/images/monuments/ramanathaswamy_temple.jpg';
          item.thumbnail = '/images/monuments/ramanathaswamy_temple.jpg';
        }
      }

      // Add kinnaur and dwarkadhish if missing
      for (const m of monumentEntries) {
        if (!list.some(x => x.slug === m.slug)) {
          list.push(m);
        }
      }

      fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Updated ${p} - now contains ${list.length} monuments.`);
    }
  }
}

// 2. Sync Crafts
function syncCrafts() {
  const craftEntry = {
    id: "craft-odisha-palm-leaf",
    slug: "odisha-palm-leaf-manuscript",
    title: "Palm-Leaf Manuscript Tradition (Tala Pattachitra)",
    name: "Palm-Leaf Manuscript Tradition (Tala Pattachitra)",
    craftName: "Tala Pattachitra (Palm-Leaf Etching)",
    state: "Odisha",
    region: "East",
    category: "Crafts & Textiles",
    giTag: "Geographical Indication (GI) Registered",
    heritageStatus: "Geographical Indication (GI) Registered",
    imageUrl: "/images/crafts/odisha_palm_leaf.jpg",
    heroImage: "/images/crafts/odisha_palm_leaf.jpg",
    tags: ["Tala Patra", "Iron Stylus", "Natural Lampblack", "Puri Heritage", "Manuscript Painting", "Crafts & Textiles"],
    shortDescription: "Ancient epigraphic and illustrative art incised with a sharp iron stylus on cured palmyra palm leaves.",
    fullDescription: "Known natively as 'Tala Pattachitra', Odisha's palm-leaf manuscript tradition dates back over a millennium as an epigraphic medium for recording sacred texts, treatises, and astrological horoscopes. Artisans harvest fronds from the Palmyra palm (Borassus flabellifer), cure them in turmeric water, dry them in shaded breezes, and cut them to uniform sizes. Master calligraphers and painters etch intricate line drawings directly onto the brittle surface using a fine-tipped iron stylus (Lekhani). Natural lampblack mixed with bean juice is rubbed into the fine incisions to reveal black illustrative registers depicting the Gita Govinda, Ramayana, and botanical motifs, stitched together with silk cord."
  };

  const paths = ['src/data/crafts_seed.json', 'app/data/crafts_seed.json'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (!list.some(x => x.slug === craftEntry.slug)) {
        list.push(craftEntry);
        fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
        console.log(`[OK] Added Tala Pattachitra to ${p}.`);
      }
    }
  }
}

// 3. Sync Culinary
function syncCulinary() {
  const culinaryEntry = {
    id: "dish-chettinad-kitchen",
    slug: "chettinad-kitchen-traditions",
    title: "Chettinad Kitchen & Culinary Traditions",
    name: "Chettinad Kitchen & Culinary Traditions",
    dishName: "Chettinad Kitchen Traditions",
    state: "Tamil Nadu",
    region: "South",
    category: "Food Traditions",
    heritageClassification: "Heritage Culinary Tradition",
    imageUrl: "/images/food/chettinad_kitchen.jpg",
    heroImage: "/images/food/chettinad_kitchen.jpg",
    tags: ["Nattukotai Chettiars", "Stone Ground Spices", "Kalpasi", "Cast Iron Adukku", "Banana Leaf", "Food Traditions"],
    shortDescription: "Famed culinary lineage of maritime merchant traders, defined by freshly hand-ground black pepper, kalpasi, and sun-dried meats.",
    fullDescription: "Originating from the seafaring merchant community of Nattukottai Chettiars, Chettinad cuisine is one of India's most aromatic and complex culinary traditions. Developed through overseas trade links across Burma, Ceylon, and Southeast Asia, Chettinad recipes rely on stone-ground spice pastes featuring star anise, marathi mokku (dried flower pods), and kalpasi (black stone flower). Traditional kitchens (Veedukal) prepare dishes like Chettinad Kozhi, Vellai Paniyaram, and sun-dried crisps (Vadam) in heavy brass, seasoned soapstone (Kalchatti), and cast-iron cookware over wood-fired stoves."
  };

  const paths = ['src/data/culinary_seed.json', 'app/data/culinary_seed.json'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (!list.some(x => x.slug === culinaryEntry.slug)) {
        list.push(culinaryEntry);
        fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
        console.log(`[OK] Added Chettinad Kitchen to ${p}.`);
      }
    }
  }
}

// 4. Sync Performing Arts
function syncPerformingArts() {
  const artsEntries = [
    {
      id: "art-baul-song-bengal",
      slug: "baul-song-bengal",
      title: "Baul Song Tradition of Bengal",
      name: "Baul Song Tradition of Bengal",
      category: "Performing Arts",
      state: "West Bengal",
      region: "East",
      unescoStatus: "UNESCO Intangible Cultural Heritage",
      heritageStatus: "UNESCO Intangible Cultural Heritage",
      imageUrl: "/images/performing_arts/baul_song_bengal.jpg",
      heroImage: "/images/performing_arts/baul_song_bengal.jpg",
      tags: ["Folk Music", "Ektara", "Lalon Shah", "UNESCO Intangible Heritage", "Mystic Poetry", "Baul", "Performing Arts"],
      shortDescription: "Wandering mystic minstrelsy singing ecstatic acoustic ballads of cosmic love and casteless spiritual surrender.",
      fullDescription: "Inscribed on UNESCO's Representative List of the Intangible Cultural Heritage, the Bauls of rural Bengal represent an unbroken spiritual and musical counter-culture rooted in Vaishnava Sahajiya, Tantric philosophy, and Sufi mysticism. Carrying an Ektara (single-string drone plucked with one finger), a brass cymbal, and ankle bells (ghungroos), Baul singers like the lineage of Fakir Lalon Shah perform at rural gatherings (Akhras) and village fairs, singing ecstatic allegories that dismiss caste and formal religion in search of the 'Moner Manush' (the inner soul)."
    },
    {
      id: "art-majuli-sattriya-satra",
      slug: "majuli-sattriya-satra-life",
      title: "Sattriya Dance & Satra Life of Majuli",
      name: "Sattriya Dance & Satra Life of Majuli",
      category: "Performing Arts",
      state: "Assam",
      region: "Northeast",
      unescoStatus: "Classical Dance & Monastic Living Tradition",
      heritageStatus: "Classical Dance & Monastic Living Tradition",
      imageUrl: "/images/performing_arts/majuli_sattriya_satra.jpg",
      heroImage: "/images/performing_arts/majuli_sattriya_satra.jpg",
      tags: ["Classical Dance", "Bhakti Movement", "Monastic Satras", "Bamboo Masks", "Khol & Bor-Taal", "Majuli", "Performing Arts"],
      shortDescription: "500-year-old living monastic art form preserved by celibate monks on the Brahmaputra's river island of Majuli.",
      fullDescription: "Instituted in the 15th century by saint-reformer Srimanta Sankaradeva, the Satras (monasteries) of Majuli island have continuously fostered the classical dance form of Sattriya and devotional theatre (Ankiya Nat). Resident monks (Bhakats) practice celibate, communal routines dedicated to learning complex rhythmic footwork, classical hastas, and musical performance using the terracotta Khol drum and heavy Bor-taal cymbals. The tradition also maintains master craftsmanship in fabricating oversized bamboo and cow-dung theatrical masks (Mukhas) depicting demons and avatars."
    },
    {
      id: "art-pandavani-chhattisgarh",
      slug: "pandavani-epic-chhattisgarh",
      title: "Pandavani Oral Ballad Tradition",
      name: "Pandavani Oral Ballad Tradition",
      category: "Performing Arts",
      state: "Chhattisgarh",
      region: "Central",
      unescoStatus: "National Living Oral Epic Tradition",
      heritageStatus: "National Living Oral Epic Tradition",
      imageUrl: "/images/performing_arts/pandavani_chhattisgarh.jpg",
      heroImage: "/images/performing_arts/pandavani_chhattisgarh.jpg",
      tags: ["Oral Epics", "Mahabharata", "Teejan Bai", "Tambura", "Folk Theatre", "Pandavani", "Performing Arts"],
      shortDescription: "Electrifying solo folk rendition of the Mahabharata, enacted with a stringed tambura brandished as a bow, sword, or mace.",
      fullDescription: "Pandavani (literally 'Songs of the Pandavas') is a dynamic tribal and rural oral performance tradition from Chhattisgarh, recounting the trials and battles of the Mahabharata with a focal emphasis on the heroic deeds of Bhima. Performed in two primary styles—Vedamati (seated, classical recitation) and Kapalik (standing, kinetic theatrical dramatization pioneered by legendary performer Teejan Bai)—the lead narrator strums a single-stringed tambura adorned with peacock feathers, wielding the instrument dynamically as Bhima’s mace, Arjuna’s bow, or a royal battle chariot amidst responsive singing from accompanying drummers."
    }
  ];

  const paths = ['src/data/performing_arts_seed.json', 'app/data/performing_arts_seed.json'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      for (const art of artsEntries) {
        if (!list.some(x => x.slug === art.slug)) {
          list.push(art);
        }
      }
      fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Updated ${p} with performing arts entries.`);
    }
  }
}

// 5. Sync categories_seed.json
function syncCategoriesSeed() {
  const paths = ['src/data/categories_seed.json', 'app/data/categories_seed.json'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      for (const rec of heritageRecords) {
        let cat = 'crafts';
        if (rec.category === 'Monuments & Sites') cat = 'monuments';
        else if (rec.category === 'Food Traditions') cat = 'culinary';
        else if (rec.category === 'Performing Arts') cat = 'performing_arts';
        else if (rec.category === 'Crafts & Textiles') cat = 'crafts';

        const existing = list.find(x => x.id === rec.id || x.slug === rec.slug);
        const entry = {
          id: rec.id,
          slug: rec.slug,
          title: rec.title,
          category: cat,
          state: rec.region.split(',')[1]?.trim() || "India",
          region: rec.region.includes('Odisha') || rec.region.includes('Bengal') ? 'East' :
                  rec.region.includes('Himachal') || rec.region.includes('Uttarakhand') || rec.region.includes('Pradesh') ? 'North' :
                  rec.region.includes('Tamil') || rec.region.includes('Andhra') ? 'South' :
                  rec.region.includes('Gujarat') || rec.region.includes('Maharashtra') ? 'West' :
                  rec.region.includes('Assam') ? 'Northeast' : 'Central',
          shortDescription: rec.shortDescription,
          fullDescription: rec.fullDescription,
          heritageStatus: rec.giTag || (rec.tags.some(t => t.toLowerCase().includes('unesco')) ? 'UNESCO Intangible Cultural Heritage' : 'National Heritage'),
          imageUrl: rec.imageUrl,
          tags: rec.tags
        };

        if (!existing) {
          list.push(entry);
        } else {
          Object.assign(existing, entry);
        }
      }
      fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Updated ${p} - now contains ${list.length} category items.`);
    }
  }
}

syncMonuments();
syncCrafts();
syncCulinary();
syncPerformingArts();
syncCategoriesSeed();
console.log('All dataset synchronizations complete.');
