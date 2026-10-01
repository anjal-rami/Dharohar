import { createFileRoute } from "@tanstack/react-router";
import type { FestivalDossier } from "@/types/festival";
import { getFestivalDossier, FESTIVAL_DOSSIERS } from "@/lib/festivals-data";
import { FestivalDossierView } from "@/components/heritage/festival-dossier-view";

export const Route = createFileRoute("/festivals/$slug")({
  loader: ({ params }): { dossier: FestivalDossier } => {
    const found = getFestivalDossier(params.slug);
    const dossier: FestivalDossier = found || FESTIVAL_DOSSIERS[0]!;
    return { dossier };
  },
  head: ({ loaderData }) => {
    const dossier: FestivalDossier = loaderData?.dossier ?? FESTIVAL_DOSSIERS[0]!;
    return {
      meta: [
        { title: `${dossier.name} (${dossier.nativeName}) — Dharohar Cultural Dossier` },
        { name: "description", content: dossier.significance },
        { property: "og:title", content: `${dossier.name} — Dharohar` },
        { property: "og:description", content: dossier.significance },
        { property: "og:image", content: dossier.heroImage },
      ],
    };
  },
  component: FestivalRouteComponent,
});

function FestivalRouteComponent() {
  const { dossier } = Route.useLoaderData();
  const safeDossier: FestivalDossier = dossier ?? FESTIVAL_DOSSIERS[0]!;
  return <FestivalDossierView dossier={safeDossier} />;
}
