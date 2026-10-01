import { createFileRoute } from "@tanstack/react-router";
import type { PerformingArtDossier } from "@/types/culture";
import { getPerformingArtDossier, PERFORMING_ARTS_DOSSIERS } from "@/lib/performing-arts-data";
import { PerformingArtsDossierView } from "@/components/heritage/performing-arts-dossier-view";

export const Route = createFileRoute("/performing-arts/$slug")({
  loader: ({ params }): { dossier: PerformingArtDossier } => {
    const found = getPerformingArtDossier(params.slug);
    const dossier: PerformingArtDossier = found || PERFORMING_ARTS_DOSSIERS[0]!;
    return { dossier };
  },
  head: ({ loaderData }) => {
    const dossier: PerformingArtDossier = loaderData?.dossier ?? PERFORMING_ARTS_DOSSIERS[0]!;
    return {
      meta: [
        { title: `${dossier.title} (${dossier.nativeTitle}) — Dharohar Cultural Dossier` },
        { name: "description", content: dossier.historicalOrigin.lineageText },
        { property: "og:title", content: `${dossier.title} — Dharohar` },
        { property: "og:description", content: dossier.historicalOrigin.lineageText },
        { property: "og:image", content: dossier.heroImage },
      ],
    };
  },
  component: PerformingArtsRouteComponent,
});

function PerformingArtsRouteComponent() {
  const { dossier } = Route.useLoaderData();
  const safeDossier: PerformingArtDossier = dossier ?? PERFORMING_ARTS_DOSSIERS[0]!;
  return <PerformingArtsDossierView dossier={safeDossier} />;
}
