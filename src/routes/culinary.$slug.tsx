import { createFileRoute } from "@tanstack/react-router";
import type { CulinaryDossier } from "@/types/culture";
import { getCulinaryDossier, CULINARY_DOSSIERS } from "@/lib/culinary-data";
import { CulinaryDossierView } from "@/components/heritage/culinary-dossier-view";

export const Route = createFileRoute("/culinary/$slug")({
  loader: ({ params }): { dossier: CulinaryDossier } => {
    const found = getCulinaryDossier(params.slug);
    const dossier: CulinaryDossier = found || CULINARY_DOSSIERS[0]!;
    return { dossier };
  },
  head: ({ loaderData }) => {
    const dossier: CulinaryDossier = loaderData?.dossier ?? CULINARY_DOSSIERS[0]!;
    return {
      meta: [
        { title: `${dossier.dishName} (${dossier.nativeName || ""}) — Dharohar Food Traditions` },
        { name: "description", content: dossier.historicalGenesis?.culturalContext || dossier.shortDescription || "Traditional Indian Gastronomy" },
        { property: "og:title", content: `${dossier.dishName} — Dharohar` },
        { property: "og:description", content: dossier.historicalGenesis?.culturalContext || dossier.shortDescription || "Traditional Indian Gastronomy" },
        { property: "og:image", content: dossier.heroImage || dossier.imageUrl || "/images/culinary/sadya_feast.jpg" },
      ],
    };
  },
  component: CulinaryRouteComponent,
});

function CulinaryRouteComponent() {
  const { dossier } = Route.useLoaderData();
  const safeDossier: CulinaryDossier = dossier ?? CULINARY_DOSSIERS[0]!;
  return <CulinaryDossierView dossier={safeDossier} />;
}
