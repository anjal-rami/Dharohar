import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { CATEGORY_META, type HeritageSite } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { DemoChip, PreservationChip } from "@/components/heritage/chips";
import { cn } from "@/lib/utils";

import { HeritageImage } from "@/components/heritage/heritage-image";
import { getHeritageCoverImage } from "@/lib/heritage-records-data";

export function HeritageCard({
  site,
  className,
  distanceKm,
}: {
  site: HeritageSite;
  className?: string;
  distanceKm?: number;
}) {
  const { locale } = useI18n();
  const coverImage = getHeritageCoverImage(site);

  return (
    <Link
      to="/heritage/$slug"
      params={{ slug: site.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-heritage transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <HeritageImage
          src={coverImage}
          alt={localized(site.titles, locale)}
          fallbackText={localized(site.titles, locale)}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          containerClassName="size-full"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-1.5 bg-gradient-to-t from-foreground/70 to-transparent p-3">
          <span className="rounded-full bg-card/90 px-2.5 py-0.5 text-xs font-semibold text-card-foreground">
            {CATEGORY_META[site.category]?.icon ?? "✨"}{" "}
            {CATEGORY_META[site.category]?.label ?? site.category}
          </span>
          {site.unesco && (
            <span className="rounded-full bg-marigold px-2.5 py-0.5 text-xs font-semibold text-marigold-foreground">
              UNESCO
            </span>
          )}
          {site.intangibleListed && (
            <span className="rounded-full bg-indigo-ink px-2.5 py-0.5 text-xs font-semibold text-indigo-ink-foreground">
              Intangible
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg leading-snug font-semibold">{localized(site.titles, locale)}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {site.district}, {site.state}
          {typeof distanceKm === "number" && <span className="ml-auto">{distanceKm} km</span>}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {localized(site.summary, locale)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          <PreservationChip status={site.preservation} />
          {site.dataOrigin === "demo" && <DemoChip />}
        </div>
      </div>
    </Link>
  );
}

export function HeritageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
