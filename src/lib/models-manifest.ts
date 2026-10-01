import rawManifest from "@/data/models_manifest.json";

export interface ArtifactHotspot {
  name: string;
  label: string;
  position: string;
  normal?: string;
  description: string;
}

export interface ModelManifestEntry {
  modelUrl: string;
  title: string;
  periodAndMaterial: string;
  provenance?: string;
  institution?: string;
  hotspots?: ArtifactHotspot[];
}

export const modelsManifest: Record<string, ModelManifestEntry> = rawManifest as Record<string, ModelManifestEntry>;

export function getModelManifestForSite(siteSlug?: string | null): ModelManifestEntry {
  const defaultEntry: ModelManifestEntry = modelsManifest["default"] ?? {
    modelUrl: "/models/default_heritage_relic.glb",
    title: "Carved Granite Temple Stele",
    periodAndMaterial: "Classical Medieval Era • Granite Relief • Archaeological Survey Collection",
    provenance: "Preserved in national epigraphical archives.",
    institution: "Archaeological Survey of India (ASI)",
    hotspots: [
      {
        name: "monolithic_relief",
        label: "Monolithic Relief Carving",
        position: "0 0.2 0.05",
        normal: "0 0 1",
        description: "Finely chiseled relief details preserving medieval South Asian craftsmanship."
      }
    ]
  };

  if (!siteSlug) return defaultEntry;

  const normalized = siteSlug.toLowerCase().trim();

  // 1. Direct match
  if (modelsManifest[normalized]) {
    return modelsManifest[normalized]!;
  }

  // 2. Brihadisvara special check
  if (normalized.includes("brihadisvara") || normalized.includes("brihadeeswara") || normalized.includes("thanjavur")) {
    return (
      modelsManifest["brihadisvara-temple-thanjavur"] ||
      modelsManifest["brihadisvara-temple"] ||
      modelsManifest["brihadisvara"] ||
      defaultEntry
    );
  }

  // 3. Partial key match
  for (const key of Object.keys(modelsManifest)) {
    if (key === "default") continue;
    if (normalized.includes(key) || key.includes(normalized)) {
      return modelsManifest[key]!;
    }
  }

  return defaultEntry;
}
