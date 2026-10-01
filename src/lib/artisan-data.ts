export interface ArtisanProduct {
  id: string;
  name: string;
  estimatedPrice: string;
  isSeasonal: boolean;
  seasonName?: string; // e.g., "Monsoon / Shravan Special", "Winter Harvest", "Diwali & Navratri Festive"
  activeMonths?: number[]; // 1-12 (e.g., [7, 8] for July-August)
  inStock: boolean;
  imageUrl?: string;
  giTagged?: boolean;
  category?: "craft" | "sweet" | "textile" | "pottery" | "metalwork";
  description?: string;
}

export interface ArtisanShop {
  id: string;
  artisanName: string;
  shopName: string;
  phone: string;
  whatsappNumber: string; // international format without + for wa.me link (e.g., "919829012345")
  craftTitle: string;
  monumentSlug: string;
  monumentName: string;
  location: string;
  state: string;
  experienceYears: number;
  bio: string;
  giTagged: boolean;
  rating: number;
  reviewsCount: number;
  avatarUrl?: string;
  featuredProducts: ArtisanProduct[];
}

export const ARTISAN_SHOPS: ArtisanShop[] = [
  // 1. Jaipur / Hawa Mahal & Amer
  {
    id: "shop-jaipur",
    artisanName: "Ramswaroop Prajapat",
    shopName: "Shri Kripal Blue Pottery & Crafts",
    phone: "+91 98290 12345",
    whatsappNumber: "919829012345",
    craftTitle: "Blue Pottery & Festive Leheriya",
    monumentSlug: "amber-fort-jaipur",
    monumentName: "Amber Palace & Hawa Mahal, Jaipur",
    location: "Kripal Kumbh Lane, Bani Park / Johari Bazaar, Jaipur",
    state: "Rajasthan",
    experienceYears: 40,
    bio: "Celebrated master artisan continuing the royal Jaipur quartz-glazed turquoise ceramics tradition alongside festive Leheriya tie-dye textile weaves.",
    giTagged: true,
    rating: 4.9,
    reviewsCount: 178,
    avatarUrl: "/uploads/artisan-ramswaroop.jpg",
    featuredProducts: [
      {
        id: "prod-jaipur-leheriya",
        name: "Monsoon Hand-dyed Leheriya Dupatta (Teej Special)",
        estimatedPrice: "₹1,850",
        isSeasonal: true,
        seasonName: "Monsoon / Teej Festive",
        activeMonths: [7, 8], // July-August
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Wave-pattern resist dyed by hand with gota patti border, worn during Teej and Gangaur celebrations across Rajasthan.",
        imageUrl: "/uploads/leheriya.jpg",
      },
      {
        id: "prod-jaipur-pottery",
        name: "Traditional Cobalt Blue Pottery Floral Plate (10-inch)",
        estimatedPrice: "₹1,200",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "pottery",
        description: "Handcrafted from Egyptian paste of quartz stone powder, Fuller's earth, and natural gum. Fired with traditional cobalt and copper oxide glazes.",
        imageUrl: "/uploads/blue-pottery.jpg",
      },
      {
        id: "prod-jaipur-ghewar",
        name: "Traditional Malai Rabdi Ghewar (Desi Ghee)",
        estimatedPrice: "₹450 / 500g",
        isSeasonal: true,
        seasonName: "Monsoon & Teej Festival",
        activeMonths: [7, 8],
        inStock: true,
        category: "sweet",
        description: "Honeycomb saffron sweet soaked in organic cardamom syrup and topped with thick fresh malai.",
        imageUrl: "/uploads/ghewar.jpg",
      },
      {
        id: "prod-jaipur-dohar",
        name: "Mulmul Cotton Hand-Block Sanganeri Dohar",
        estimatedPrice: "₹1,450",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Triple-layered Jaipur breathable cotton blanket printed using hand-carved wooden blocks.",
        imageUrl: "/uploads/sanganeri-dohar.jpg",
      },
    ],
  },

  // 2. Patan / Rani ki Vav
  {
    id: "shop-patan",
    artisanName: "Pareshbhai Salvi",
    shopName: "Patan Patola Heritage Weaving Centre",
    phone: "+91 98251 23456",
    whatsappNumber: "919825123456",
    craftTitle: "Double Ikkat Silk Weaving (GI Tagged)",
    monumentSlug: "rani-ki-vav-patan",
    monumentName: "Rani ki Vav (Queen's Stepwell)",
    location: "Salvi Wada, Near Rani ki Vav, Patan",
    state: "Gujarat",
    experienceYears: 35,
    bio: "National Award-winning master weaver from the hereditary Salvi clan preserving the legendary 1,000-year-old mathematical double-ikat Patan Patola art.",
    giTagged: true,
    rating: 5.0,
    reviewsCount: 214,
    avatarUrl: "/uploads/artisan-salvi.jpg",
    featuredProducts: [
      {
        id: "prod-patan-scarf",
        name: "Winter Pure Mulberry Silk Scarf",
        estimatedPrice: "₹6,800",
        isSeasonal: true,
        seasonName: "Winter Harvest & Heritage Season",
        activeMonths: [11, 12, 1, 2], // Nov-Feb
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Dense naturally insulating pure mulberry silk stole featuring the sacred Nari Kunj geometric motif, resist-dyed with madder root and indigo.",
        imageUrl: "/uploads/patola-scarf.jpg",
      },
      {
        id: "prod-patan-patola-wall",
        name: "Patan Patola Double Ikkat Ceremonial Wall Hanging",
        estimatedPrice: "₹18,500",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Masterpiece double-ikat weave where both warp and weft threads are individually tie-dyed before weaving. Shows identical vibrancy on both faces.",
        imageUrl: "/uploads/patola-wall.jpg",
      },
      {
        id: "prod-patan-tilpatti",
        name: "Winter Roasted Til-Patti & Jaggery Gajak",
        estimatedPrice: "₹340 / 500g",
        isSeasonal: true,
        seasonName: "Winter Harvest & Uttarayan",
        activeMonths: [12, 1, 2],
        inStock: true,
        category: "sweet",
        description: "Wafer-thin brittle crafted from Gujarat winter sesame seeds and slow-cooked organic Desi jaggery, cardamom, and ghee.",
        imageUrl: "/uploads/til-patti.jpg",
      },
      {
        id: "prod-patan-rogan",
        name: "Castor Oil Rogan Art Velvet Keepsake Pouch",
        estimatedPrice: "₹950",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Hand-painted using castor oil paste and natural earth pigments from Nirona village.",
        imageUrl: "/uploads/rogan-art.jpg",
      },
    ],
  },

  // 3. Hampi / Vijayanagara Complex
  {
    id: "shop-hampi",
    artisanName: "Basavaraj Badigar",
    shopName: "Tungabhadra Heritage Stone & Wood Crafts",
    phone: "+91 94802 34567",
    whatsappNumber: "919480234567",
    craftTitle: "Soft Soapstone Carvings & Wooden Chariot Replicas",
    monumentSlug: "hampi-monuments",
    monumentName: "Group of Monuments at Hampi (Vijayanagara)",
    location: "Hampi Bazaar Street, Near Virupaksha Temple, Ballari District",
    state: "Karnataka",
    experienceYears: 28,
    bio: "Hereditary sculptor and woodcarver dedicated to replicating the Vijayanagara Empire's monolithic marvels and temple chariot woodcarvings using soft soapstone and teak.",
    giTagged: true,
    rating: 4.8,
    reviewsCount: 136,
    avatarUrl: "/uploads/artisan-badigar.jpg",
    featuredProducts: [
      {
        id: "prod-hampi-monolith",
        name: "Hampi Utsav Hand-carved Miniature Monoliths",
        estimatedPrice: "₹2,400",
        isSeasonal: true,
        seasonName: "Hampi Utsav Winter Cultural Festive",
        activeMonths: [11, 12, 1], // Nov-Jan
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Hand-chiseled soapstone miniature celebrating the iconic Ugra Narasimha monolith and Kadalekalu Ganesha, sculpted during the annual Hampi Utsav season.",
        imageUrl: "/uploads/hampi-monolith.jpg",
      },
      {
        id: "prod-hampi-chariot",
        name: "Stone Chariot Miniature Replica with Revolving Wheels",
        estimatedPrice: "₹3,200",
        isSeasonal: false,
        inStock: true,
        category: "craft",
        giTagged: true,
        description: "Intricately carved dark soapstone replica of the world-famous Vittala Temple Stone Chariot, featuring functional stone axle wheels.",
        imageUrl: "/uploads/hampi-chariot.jpg",
      },
      {
        id: "prod-hampi-yali",
        name: "Teak Wood Vijayanagara Yali Pillar Carving",
        estimatedPrice: "₹4,600",
        isSeasonal: false,
        inStock: true,
        category: "craft",
        description: "Traditional relief panel sculpted from seasoned teakwood depicting the mythical Yali beast guarding Vijayanagara sanctums.",
        imageUrl: "/uploads/hampi-yali.jpg",
      },
    ],
  },

  // 4. Varanasi / Sarnath & Ghats
  {
    id: "shop-varanasi",
    artisanName: "Vyom Pandit",
    shopName: "Kashi Weavers Guild & Zari Emporium",
    phone: "+91 94153 45678",
    whatsappNumber: "919415345678",
    craftTitle: "Traditional Banarasi Brocade & Gulabi Meenakari",
    monumentSlug: "sarnath-stupas",
    monumentName: "Sarnath Stupa & Kashi Heritage Ghats",
    location: "Madanpura Weavers Lane & Ramnagar Ghat, Varanasi",
    state: "Uttar Pradesh",
    experienceYears: 44,
    bio: "Senior custodian of the sacred Ganga-Jamuni handloom tradition, creating pure katan silk zari textiles and the rare Varanasi Gulabi Meenakari (pink enameling).",
    giTagged: true,
    rating: 4.9,
    reviewsCount: 245,
    avatarUrl: "/uploads/artisan-vyom.jpg",
    featuredProducts: [
      {
        id: "prod-varanasi-angavastram",
        name: "Festive Dev Deepawali Handloom Angavastram",
        estimatedPrice: "₹3,600",
        isSeasonal: true,
        seasonName: "Festive Dev Deepawali & Kartik Season",
        activeMonths: [10, 11, 12], // Oct-Dec (Active in autumn/winter!)
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Pure silk sacred ceremonial stole handwoven with fine real gold-washed silver zari borders, woven specifically for Kartik Dev Deepawali celebrations.",
        imageUrl: "/uploads/banarasi-angavastram.jpg",
      },
      {
        id: "prod-varanasi-meenakari",
        name: "GI-Certified Banaras Gulabi Meenakari Peacock Pendant",
        estimatedPrice: "₹2,950",
        isSeasonal: false,
        inStock: true,
        category: "metalwork",
        giTagged: true,
        description: "Rare pink enamel craft practiced exclusively in the lanes around Gai Ghat, combining silver filigree with natural mineral pink glaze.",
        imageUrl: "/uploads/banaras-meenakari.jpg",
      },
      {
        id: "prod-varanasi-diyas",
        name: "Hand-Thumped Terracotta Festive Diyas (Box of 12)",
        estimatedPrice: "₹260 / box",
        isSeasonal: true,
        seasonName: "Diwali & Dev Deepawali Festive",
        activeMonths: [9, 10, 11], // Sep-Nov (In season right now!)
        inStock: true,
        category: "pottery",
        description: "Molded from sacred alluvial soil of the Ganga and kiln-baked with a natural geru earthen wash for riverbank light offerings.",
        imageUrl: "/uploads/varanasi-diyas.jpg",
      },
      {
        id: "prod-varanasi-stole",
        name: "Fine Katan Silk Floral Butidar Stole",
        estimatedPrice: "₹2,600",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "textile",
        description: "Intricate Persian flora motifs handwoven on jacquard handlooms in old Varanasi.",
        imageUrl: "/uploads/banarasi-stole.jpg",
      },
    ],
  },

  // 5. Thanjavur / Brihadeeswara Temple
  {
    id: "shop-thanjavur",
    artisanName: "S. Meenakshisundaram Sthapathy",
    shopName: "Chola Bronze & Tanjore Art Studio",
    phone: "+91 94434 56789",
    whatsappNumber: "919443456789",
    craftTitle: "Lost-Wax Bronze Castings & 22k Gold Foil Tanjore Paintings",
    monumentSlug: "brihadisvara-temple-thanjavur",
    monumentName: "Brihadisvara Temple, Thanjavur",
    location: "Swamimalai Artisan Guild, Thanjavur District",
    state: "Tamil Nadu",
    experienceYears: 52,
    bio: "Hereditary master sculptor holding the lineage of Rajaraja Chola's temple builders, specializing in cire-perdue (lost-wax) sacred Panchaloha casting and authentic relief paintings.",
    giTagged: true,
    rating: 5.0,
    reviewsCount: 320,
    avatarUrl: "/uploads/artisan-meenakshi.jpg",
    featuredProducts: [
      {
        id: "prod-thanjavur-lamp",
        name: "Brahmotsavam Sacred Bronze Lamp & Thanjavur Dolls",
        estimatedPrice: "₹4,500",
        isSeasonal: true,
        seasonName: "Brahmotsavam & Navaratri Festival",
        activeMonths: [9, 10, 11], // Sep-Nov (In season right now!)
        inStock: true,
        giTagged: true,
        category: "metalwork",
        description: "Ritual Peacock Deepam bronze lamp cast using antique bees-wax molds, bundled with traditional Thalayanatti bobblehead royal dancing dolls.",
        imageUrl: "/uploads/thanjavur-lamp.jpg",
      },
      {
        id: "prod-thanjavur-nataraja",
        name: "GI Swamimalai Panchaloha Nataraja Icon (8-inch)",
        estimatedPrice: "₹12,800",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "metalwork",
        description: "Sacred alloy of copper, brass, lead, silver, and gold cast according to ancient Shilpa Shastra proportions with antique temple patina.",
        imageUrl: "/uploads/swamimalai-bronze.jpg",
      },
      {
        id: "prod-thanjavur-painting",
        name: "Tanjore Gold Foil Gaja Lakshmi Painting (Teak Frame)",
        estimatedPrice: "₹9,200",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Traditional wooden board painting featuring 22-karat pure gold foil embossing, Jaipur semi-precious stones, and vibrant vegetable tempera.",
        imageUrl: "/uploads/tanjore-painting.jpg",
      },
      {
        id: "prod-thanjavur-doll",
        name: "Thanjavur Bobblehead Dancing Doll (Thalayanatti)",
        estimatedPrice: "₹850",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Raja-Rani clay doll with dynamic counterweight center of gravity, hand-painted in vegetable tempera.",
        imageUrl: "/uploads/thanjavur-doll.jpg",
      },
    ],
  },

  // 6. Bhopal / Sanchi Stupa & Bhimbetka
  {
    id: "shop-bhopal",
    artisanName: "Santosh Kumar Dhurve",
    shopName: "Narmada Gond Art & Tribal Crafts Co-op",
    phone: "+91 98935 67890",
    whatsappNumber: "919893567890",
    craftTitle: "Authentic Gond Tribal Canvases & Terracotta Bells",
    monumentSlug: "sanchi-stupa",
    monumentName: "Buddhist Monuments at Sanchi & Bhimbetka",
    location: "Tribal Cooperative Studio, Shyamla Hills, Bhopal",
    state: "Madhya Pradesh",
    experienceYears: 24,
    bio: "Pradhan Gond artist preserving prehistoric narrative dot-and-line folk techniques inspired by the 10,000-year-old rock paintings of Bhimbetka and local forest lore.",
    giTagged: true,
    rating: 4.9,
    reviewsCount: 112,
    avatarUrl: "/uploads/artisan-dhurve.jpg",
    featuredProducts: [
      {
        id: "prod-bhopal-scroll",
        name: "Monsoon Harvest Wall Scrolls (Natural Earth Pigments)",
        estimatedPrice: "₹3,100",
        isSeasonal: true,
        seasonName: "Monsoon Harvest & Karma Festival",
        activeMonths: [7, 8, 9], // July-September (In season right now in September!)
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Natural canvas painted with indigenous pigments—yellow chuna, geru red clay, and black charcoal—depicting the monsoon fertility dance of the deer.",
        imageUrl: "/uploads/gond-scroll.jpg",
      },
      {
        id: "prod-bhopal-tree",
        name: "Sacred Mahua Tree of Life Gond Painting (Signed)",
        estimatedPrice: "₹4,200",
        isSeasonal: false,
        inStock: true,
        giTagged: true,
        category: "craft",
        description: "Original acrylic on handmade canvas detailing the interconnectedness of forest birds, tigers, and spirits in signature Gond dotted linework.",
        imageUrl: "/uploads/gond-tree.jpg",
      },
      {
        id: "prod-bhopal-bells",
        name: "Bastar Dhokra & Terracotta Wind Chime Bell Set",
        estimatedPrice: "₹1,150",
        isSeasonal: false,
        inStock: true,
        category: "pottery",
        description: "Rustic kiln-baked terracotta resonant bells suspended with bell-metal motifs, handmade by indigenous tribal self-help groups.",
        imageUrl: "/uploads/terracotta-bells.jpg",
      },
    ],
  },
];

