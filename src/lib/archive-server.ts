import { createServerFn } from "@tanstack/react-start";

export interface ArchiveSubmission {
  id: string;
  title: string;
  contributorName: string;
  category: "oral_tradition" | "photo" | "document" | "living_culture";
  state: string;
  description: string;
  mediaUrl: string;
  upvotes: number;
  verifiedByCommunity: boolean;
  isVerifiedByAdmin?: boolean;
  officialSeal?: string;
  verifiedBy?: string | undefined;
  status?: "pending" | "approved" | "rejected" | undefined;
  moderationNotes?: string | undefined;
  createdAt: string;
}

// In-memory persistent demo store representing verified crowdsourced citizen heritage submissions
export const archiveItems: ArchiveSubmission[] = [
  // 1. Oral Tradition / Folklore Record 1 (Verified)
  {
    id: "arch-1",
    title: "Koodiyattam Sanskrit Temple Rhythmic Chants & Mudra Notation",
    contributorName: "Mani Madhava Chakyar Clan (Preserved by Ramesh Nambiar)",
    category: "oral_tradition",
    state: "Kerala",
    description:
      "Ancient oral rhythmic recitation and sacred mudra phonetics preserved by hereditary temple performers at Vadakkunnathan Temple, Thrissur.",
    mediaUrl: "/uploads/koodiyattam-sample.jpg",
    upvotes: 42,
    verifiedByCommunity: true,
    isVerifiedByAdmin: true,
    officialSeal: "Ministry of Culture · ASI Heritage Cell",
    verifiedBy: "Sangeet Natak Akademi & ASI Epigraphy Cell",
    status: "approved",
    moderationNotes:
      "Authenticated against Sangeet Natak Akademi oral documentation archives (Ref: SNA-KL-1994).",
    createdAt: "2026-08-14",
  },

  // 2. Oral Tradition / Folklore Record 2 (Verified)
  {
    id: "arch-2",
    title: "Baul Mystical Songs & Ektara Lalon Fakir Akhra Ballads",
    contributorName: "Parvathy Baul & Gour Khyapa Ashram",
    category: "oral_tradition",
    state: "West Bengal",
    description:
      "Acoustic documentation of unwritten 18th-century dehatattva folk songs sung at Jaydev Kenduli fair, passed down solely through oral guru-shishya parampara.",
    mediaUrl: "/uploads/baul-tradition.jpg",
    upvotes: 38,
    verifiedByCommunity: true,
    isVerifiedByAdmin: true,
    officialSeal: "UNESCO Intangible Cultural Heritage Representative List",
    verifiedBy: "Eastern Zonal Cultural Centre (EZCC)",
    status: "approved",
    moderationNotes:
      "Cross-referenced with Asiatic Society records of Bengal oral music and lyric archives.",
    createdAt: "2026-08-22",
  },

  // 3. Living Craft / Handloom Record 1 (Verified)
  {
    id: "arch-3",
    title: "Patan Patola Double-Ikat Silk Loom Natural Dyes & Grid Geometry",
    contributorName: "Salvi Pareshbhai & National Awardee Weavers",
    category: "living_culture",
    state: "Gujarat",
    description:
      "Field documentation of the 80-day resist-dyeing process using madder root, pomegranate rind, and catechu before weaving on hand-tilted rosewood looms in Patan.",
    mediaUrl: "/uploads/patola-loom-process.jpg",
    upvotes: 56,
    verifiedByCommunity: true,
    isVerifiedByAdmin: true,
    officialSeal: "Geographical Indications (GI) Registry of India",
    verifiedBy: "Development Commissioner (Handlooms) & Ministry of Textiles",
    status: "approved",
    moderationNotes:
      "Authentic double-ikat weave verified under GI Registry certificate GI-47 and master weaver census.",
    createdAt: "2026-09-02",
  },

  // 4. Living Craft / Handloom Record 2 (Verified)
  {
    id: "arch-4",
    title: "Swamimalai Chola Bronze Lost-Wax Cire-Perdue Metal Casting",
    contributorName: "Sthapathy S. Meenakshisundaram & Guild Apprentices",
    category: "living_culture",
    state: "Tamil Nadu",
    description:
      "Detailed step-by-step documentation of bees-wax model sculpting, alluvial Cauvery clay molding, and pouring of sacred 5-metal alloy following ancient Shilpa Shastras.",
    mediaUrl: "/uploads/swamimalai-bronze-workshop.jpg",
    upvotes: 49,
    verifiedByCommunity: true,
    isVerifiedByAdmin: true,
    officialSeal: "Ministry of Culture · ASI Heritage Cell",
    verifiedBy: "Tamil Nadu State Department of Archaeology & ASI",
    status: "approved",
    moderationNotes:
      "Verified as continuing lineage of Rajaraja Chola imperial bronze sthapatis with authentic alloy metallurgical testing.",
    createdAt: "2026-09-10",
  },

  // 5. Community Monument Photograph 1 (Verified)
  {
    id: "arch-5",
    title: "Monsoon Twilight at Rani ki Vav Subterranean Stepwell Galleries",
    contributorName: "Dr. Ananya Desai (Archaeological Photographer)",
    category: "photo",
    state: "Gujarat",
    description:
      "High-resolution twilight exposure capturing the 7th level Vishnu Sheshashayi sanctuary reflected in the natural aquifer pool after heavy rainfall in Patan.",
    mediaUrl: "/uploads/rani-ki-vav-twilight.jpg",
    upvotes: 35,
    verifiedByCommunity: true,
    isVerifiedByAdmin: true,
    officialSeal: "ASI Western Circle Verified Documentation",
    verifiedBy: "Archaeological Survey of India (Vadodara Circle)",
    status: "approved",
    moderationNotes:
      "Photographic fidelity and architectural angle verified in coordination with ASI site superintendents.",
    createdAt: "2026-09-15",
  },

  // 6. Community Monument Photograph 2 (Community Endorsed)
  {
    id: "arch-6",
    title: "Dawn Solstice Light Beam on Konark Sun Temple Navagraha Stone Lintels",
    contributorName: "Soumya Ranjan Mohapatra (Local Heritage Guide)",
    category: "photo",
    state: "Odisha",
    description:
      "Astronomical alignment capture during equinox sunrise through the Mukhasala entrance, illuminating the Surya green chlorite sculptures.",
    mediaUrl: "/uploads/konark-equinox-dawn.jpg",
    upvotes: 29,
    verifiedByCommunity: true,
    isVerifiedByAdmin: false,
    officialSeal: "Citizen Heritage Peer Review In Progress",
    verifiedBy: "Community Verified (29 Endorsements)",
    status: "pending",
    moderationNotes:
      "Under peer review by regional archaeo-astronomy study group for solar azimuth validation.",
    createdAt: "2026-09-21",
  },
];

