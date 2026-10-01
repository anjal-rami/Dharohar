import { createFileRoute } from "@tanstack/react-router";
import type { CraftDossier } from "@/types/craft";
import { getCraftDossier, CRAFT_DOSSIERS } from "@/lib/crafts-data";
import { CraftDossierView } from "@/components/heritage/craft-dossier-view";

export const Route = createFileRoute("/crafts/$slug")({
  loader: ({ params }): { dossier: CraftDossier } => {
    const found = getCraftDossier(params.slug);
    const dossier: CraftDossier = found || CRAFT_DOSSIERS[0]!;
    return { dossier };
  },
  head: ({ loaderData }) => {
    const dossier: CraftDossier = loaderData?.dossier ?? CRAFT_DOSSIERS[0]!;
    const desc = dossier.historicalLineage?.royalPatronageOrGenesis || dossier.shortDescription || "Master Indian Handcraft Heritage";
    const name = dossier.craftName || dossier.title || "Craft Heritage";
    const native = dossier.nativeName ? ` (${dossier.nativeName})` : "";
    return {
      meta: [
        { title: `${name}${native} — Dharohar Craft Dossier` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — Dharohar Master Crafts` },
        { property: "og:description", content: desc },
        { property: "og:image", content: dossier.heroImage || dossier.imageUrl },
      ],
    };
  },
  component: CraftRouteComponent,
});

function CraftRouteComponent() {
  const { dossier } = Route.useLoaderData();
  const safeDossier: CraftDossier = dossier ?? CRAFT_DOSSIERS[0]!;
  return <CraftDossierView dossier={safeDossier} />;
}