/**
 * Returns whether a product is currently in-season based on the calendar month.
 * Target month is 1-indexed (1 = Jan, 9 = Sep, 12 = Dec).
 */
export function isProductInSeason(product: ArtisanProduct, currentMonth?: number): boolean {
  if (!product.isSeasonal || !product.activeMonths || product.activeMonths.length === 0) {
    return false;
  }
  const month = currentMonth ?? new Date().getMonth() + 1;
  return product.activeMonths.includes(month);
}

/**
 * Dynamically builds the item-specific WhatsApp inquiry URL for an individual artisan shop and product.
 * Uses the shop's own unique whatsappNumber and encodes the exact personalized inquiry text.
 */
export function buildWhatsAppInquiryUrl(
  shop: ArtisanShop,
  product: ArtisanProduct,
  monumentName?: string | number,
  _currentMonth?: number
): string {
  const mName =
    typeof monumentName === "string" && monumentName ? monumentName : shop.monumentName;
  const encodedMessage = encodeURIComponent(
    `Namaste ${shop.artisanName}, I found "${shop.shopName}" on the Dharohar Heritage portal for ${mName}. ` +
    `I am inquiring about the availability of "${product.name}". Could you please let me know if it is currently in stock or available for pickup? Thank you!`
  );
  return `https://wa.me/${shop.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Builds a direct general WhatsApp inquiry URL for a shop
 */
export function buildShopWhatsAppInquiryUrl(
  shop: ArtisanShop,
  monumentName?: string
): string {
  const mName = monumentName || shop.monumentName;
  const encodedMessage = encodeURIComponent(
    `Namaste ${shop.artisanName}, I found "${shop.shopName}" on the Dharohar Heritage portal for ${mName}. ` +
    `I would love to learn more about your traditional craft and available heritage items. Thank you!`
  );
  return `https://wa.me/${shop.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Finds the best-matching artisan shop for a heritage monument slug, or falls back to the directory.
 */
export function getArtisanShopForSite(siteSlug?: string): ArtisanShop {
  const defaultShop = ARTISAN_SHOPS[0]!;
  if (!siteSlug) return defaultShop;
  const s = siteSlug.toLowerCase();
  const found = ARTISAN_SHOPS.find(
    (shop) =>
      shop.monumentSlug.toLowerCase() === s ||
      s.includes(shop.monumentSlug.toLowerCase()) ||
      shop.monumentSlug.toLowerCase().includes(s) ||
      s.includes(shop.id.replace("shop-", "")) ||
      shop.monumentName.toLowerCase().includes(s) ||
      s.includes(shop.state.toLowerCase()) ||
      s.includes(shop.location.toLowerCase().split(",")[0]?.trim() || "")
  );
  return found || defaultShop;
}