export const getArchiveItems = createServerFn({ method: "GET" }).handler(async () => {
  // Public archive feed excludes rejected items
  const publicItems = archiveItems.filter((i) => i.status !== "rejected");
  return { success: true, items: publicItems };
});

export const voteArchiveItem = createServerFn({ method: "POST" })
  .validator((d: { id: string; direction: "up" | "down" }) => d)
  .handler(async ({ data: { id, direction } }) => {
    const item = archiveItems.find((i) => i.id === id);
    if (!item) {
      return { success: false, error: "Item not found" };
    }

    if (direction === "up") {
      item.upvotes += 1;
    } else if (direction === "down" && item.upvotes > 0) {
      item.upvotes -= 1;
    }

    // Reaching 20 endorsements escalates to ASI Archivist Review Queue (neutralizes Sybil auto-sealing)
    if (item.upvotes >= 20 && item.status !== "approved") {
      item.verifiedByCommunity = true;
      if (!item.moderationNotes) {
        item.moderationNotes = "Escalated for priority verification: Reached 20+ community endorsements.";
      }
    }

    return {
      success: true,
      upvotes: item.upvotes,
      verifiedByCommunity: item.verifiedByCommunity,
      verifiedBy: item.verifiedBy,
    };
  });

export const submitArchiveItem = createServerFn({ method: "POST" })
  .validator(
    (data: {
      title: string;
      contributorName: string;
      category: ArchiveSubmission["category"];
      state: string;
      description: string;
      mediaUrl: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const newItem: ArchiveSubmission = {
      id: `arch-${Date.now()}`,
      title: data.title,
      contributorName: data.contributorName,
      category: data.category,
      state: data.state,
      description: data.description,
      mediaUrl: data.mediaUrl,
      upvotes: 1,
      verifiedByCommunity: false,
      isVerifiedByAdmin: false,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]!,
    };

    archiveItems.unshift(newItem);
    return { success: true, item: newItem };
  });
