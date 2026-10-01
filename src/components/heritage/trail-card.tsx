import { Bike, Bus, Car, Clock, Footprints, Route } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getSite, type Trail } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MODE_ICON = {
  walk: Footprints,
  cycle: Bike,
  car: Car,
  transit: Bus,
} as const;

export function TrailCard({ trail, className }: { trail: Trail; className?: string }) {
  const { locale } = useI18n();

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-heritage",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={trail.image}
          alt=""
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.dataset["fallbackApplied"]) return;
            target.dataset["fallbackApplied"] = "true";
            target.src = "/assets/hero-heritage.jpg";
          }}
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/90 px-2.5 py-0.5 text-xs font-semibold capitalize">
          {trail.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold">{localized(trail.name, locale)}</h3>
          <p className="text-sm text-muted-foreground">{trail.region}</p>
        </div>
        <p className="text-sm text-muted-foreground">{localized(trail.blurb, locale)}</p>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Route className="size-4 text-primary" aria-hidden /> {trail.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-primary" aria-hidden /> {trail.durationHours} h
          </span>
          <span className="flex items-center gap-1.5">
            {trail.travelModes.map((m) => {
              const Icon = MODE_ICON[m];
              return <Icon key={m} className="size-4 text-muted-foreground" aria-label={m} />;
            })}
          </span>
        </div>

        <ol className="space-y-2 border-l border-dashed border-border pl-4">
          {trail.stops.map((stop) => {
            const site = getSite(stop.siteSlug);
            if (!site) return null;
            return (
              <li key={stop.siteSlug} className="relative">
                <span className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-primary" />
                <Link
                  to="/heritage/$slug"
                  params={{ slug: site.slug }}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  {localized(site.titles, locale)}
                </Link>
                <p className="text-xs text-muted-foreground">
                  +{Math.round(stop.arriveAfterMin / 60)} h · {stop.note}
                </p>
              </li>
            );
          })}
        </ol>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {trail.services.map((s) => (
            <li
              key={s}
              className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
