import type { FestivalDossier } from "@/types/festival";
import type { HeritageSite } from "@/lib/heritage-data";

export const FESTIVAL_DOSSIERS: FestivalDossier[] = [
  {
    id: "fest-garba-01",
    slug: "navratri-garba",
    name: "Navratri Garba Festival",
    nativeName: "ગરબા નવરાત્રી",
    state: "Gujarat",
    region: "West",
    monthHindi: "Ashwin (Sept–Oct)",
    significance: "UNESCO Intangible Cultural Heritage — Nine nights of devotional circular rhythm dance, honoring Shakti (the Divine Feminine) through community celebration across every village and metropolis.",
    unescoStatus: "UNESCO Intangible Cultural Heritage of Humanity",
    heroImage: "/images/festivals/garba_gujarat.jpg",
    historicalOrigin: {
      period: "10th century CE / Puranic Shakta traditions",
      lineage: "Rooted in the worship of Goddess Mahishasuramardini, the dance centers around the 'Garbha Deep'—an earthen pot with a burning lamp symbolizing the cosmic womb, divine life force, and the universe.",
      deityOrTheme: "Goddess Durga / Amba / Divine Feminine",
    },
    rituals: [
      {
        day: "Day 1 (Pratipada)",
        title: "Ghatasthapana & Sowing the Sacred Barley",
        description: "Devotees establish the sanctified kalasha (water pot) with mango leaves and coconut, sowing barley seeds in clay trays to measure the season's agricultural blessings.",
      },
      {
        day: "Days 2–7 (Dwitiya to Saptami)",
        title: "Mandvi Garba & Concentric Clapping Circles",
        description: "Community dancers in vibrant hand-embroidered attire circle the perforated Garbi lantern in synchronized two-clap and three-clap (tran-tali) rhythms, picking up tempo until past midnight.",
      },
      {
        day: "Day 8 (Maha Ashtami)",
        title: "Ashtami Havan & Aarti of Amba",
        description: "Sacred fire oblations (havan) honor Goddess Mahagauri, followed by grand simultaneous aartis across millions of households, temples, and open town squares.",
      },
      {
        day: "Day 9 (Maha Navami)",
        title: "Kanya Puja & Siddhidatri Veneration",
        description: "Nine young prepubescent girls, reverenced as living avatars of the Navadurgas, are offered sacred halwa, puri, black chana, and auspicious red chunris.",
      },
      {
        day: "Day 10 (Vijayadashami)",
        title: "Dussehra & Fafda-Jalebi Community Feast",
        description: "Celebration of good over evil with the symbolic burning of effigies of Ravana, accompanied by long queues outside street halwais for crisp fafda and piping hot saffron jalebis.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Fafda-Jalebi & Papaya Sambharo",
        description: "Crunchy spiced besan strips served with hot, saffron-syrup soaked jalebis and raw grated papaya relish with green chillies.",
      },
      {
        dishName: "Kuttu ki Puri & Sukhi Aloo Bhaji",
        description: "Buckwheat flour flatbreads served with cumin-tempered rock-salt potato curry for fasting devotees.",
      },
      {
        dishName: "Sabudana Vada & Makhana Kheer",
        description: "Crisp tapioca fritters paired with slow-simmered lotus seed pudding infused with cardamom and sliced pistachios.",
      },
    ],
    artisanalEcosystem: "Thousands of Kutchi Rabari, Ahir, and Meghwal women hand-embroider chaniya cholis with Abhala mirrorwork; traditional potters sculpt thousands of perforated terracotta Garbha Deep lanterns; Rajkot and Surat jewelers cast oxidized silver jewelry.",
    folkInstruments: ["Dhol", "Manjira", "Dandiya", "Shehnai", "Tabla"],
  },
  {
    id: "fest-wb-durga-puja",
    slug: "durga-puja-kolkata",
    name: "Durga Puja of Kolkata",
    nativeName: "শারদোৎসব দুর্গাপূজা",
    state: "West Bengal",
    region: "East",
    monthHindi: "Ashwin (Shukla Paksha)",
    significance: "UNESCO Intangible Cultural Heritage — The world's largest public arts festival, turning Kolkata into an open-air pavilion gallery of contemporary architecture, clay sculpting, and devotional fervor.",
    unescoStatus: "UNESCO Intangible Cultural Heritage of Humanity",
    heroImage: "/images/festivals/durga_puja_bengal.jpg",
    historicalOrigin: {
      period: "16th century CE (Baroari public community pujas formalized in 1790)",
      lineage: "Celebrates the Devi's annual descent from Mount Kailash to her paternal home with children Lakshmi, Saraswati, Ganesha, and Kartikeya, culminating in the vanquishing of the demon Mahishasura.",
      deityOrTheme: "Maa Durga Mahishasuramardini",
    },
    rituals: [
      {
        day: "Mahalaya",
        title: "Chakkhudaan & Birendra Krishna Bhadra Chants",
        description: "At dawn, Bengal awakens to the radio recital of Mahishasuramardini. Master Patuas paint the divine eyes of the idol in Kumartuli.",
      },
      {
        day: "Maha Shashthi",
        title: "Bodhon & Adhibas (The Awakening)",
        description: "The face of the goddess is unveiled beneath a Bilva tree, awakening the divine consciousness with conch shells and sacred chants.",
      },
      {
        day: "Maha Saptami",
        title: "Kola Bou Snan (The Sacred Banana Plant)",
        description: "A tender banana plant representing Ganesha's consort and Mother Nature is draped in a red-bordered saree and bathed in the Hooghly river.",
      },
      {
        day: "Maha Ashtami",
        title: "Sandhi Puja with 108 Lotuses",
        description: "The peak moment at the exact conjunction of Ashtami and Navami, commemorating Chamunda slaying Chanda and Munda with 108 oil lamps and 108 lotuses.",
      },
      {
        day: "Maha Navami",
        title: "Dhunuchi Naach & Dhaak Rhythms",
        description: "Devotees perform trance-like dances balancing smoking earthen incense burners on their palms and forehead amidst thunderous Dhaak percussion.",
      },
      {
        day: "Bijoya Dashami",
        title: "Sindoor Khela & River Immersion (Visarjan)",
        description: "Married women smear vermilion on Maa Durga and each other, bidding a tearful farewell as idols are immersed in the Ganga with chants of 'Ashe bochor abar hobe!'.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Khichuri Bhog & Labra",
        description: "Fragrant Gobindobhog rice and roasted moong dal khichuri paired with an unctuous 9-vegetable spiced medly.",
      },
      {
        dishName: "Chhanar Payesh & Mishti Doi",
        description: "Delicate cottage cheese pearls simmered in condensed cardamom milk and terracotta-fermented sweet caramelized yogurt.",
      },
      {
        dishName: "Beguni & Chutney-Papad",
        description: "Gram-flour batter-fried crisp eggplant slivers served with sweet-tangy tomato-date chutney.",
      },
    ],
    artisanalEcosystem: "Kumartuli's multi-generational potters craft clay idols using Ganga silt, straw, and bamboo; thousands of rural Dhaakis travel from Murshidabad and Bankura; bamboo, jute, and dokra metalcraft artisans erect monumental temporary pavilions (pandals).",
    folkInstruments: ["Dhaak", "Kansor Ghonta", "Shankha (Conch Shell)", "Sanai"],
  },
  {
    id: "fest-punjab-baisakhi",
    slug: "baisakhi-lohri",
    name: "Baisakhi & Lohri",
    nativeName: "ਵੈਸਾਖੀ / ਲੋਹੜੀ",
    state: "Punjab",
    region: "North",
    monthHindi: "Vaisakh (Mid-April) & Magh (January)",
    significance: "National Cultural Asset — Dual agrarian celebration of the winter rabi crop harvest and solar new year, intertwined with the historic founding of the Sikh Khalsa Panth by Guru Gobind Singh in 1699.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/baisakhi_punjab.jpg",
    historicalOrigin: {
      period: "1699 CE at Anandpur Sahib & Ancient Vedic Solar Ingress",
      lineage: "Farmers celebrate the ripest golden wheat harvests across the five rivers; historically commemorates Guru Gobind Singh baptizing the Panj Pyare and creating the Khalsa brotherhood.",
      deityOrTheme: "Khalsa Panth & Agrarian Rabi Abundance",
    },
    rituals: [
      {
        day: "Lohri Eve",
        title: "Community Bonfire & Dulla Bhatti Ballads",
        description: "Neighborhoods gather around winter bonfires, tossing sesame seeds, rewri, and peanuts while singing the legend of Dulla Bhatti, the Robin Hood of Punjab.",
      },
      {
        day: "Baisakhi Dawn",
        title: "Prabhat Pheri & Amrit Snan",
        description: "Early morning processions sing devotional Gurbani hymns; devotees take sacred cleansing dips in holy Sarovars at the Golden Temple and Anandpur Sahib.",
      },
      {
        day: "Midday",
        title: "Nagar Kirtan & Gatka Martial Arts",
        description: "Nishan Sahib flags lead grand processions with Nihang warriors demonstrating traditional swordplay, shields, and acrobatics.",
      },
      {
        day: "Afternoon",
        title: "Guru Ka Langar",
        description: "Massive community kitchens serve hot, wholesome meals to tens of thousands of visitors without distinction of caste, creed, or wealth.",
      },
      {
        day: "Evening",
        title: "Field Bhangra & Giddha Rounds",
        description: "Farmers and youth don mustard-yellow turbans and silk kurtas, celebrating harvest bounty with thunderous dhol rhythms and boliyan folk poetry.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Karah Parshad",
        description: "Sacred sweet pudding prepared in equal parts whole wheat flour, pure desi ghee, and unrefined sugar with holy water.",
      },
      {
        dishName: "Makki di Roti & Sarson da Saag",
        description: "Slow-simmered winter mustard greens tempered with garlic and white churned butter, served with corn flatbreads.",
      },
      {
        dishName: "Gur Rewri, Gajak & Peanuts",
        description: "Crunchy sesame brittle made with organic sugarcane jaggery, traditional to the Lohri bonfire gathering.",
      },
    ],
    artisanalEcosystem: "Amritsari Phulkari needlework artisans hand-embroider silk shawls; Jalandhar craftsmen handcraft leather Dhol drums and brass chimtas; traditional jutti shoemakers produce tilla-embroidered footwear.",
    folkInstruments: ["Dhol", "Chimta", "Algoza", "Tumbi", "Bugchu"],
  },
  {
    id: "fest-kerala-onam",
    slug: "onam-vallam-kali",
    name: "Onam & Vallam Kali",
    nativeName: "തിരുവോണം",
    state: "Kerala",
    region: "South",
    monthHindi: "Chingam (Aug–Sept)",
    significance: "National Cultural Asset — Ancient harvest festival welcoming mythical King Mahabali, celebrated with elaborate Pookkalam floral carpets, 26-dish Onasadya feasts, and thrilling snake boat races on backwaters.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/onam_kerala.jpg",
    historicalOrigin: {
      period: "Sangam literature / 9th century CE Kulasekhara inscriptions",
      lineage: "Commemorates the golden egalitarian reign of Asura King Mahabali who was granted a boon by Lord Vishnu's Vamana avatar to visit his beloved subjects once every year on Thiruvonam day.",
      deityOrTheme: "King Mahabali & Vamana Avatar",
    },
    rituals: [
      {
        day: "Atham (Day 1)",
        title: "Laying the First Floral Circle (Pookkalam)",
        description: "Families clean courtyards and place yellow thumbapoo flowers in a small circle, welcoming the king's forthcoming arrival.",
      },
      {
        day: "Days 2–8",
        title: "Pookkalam Expansion & Market Shopping",
        description: "Every morning, fresh rings of indigenous flowers are added, expanding the intricate geometric carpet outwards with marigolds and jasmine.",
      },
      {
        day: "Uthradam (Day 9)",
        title: "First Onam & Onakkodi Attire",
        description: "The eve of the main feast where families buy new traditional Kasavu cotton clothes and gather fresh plantain leaves from gardens.",
      },
      {
        day: "Thiruvonam (Day 10)",
        title: "Thrikkakara Appan & Grand Onasadya Feast",
        description: "Pyramidal clay deities representing Vamana and Mahabali are worshipped, followed by the legendary 26-course vegetarian banquet served on banana leaves.",
      },
      {
        day: "Vallam Kali",
        title: "Snake Boat Race of Aranmula & Nehru Trophy",
        description: "Magnificent 130-foot wooden Chundan Vallams with 100 synchronized oarsmen surge through backwaters to rhythmic Vanchipattu boat songs.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Traditional 26-dish Onasadya",
        description: "Grand plantain leaf spread featuring Avial, Olan, Kalan, Thoran, Parippu Ghee, Sambar, Rasam, and Inji Puli ginger relish.",
      },
      {
        dishName: "Palada Pradhaman & Ada Payasam",
        description: "Silky rice ribbon pudding slow-simmered in sweetened milk and jaggery-infused coconut milk with fried cashews.",
      },
      {
        dishName: "Sharkara Varatti & Upperi",
        description: "Crisp raw plantain chips tossed in caramelized jaggery, dried ginger, and cumin powder.",
      },
    ],
    artisanalEcosystem: "Balaramapuram and Kasaragod handloom weavers craft Kasavu gold-zari bordered cotton dhotis and sarees; bell-metal artisans craft traditional Nilavilakku brass lamps and Uralis; boat carpenters carve 130-foot snake boats.",
    folkInstruments: ["Chenda", "Maddalam", "Ilathalam", "Kuzhal", "Kombu"],
  },
  {
    id: "fest-tn-pongal",
    slug: "pongal-jallikattu",
    name: "Pongal & Jallikattu",
    nativeName: "தமிழர் திருநாள் பொங்கல்",
    state: "Tamil Nadu",
    region: "South",
    monthHindi: "Thai (Mid-January)",
    significance: "National Cultural Asset — Four-day agrarian thanksgiving festival honoring Surya (the Sun God) and cattle, featuring newly harvested sweet Pongal rice boiled in clay pots and traditional bull-embracing valour sports.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/pongal_tamilnadu.jpg",
    historicalOrigin: {
      period: "Sangam literature (c. 300 BCE–300 CE) as Thai Niradal",
      lineage: "Celebrates the sun's northward transition into Capricorn (Makara Sankranti), marking the end of winter and the dawn of agricultural prosperity, immortalized in the motto 'Thai Pirandhal Vazhi Pirakkum'.",
      deityOrTheme: "Surya Bhagavan & Kamadhenu (Cattle)",
    },
    rituals: [
      {
        day: "Bhogi Pongal",
        title: "Cleansing & Discarding the Old",
        description: "Houses are whitewashed and cleaned; old and unwanted household articles are consigned to morning bonfires symbolizing spiritual renewal.",
      },
      {
        day: "Surya Pongal",
        title: "The Overflowing Pot (Pongalo Pongal!)",
        description: "Families boil fresh milk and newly harvested rice with jaggery in terracotta pots tied with ginger leaves until it overflows to auspicious chants.",
      },
      {
        day: "Mattu Pongal",
        title: "Honoring Farm Cattle & Jallikattu",
        description: "Bulls and cows are bathed, their horns painted in bright colors and crowned with garlands. In villages like Alanganallur, youth test their courage embracing prize bulls.",
      },
      {
        day: "Kaanum Pongal",
        title: "Family Reunions & Social Kinship",
        description: "People visit relatives, offer food to birds on turmeric leaves, and enjoy folk music and seaside fairs.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Sakkarai Pongal",
        description: "Sweet rice cooked in boiled milk with jaggery, generous pure ghee, roasted cashew nuts, and cardamom.",
      },
      {
        dishName: "Ven Pongal & Medu Vadai",
        description: "Savory black pepper, cumin, and ginger flavored rice and moong dal porridge with crisp lentil donuts.",
      },
      {
        dishName: "Sugarcane Batons",
        description: "Freshly cut stalks of sweet sugarcane shared among family and guests.",
      },
    ],
    artisanalEcosystem: "Terracotta potters of Manamadurai craft hand-painted Pongal pots; sugarcane and turmeric farmers supply freshly harvested greens; handloom weavers of Madurai and Salem produce celebratory Koorai sarees.",
    folkInstruments: ["Thavil", "Nadaswaram", "Parai Drum", "Urumi Melam"],
  },
  {
    id: "fest-assam-bihu",
    slug: "rongali-bihu",
    name: "Rongali Bihu (Bohag Bihu)",
    nativeName: "ৰঙালী বিহু",
    state: "Assam",
    region: "Northeast",
    monthHindi: "Bohag (Mid-April)",
    significance: "National Cultural Asset — Seven-day spring festival welcoming the Assamese New Year, sowing of paddy seeds, and rejuvenation of nature with fast-paced folk dance and melodic buffalo horn flutes.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/rongali_bihu_assam.jpg",
    historicalOrigin: {
      period: "Ancient Austroasiatic & Tibeto-Burman agrarian rites / 13th century Ahom royal patronage",
      lineage: "Rooted in tribal nature reverence and the agricultural seeding calendar of the Brahmaputra valley, promoted as a unified national festival under King Rudra Singha in Rang Ghar.",
      deityOrTheme: "Spring Rebirth, Nature & Fertility",
    },
    rituals: [
      {
        day: "Goru Bihu (Day 1)",
        title: "Cattle Bathing & Protection Ritual",
        description: "Working cattle are led to rivers, washed with turmeric and wild gourd paste, and tapped with sprigs of dighlati to ward off parasites.",
      },
      {
        day: "Manuh Bihu (Day 2)",
        title: "New Year Respect & Gamosa Gift",
        description: "Elders are presented with freshly handwoven red-and-white Gamosas as tokens of profound respect, followed by traditional blessings.",
      },
      {
        day: "Gosai Bihu (Day 3)",
        title: "Shrine and Monastery Worship",
        description: "Villagers pray at local Naamghars and Satras, seeking communal harmony and abundant seasonal rains.",
      },
      {
        day: "Kutum Bihu (Day 4)",
        title: "Kinship Feasting & Pitha Sharing",
        description: "Families travel across villages to visit relatives, sharing bamboo-steamed pithas and rice beer.",
      },
      {
        day: "Senehi Bihu (Days 5–7)",
        title: "Open-Air Husori Song & Bihu Dance",
        description: "Young men and women gather under ancient banyan trees and riverbanks, dancing in rapid rhythmic hip motions to dhol and pepa tunes.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Til Pitha & Ghila Pitha",
        description: "Rolled glutinous rice pancakes stuffed with roasted black sesame and sweet jaggery, alongside fried rice fritters.",
      },
      {
        dishName: "Jolpan with Doi and Gur",
        description: "Traditional breakfast of roasted flattened rice (chira), puffed rice (muri), and sticky Bora rice with thick curd and liquid jaggery.",
      },
      {
        dishName: "Masor Tenga",
        description: "Refreshing light sour fish curry made with freshwater river carp and elephant apple (ou tenga).",
      },
    ],
    artisanalEcosystem: "Rural weavers on heirloom loin-looms weave red-and-white cotton Gamosas and Golden Muga silk mekhela chadors; bamboo craftsmen create jaapis (conical hats); horn carvers sculpt pepas from water buffalo horns.",
    folkInstruments: ["Bihu Dhol", "Pepa (Buffalo Horn Flute)", "Gogona (Bamboo Reed)", "Toka", "Taal"],
  },
  {
    id: "fest-odisha-ratha-yatra",
    slug: "puri-ratha-yatra",
    name: "Ratha Yatra of Puri",
    nativeName: "ଶ୍ରୀ ଜଗନ୍ନାଥ ରଥଯାତ୍ରା",
    state: "Odisha",
    region: "East",
    monthHindi: "Ashadha (June–July)",
    significance: "National Cultural Asset — World's oldest and grandest annual chariot procession where Lord Jagannath, Balabhadra, and Devi Subhadra step out of the sanctum sanctorum into public avenues so devotees of all castes can touch and view their deities.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/ratha_yatra_odisha.jpg",
    historicalOrigin: {
      period: "12th century CE Ganga Dynasty (Anantavarman Chodaganga Deva)",
      lineage: "Described in the Brahma Purana and Skanda Purana, the festival reenacts Krishna's journey to Kurukshetra and the divine trio's nine-day sojourn to their aunt's residence at Gundicha Temple.",
      deityOrTheme: "Lord Jagannath (Lord of the Universe), Balabhadra & Subhadra",
    },
    rituals: [
      {
        day: "Snana Yatra",
        title: "The 108 Sacred Pots Bath",
        description: "The deities are bathed with 108 pitchers of herbal water from the sacred Suna Kua, followed by a 15-day recovery isolation period (Anasara).",
      },
      {
        day: "Chhera Pahanra",
        title: "The Royal Sweeping of the Chariots",
        description: "The titular King of Puri sweeps the chariot platforms with a gold-handled broom, demonstrating that all mortals are equal before God.",
      },
      {
        day: "Ratha Tana",
        title: "The Chariot Pulling Along Grand Road",
        description: "Millions of devotees hand-pull the giant multi-wheeled timber chariots (Nandighosa, Taladhwaja, and Darpadalana) 3 km to Gundicha Temple.",
      },
      {
        day: "Gundicha Stay",
        title: "Nine-Day Sojourn & Mahaprasad",
        description: "The deities reside at their aunt's abode, partaking in divine delicacies before beginning their return journey.",
      },
      {
        day: "Bahuda Yatra & Suna Besha",
        title: "Return Journey in Solid Gold Regalia",
        description: "The return procession culminates in Suna Besha, where the deities are adorned with hundreds of kilograms of solid gold crowns and ornaments.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Puri Mahaprasad (56 Bhog)",
        description: "Sacred earthen-pot cooked fare prepared over open woodfire stoves inside the Jagannath Temple mega-kitchen.",
      },
      {
        dishName: "Puri Khaja",
        description: "Flaky layered wheat flour pastry fried in pure ghee and glazed in translucent sugar syrup.",
      },
      {
        dishName: "Chenna Poda",
        description: "Caramelized baked cottage cheese cake with cardamom, raisins, and a dark brown scorched sugar crust.",
      },
    ],
    artisanalEcosystem: "Hereditary carpenters (Maharana Sevaks) build three massive new wooden chariots every single year without blueprints or nails; Chitrakar artists paint Pattachitra scroll cloth; Applique masters of Pipili stitch vibrant chariot canopies.",
    folkInstruments: ["Mardala", "Kahali", "Ghanta (Brass Gongs)", "Shankha", "Pakhawaj"],
  },
  {
    id: "fest-bihar-chhath",
    slug: "chhath-puja",
    name: "Chhath Puja",
    nativeName: "छठ पूजा (सूर्य षष्ठी)",
    state: "Bihar",
    region: "East",
    monthHindi: "Kartik (Oct–Nov)",
    significance: "National Cultural Asset — Ancient Vedic eco-solar thanksgiving without priests, where devotees stand waist-deep in river waters offering arghya to both the setting and rising Sun God, celebrating truth, non-violence, and cosmic gratitude.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/chhath_puja_bihar.jpg",
    historicalOrigin: {
      period: "Vedic antiquity / Rigvedic Surya Vandana & Mahabharata folklore",
      lineage: "Traces directly to Vedic solar worship; legend recounts King Priyavrata performing the rite under Sage Kashyapa to save his progeny, and Karna worshipping Surya while ruling Anga (Bhagalpur).",
      deityOrTheme: "Surya Bhagavan & Chhathi Maiya (Usha/Pratyusha)",
    },
    rituals: [
      {
        day: "Day 1 (Nahay-Khay)",
        title: "Purification Bath & Satvik Meal",
        description: "Devotees take a cleansing dip in the sacred river and prepare a single meal of bottle gourd curry, brown rice, and chana dal in brass utensils.",
      },
      {
        day: "Day 2 (Kharna)",
        title: "Full-Day Fast & Evening Rasiya",
        description: "A strict fast without water throughout the day, broken only after sunset with sacred sugarcane-jaggery rice kheer cooked over mango wood.",
      },
      {
        day: "Day 3 (Sandhya Arghya)",
        title: "Evening Oblations to the Setting Sun",
        description: "Standing waist-deep in river waters at sunset, devotees hold up bamboo soop trays laden with thekua and fruits, praying to the departing solar rays.",
      },
      {
        day: "Day 4 (Usha Arghya)",
        title: "Morning Oblations to the Rising Sun & Paran",
        description: "Gathering before dawn at riverbanks, the final arghya is offered to the rising sun, followed by breaking the 36-hour fast with ginger and raw sugar.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Thekua Prasadam",
        description: "Signature whole-wheat and jaggery dry cookies stamped with traditional wooden moulds and deep fried in desi ghee.",
      },
      {
        dishName: "Rasiya Kheer & Puri",
        description: "Earthen-pot cooked rice kheer sweetened with fresh sugarcane jaggery and paired with whole-wheat fried breads.",
      },
      {
        dishName: "Sacred Soop Fruits (Dhab Lemon & Water Chestnuts)",
        description: "Whole bunches of local wild lemons, bananas, ginger plants, and water caltrops offered to the sun deity.",
      },
    ],
    artisanalEcosystem: "Rural bamboo weavers of Mithila hand-weave bamboo soop trays and dauras (baskets); potters craft clay hawan kunds, diwaliya lamps, and elephants; turmeric and ginger farmers provide fresh whole rhizomes with leaves.",
    folkInstruments: ["Sharda Sinha Folk Ballads", "Dholak", "Manjira", "Shankha"],
  },
  {
    id: "fest-mh-ganesh-chaturthi",
    slug: "ganesh-chaturthi",
    name: "Ganesh Chaturthi (Ganeshotsav)",
    nativeName: "सार्वजनिक गणेशोत्सव",
    state: "Maharashtra",
    region: "West",
    monthHindi: "Bhadrapada (Aug–Sept)",
    significance: "National Cultural Asset — Ten-day public celebration transformed by freedom fighter Lokmanya Tilak in 1893 into a mass anti-colonial cultural movement uniting diverse communities with Dhol-Tasha drumming and public pandals.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/ganesh_chaturthi_maharashtra.jpg",
    historicalOrigin: {
      period: "Satavahana / Maratha Empire (Chatrapati Shivaji Maharaj revived it in Pune)",
      lineage: "Celebrates the birth of Lord Ganesha, the remover of obstacles (Vighnaharta). Transformed in 1893 by Lokmanya Bal Gangadhar Tilak from private family shrines into public community pavilions (Sarvajanik).",
      deityOrTheme: "Lord Ganesha (Vighnaharta / Siddhivinayak)",
    },
    rituals: [
      {
        day: "Chaturthi (Day 1)",
        title: "Prana Pratishtha & Sthapana",
        description: "Priests consecrate the clay idol invoking life force with Vedic mantras, followed by Shhodashopachara (16-step worship) and modak offerings.",
      },
      {
        day: "Days 2–5",
        title: "Public Pandal Darshan & Cultural Evenings",
        description: "Lakhs of devotees visit massive thematic public pandals (such as Lalbaugcha Raja) while local mandals organize social health drives and debates.",
      },
      {
        day: "Days 6–7",
        title: "Gauri Avahan & Pujan",
        description: "The arrival of Goddess Gauri (Mahalakshmi) is celebrated as Ganesha's sister, seated with royal vegetarian banquets and traditional jewellery.",
      },
      {
        day: "Anant Chaturdashi (Day 10)",
        title: "Visarjan & Dhol-Tasha Street Procession",
        description: "Millions accompany their beloved deity to Arabian Sea beaches and rivers with 100-member Dhol-Tasha drumming troupes chanting 'Pudhchya varshi laukariya!'.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Ukadiche Modak",
        description: "Steamed rice-flour dumplings stuffed with freshly grated coconut, fragrant cardamom, nutmeg, and organic jaggery, served with melted ghee.",
      },
      {
        dishName: "Puran Poli with Katachi Amti",
        description: "Sweet flatbread stuffed with spiced chana dal and jaggery, accompanied by tangy dal broth.",
      },
      {
        dishName: "Rava Kaju Modak & Panchamrit",
        description: "Festive semolina and cashew fudge sweets alongside the five-nectar sacred offering.",
      },
    ],
    artisanalEcosystem: "Pen and Girgaon idol sculptors hand-mould eco-friendly Shadu mati (river clay) murtis; pandal decorators create miniature replicas of world wonders and heritage temples; flower mandis trade millions of marigold garlands.",
    folkInstruments: ["Dhol-Tasha Pathak", "Zanj", "Lezim", "Shehnai", "Nagada"],
  },
  {
    id: "fest-nagaland-hornbill",
    slug: "hornbill-festival",
    name: "Hornbill Festival",
    nativeName: "The Festival of Festivals",
    state: "Nagaland",
    region: "Northeast",
    monthHindi: "December (First 10 Days)",
    significance: "National Cultural Asset — Spectacular multi-tribal cultural confluence at Kisama Heritage Village, uniting all 17 indigenous Naga tribes to showcase morung tribal architecture, warrior songs, and ancestral craft lineages.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/hornbill_nagaland.jpg",
    historicalOrigin: {
      period: "Ancient indigenous tribal customs (Unified into state festival in 2000)",
      lineage: "Named after the revered Indian Hornbill bird, whose alertness, monogamy, and colorful feathers are woven into folklore, songs, and warrior headdresses of every Naga tribe.",
      deityOrTheme: "Tribal Confluence, Ancestral Valor & Harvest",
    },
    rituals: [
      {
        day: "Day 1 (Inauguration)",
        title: "Traditional Blessing of the Morungs",
        description: "Tribal elders from all 17 Naga tribes light sacred ceremonial hearth fires in their respective morungs at Kisama Heritage Village.",
      },
      {
        day: "Days 2–5",
        title: "Warrior Songs, Dances & Log Drumming",
        description: "Tribes don ancestral hornbill feather crowns, woven shawls, and brass neck torcs, performing war chants and synchronized log-drumming rhythms.",
      },
      {
        day: "Days 6–8",
        title: "Indigenous Sports & Archery Contests",
        description: "Tribal games testing agility and strength, including traditional Naga wrestling, grease-pole climbing, and fire-making using dried wood friction.",
      },
      {
        day: "Days 9–10",
        title: "Grand Unity Dance & Twilight Fire Ceremony",
        description: "All tribes join hands in a massive unified circle around the central amphitheater fire, celebrating Naga solidarity and cultural heritage.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Smoked Pork with Fermented Bamboo Shoot (Axone)",
        description: "Authentic hearth-smoked pork simmered with fermented soybeans (axone), bhoot jolokia chillies, and bamboo shoots.",
      },
      {
        dishName: "Galho Porridge & Wild Herbs",
        description: "Nourishing traditional Naga rice dish cooked with wild forest greens, seasonal vegetables, and smoked cuts.",
      },
      {
        dishName: "Zutho (Traditional Rice Beer)",
        description: "Naturally fermented fragrant sweet rice beverage served in hand-carved polished bamboo tumblers.",
      },
    ],
    artisanalEcosystem: "Naga backstrap weavers craft tribal wool shawls (Tsungkotepsu, Angami shawls); woodcarvers carve ceremonial animal-head totems and log drums; metalsmiths craft brass neck torcs and spearheads.",
    folkInstruments: ["Log Drum (Khon)", "Tati (One-stringed folk violin)", "Bamboo Flute", "War Horn", "Mouth Harp"],
  },
  {
    id: "fest-ladakh-hemis",
    slug: "hemis-festival",
    name: "Hemis Monastery Festival",
    nativeName: "ཧེ་མིས་ཚེས་བཅུ། (Hemis Tsechu)",
    state: "Ladakh",
    region: "North",
    monthHindi: "5th lunar month (June–July)",
    significance: "National Cultural Asset — Two-day sacred Mahayana Buddhist tantric monastic festival commemorating the birth anniversary of Guru Padmasambhava (Guru Rinpoche) with elaborate masked Cham dances.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/hemis_ladakh.jpg",
    historicalOrigin: {
      period: "1630 CE (Re-established under King Sengge Namgyal and Drukpa master Stagsang Raspa)",
      lineage: "Commemorates Guru Padmasambhava's 8th-century triumph over malevolent local spirits and the transmission of Vajrayana Buddhism to the Himalayas.",
      deityOrTheme: "Guru Padmasambhava (Guru Rinpoche)",
    },
    rituals: [
      {
        day: "Day 1 (Dawn)",
        title: "Dungchen Call & Thangka Unfurling",
        description: "Monks blow 10-foot long copper Dungchen horns from the monastery roof, unfurling a towering multi-story silk applique Thangka portrait of Guru Rinpoche.",
      },
      {
        day: "Day 1 (Noon)",
        title: "Sacred Cham Mask Dances",
        description: "Lamas in rich brocade silk robes and heavy carved wood masks enact the cosmic battle between wisdom deities and demonic forces in the monastery courtyard.",
      },
      {
        day: "Day 2 (Morning)",
        title: "Ritual Destruction of the Dough Effigy",
        description: "The leader of the Black Hat dancers slays a barley dough sculpture symbolizing the destruction of human ego and ignorance.",
      },
      {
        day: "Day 2 (Afternoon)",
        title: "Public Blessings & Sacred Scarf Distribution",
        description: "Pilgrims line up to receive consecrated holy water, medicinal herbal pills, and white silk khata blessing scarves from the Rinpoche.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Gur-Gur Cha (Butter Tea)",
        description: "Salted tea churned with fermented yak butter, black tea leaves, and soda in wooden cylindrical churns.",
      },
      {
        dishName: "Tsampa & Tingmo",
        description: "Roasted high-altitude barley flour mixed with warm butter tea, paired with fluffy steamed Tibetan flower buns.",
      },
      {
        dishName: "Ladakhi Thukpa",
        description: "Steaming hot vegetable and hand-rolled wheat noodle broth seasoned with mountain herbs and pepper.",
      },
    ],
    artisanalEcosystem: "Monastery thangka painters (Lharipas) spend months restoring mineral pigment scrolls; woodcarvers sculpt ornate dance masks from willow wood; Ladakhi silversmiths craft turquoise-inlaid perak headdresses.",
    folkInstruments: ["Dungchen (Telescopic Brass Horns)", "Gyaling (Double-reed oboe)", "Damaru (Skull drum)", "Rolmo (Cymbals)", "Nga (Framed drums)"],
  },
  {
    id: "fest-rajasthan-pushkar",
    slug: "pushkar-camel-fair",
    name: "Pushkar Camel Fair & Desert Festival",
    nativeName: "पुष्कर मेला",
    state: "Rajasthan",
    region: "West",
    monthHindi: "Kartik Purnima (Oct–Nov)",
    significance: "National Cultural Asset — World's largest livestock gathering on the Thar desert dunes, synchronized with holy Kartik Purnima full-moon cleansing dips in sacred Lake Pushkar, the only prominent temple town dedicated to Lord Brahma.",
    unescoStatus: "National Cultural Asset",
    heroImage: "/images/festivals/pushkar_rajasthan.jpg",
    historicalOrigin: {
      period: "Padma Purana antiquity / Formally documented since 14th century",
      lineage: "According to the Padma Purana, Lord Brahma dropped a blue lotus flower (pushpa) to earth to slay the demon Vajranabha, creating the sacred water body where all 330 million devas assemble during Kartik Purnima.",
      deityOrTheme: "Lord Brahma & Desert Pastoral Lineage",
    },
    rituals: [
      {
        day: "Days 1–3",
        title: "Livestock Gathering & Gorbandh Grooming",
        description: "Over 50,000 camels and Marwari horses arrive from across the Thar. Camel owners shave elaborate geometric patterns into camel coats and decorate them with cowrie beads.",
      },
      {
        day: "Days 4–6",
        title: "Desert Sports & Folk Pageants",
        description: "Festive competitions including camel dances, the world's longest mustache contest, bridal dress contests, and turban tying between locals and tourists.",
      },
      {
        day: "Kartik Ekadashi (Day 7)",
        title: "Brahma Temple Deepdaan",
        description: "Thousands of clay oil lamps (diyas) are set afloat on leaf boats across the 52 sacred ghats of Lake Pushkar at dusk amidst temple bell rings.",
      },
      {
        day: "Kartik Purnima (Final Day)",
        title: "Maha Snan Full-Moon Bathing",
        description: "Pilgrims take the auspicious cleansing holy dip at dawn in Lake Pushkar, believed to absolve earthly sins and bestow lifelong spiritual peace.",
      },
    ],
    culinaryOfferings: [
      {
        dishName: "Pushkar Rabdi Malpua",
        description: "Tender, ghee-fried semolina and milk-cream pancakes dipped in thick saffron sugar syrup, topped with clotted malai rabdi.",
      },
      {
        dishName: "Desert Dal Baati Churma",
        description: "Clay-roasted wheat dough balls crushed with pure cow ghee, served with five-lentil spicy dal and sweet coarse churma.",
      },
      {
        dishName: "Kadai Doodh & Ker Sangri",
        description: "Thick spiced milk slow-boiled in iron cauldrons with almonds and saffron, alongside dry desert bean stir-fry.",
      },
    ],
    artisanalEcosystem: "Raika and Rabari camel breeders trade livestock; leather artisans craft camel leather saddles and mojaris; silver jewelers trade heavy tribal haslis and kadis; block printers sell Sanganeri and Dabu quilts.",
    folkInstruments: ["Kamaicha", "Ravanahatha", "Morchang", "Khartal", "Dholak"],
  },
];

