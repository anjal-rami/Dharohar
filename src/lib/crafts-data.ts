import type { CraftDossier } from "@/types/craft";
import craftsSeed from "@/data/crafts_seed.json";

export const CRAFT_DOSSIERS: CraftDossier[] = craftsSeed as unknown as CraftDossier[];

export function getCraftDossier(slug: string): CraftDossier | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return CRAFT_DOSSIERS.find(
    (craft) =>
      craft.slug.toLowerCase() === normalized ||
      craft.id.toLowerCase() === normalized ||
      craft.slug.toLowerCase().includes(normalized) ||
      normalized.includes(craft.slug.toLowerCase()) ||
      (normalized.includes("kanchipuram") && craft.slug.includes("kanchipuram")) ||
      (normalized.includes("bandhani") && craft.slug.includes("bandhani"))
  );
}