export function getFestivalDossier(slugOrId: string): FestivalDossier | undefined {
  return FESTIVAL_DOSSIERS.find(
    (f) => f.slug === slugOrId || f.id === slugOrId
  );
}

export function getAllFestivalSlugs(): string[] {
  return FESTIVAL_DOSSIERS.map((f) => f.slug);
}

const STATE_COORDINATES: Record<string, [number, number]> = {
  Gujarat: [23.242, 69.6669],
  "West Bengal": [22.5726, 88.3639],
  Punjab: [31.634, 74.8723],
  Kerala: [10.5276, 76.2144],
  "Tamil Nadu": [12.8342, 79.7036],
  Assam: [26.1445, 91.7362],
  Odisha: [19.8135, 85.8312],
  Bihar: [25.5941, 85.1376],
  Maharashtra: [18.5204, 73.8567],
  Nagaland: [25.6751, 94.1086],
  Ladakh: [34.1526, 77.5771],
  Rajasthan: [26.4897, 74.5511],
};

export function festivalDossierToHeritageSite(festival: FestivalDossier): HeritageSite {
  const heroImg = festival.heroImage || "/images/festivals/garba_gujarat.jpg";
  const coords = STATE_COORDINATES[festival.state] || [20.5937, 78.9629];
  const isUnesco = Boolean(festival.unescoStatus && festival.unescoStatus.includes("UNESCO"));

  return {
    id: festival.id,
    slug: festival.slug,
    title: festival.name,
    name: festival.name,
    titles: {
      en: festival.name,
      hi: festival.nativeName || festival.name,
    },
    summary: {
      en: festival.significance,
      hi: festival.significance,
    },
    description: {
      en: festival.historicalOrigin?.lineage || festival.significance,
      hi: festival.historicalOrigin?.lineage || festival.significance,
    },
    significance: festival.significance,
    state: festival.state,
    district: festival.region ? `${festival.region} Region` : festival.state,
    region: festival.region,
    regionId: festival.region ? `reg-${festival.region.toLowerCase()}` : "reg-west",
    lat: coords[0]!,
    lng: coords[1]!,
    category: "festivals",
    type: "festival",
    period: festival.monthHindi || festival.historicalOrigin?.period || "Living Festival",
    era: "living",
    kind: "intangible",
    unesco: isUnesco,
    intangibleListed: true,
    accessibility: {
      wheelchair: true,
      audioGuide: true,
      signLanguage: false,
      notes: "Community gathering grounds and festival mandaps are publicly accessible.",
    },
    languages: ["en", "hi"],
    tags: [
      festival.state,
      festival.region || "India",
      "Festival",
      festival.monthHindi || "Annual Festival",
      ...(festival.folkInstruments || []),
    ],
    image: heroImg,
    gallery: [heroImg],
    images: [heroImg],
    tourAvailable: false,
    preservation: "safe",
    preservationNote: festival.unescoStatus || "Living Community Cultural Heritage",
    sources: [],
    stories: [],
    artisans: [],
    relatedTraditions: [],
    dataOrigin: "verified",
    updatedAt: "2026-09-29T10:00:00Z",
  };
}

export const FESTIVAL_HERITAGE_SITES: HeritageSite[] = FESTIVAL_DOSSIERS.map(festivalDossierToHeritageSite);

