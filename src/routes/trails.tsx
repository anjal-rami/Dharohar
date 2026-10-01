import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Navigation, Download, CheckCircle2, HardDrive, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { HERITAGE_SITES, TRAILS, distanceKm, getSite } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { STORE_KEYS, useLocalState, type SavedStore } from "@/lib/use-local-state";
import { useOfflineTrails } from "@/lib/offline-trails";
import { PageHeader } from "@/components/layout/page-header";
import { IndiaMapLibre } from "@/components/heritage/india-maplibre";
import { TrailCard } from "@/components/heritage/trail-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/trails")({
  head: () => ({
    meta: [
      { title: "Interactive heritage trails across India — Dharohar" },
      {
        name: "description",
        content:
          "Personalised heritage routes with nearby sites, travel modes, duration estimates, local artisans and saved itineraries.",
      },
      { property: "og:title", content: "Interactive heritage trails — Dharohar" },
      {
        property: "og:description",
        content: "GIS-driven trails linking monuments, crafts and living traditions.",
      },
    ],
  }),
  component: Trails,
});

const ORIGINS = [
  { label: "Chennai", lat: 13.0827, lng: 80.2707 },
  { label: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { label: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { label: "Shimla", lat: 31.1048, lng: 77.1734 },
  { label: "Guwahati", lat: 26.1445, lng: 91.7362 },
];

function Trails() {
  const { t, locale } = useI18n();
  const [originIdx, setOriginIdx] = useState(0);
  const [mode, setMode] = useState<"all" | "walk" | "cycle" | "car" | "transit">("all");
  const [maxHours, setMaxHours] = useState(24);
  const [showOnlyOffline, setShowOnlyOffline] = useState(false);
  const [savedStore, setSavedStore] = useLocalState<SavedStore>(STORE_KEYS.saved, {
    sites: [],
    trails: [],
  });
  const saved = savedStore.trails;

  // Offline trails management hook
  const { isOfflineSaved, toggleOffline, offlineTrailIds, isSaving } = useOfflineTrails();

  const origin = ORIGINS[originIdx]!;

  const nearby = useMemo(
    () =>
      HERITAGE_SITES.map((site) => ({ site, km: distanceKm(origin, site) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, 5),
    [origin],
  );

  const trails = useMemo(
    () =>
      TRAILS.filter(
        (tr) =>
          tr.durationHours <= maxHours &&
          (mode === "all" || tr.travelModes.includes(mode)) &&
          (!showOnlyOffline || offlineTrailIds.includes(tr.id)),
      ),
    [mode, maxHours, showOnlyOffline, offlineTrailIds],
  );

  const [selectedTrailId, setSelectedTrailId] = useState<string>(TRAILS[0]!.id);

  const selectedTrail = useMemo(
    () => trails.find((t) => t.id === selectedTrailId) ?? trails[0] ?? TRAILS[0]!,
    [trails, selectedTrailId],
  );

  const selectedTrailCoordinates = useMemo(() => {
    if (!selectedTrail) return [];
    return selectedTrail.stops
      .map((stop) => {
        const site = getSite(stop.siteSlug);
        return site ? ([site.lng, site.lat] as [number, number]) : null;
      })
      .filter((coord): coord is [number, number] => coord !== null);
  }, [selectedTrail]);

  const trailSites = useMemo(() => {
    if (!selectedTrail) return HERITAGE_SITES;
    const sites = selectedTrail.stops
      .map((stop) => getSite(stop.siteSlug))
      .filter((site): site is NonNullable<typeof site> => !!site);
    return sites.length > 0 ? sites : HERITAGE_SITES;
  }, [selectedTrail]);

  return (
    <>
      <PageHeader
        kicker={t("nav.trails")}
        title={t("trails.title")}
        subtitle={t("trails.subtitle")}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 md:grid-cols-3">
          <div>
            <Label htmlFor="origin" className="text-sm">
              Starting point
            </Label>
            <select
              id="origin"
              value={originIdx}
              onChange={(e) => setOriginIdx(Number(e.target.value))}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
            >
              {ORIGINS.map((o, i) => (
                <option key={o.label} value={i}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="mode" className="text-sm">
              Travel mode
            </Label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
            >
              <option value="all">Any</option>
              <option value="walk">Walking</option>
              <option value="cycle">Cycling</option>
              <option value="car">Car</option>
              <option value="transit">Public transit</option>
            </select>
          </div>
          <div>
            <Label htmlFor="hours" className="text-sm">
              Max duration: {maxHours} h
            </Label>
            <input
              id="hours"
              type="range"
              min={4}
              max={24}
              step={1}
              value={maxHours}
              onChange={(e) => setMaxHours(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--color-primary)]"
            />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Trail map</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Active route:{" "}
                <strong className="text-foreground">{localized(selectedTrail.name, locale)}</strong>{" "}
                ({selectedTrail.region} · {selectedTrail.distanceKm} km ·{" "}
                {selectedTrail.stops.length} monument stops)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Save Active Trail for Offline Use Toggle Button */}
              <Button
                variant={isOfflineSaved(selectedTrail.id) ? "outline" : "default"}
                size="sm"
                onClick={() => toggleOffline(selectedTrail.id)}
                disabled={isSaving}
                className={`gap-1.5 rounded-xl border text-xs font-semibold shadow-sm transition ${
                  isOfflineSaved(selectedTrail.id)
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border-amber-500/50 bg-amber-500 text-stone-950 hover:bg-amber-400"
                }`}
              >
                {isOfflineSaved(selectedTrail.id) ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    <span>Saved for Offline Use</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5" />
                    <span>Save Trail for Offline Use</span>
                  </>
                )}
              </Button>

              {trails.length > 1 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="active-trail-select" className="text-xs text-muted-foreground">
                    Select trail:
                  </Label>
                  <select
                    id="active-trail-select"
                    value={selectedTrail.id}
                    onChange={(e) => setSelectedTrailId(e.target.value)}
                    className="h-9 rounded-lg border border-border bg-background px-2 text-xs"
                  >
                    {trails.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {localized(tr.name, locale)} ({tr.region})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <IndiaMapLibre sites={trailSites} trailCoordinates={selectedTrailCoordinates} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">
            {t("common.nearby")} — {origin.label}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map(({ site, km }) => (
              <li
                key={site.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <Navigation className="size-4 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{localized(site.titles, locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {site.district}, {site.state}
                  </p>
                </div>
                <span className="ml-auto text-sm font-semibold text-primary">{km} km</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Personalised routes</h2>
              <p className="text-sm text-muted-foreground">{trails.length} matching trails</p>
            </div>

            {/* Offline Filter Toggle Pills */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1 text-xs">
              <button
                type="button"
                onClick={() => setShowOnlyOffline(false)}
                className={`rounded-lg px-3 py-1 font-medium transition ${
                  !showOnlyOffline
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Trails ({TRAILS.length})
              </button>
              <button
                type="button"
                onClick={() => setShowOnlyOffline(true)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition ${
                  showOnlyOffline
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HardDrive className="size-3" />
                Offline Field Packs ({offlineTrailIds.length})
              </button>
            </div>
          </div>

          {trails.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {showOnlyOffline
                ? "No trails cached for offline use yet. Click 'Save Trail for Offline Use' to pre-cache itineraries."
                : "No trails match this travel mode and duration. Try widening the duration slider."}
            </p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {trails.map((trail) => {
                const isSelected = selectedTrail.id === trail.id;
                const isCachedOffline = isOfflineSaved(trail.id);

                return (
                  <div
                    key={trail.id}
                    className={`flex flex-col gap-2 rounded-2xl transition-all ${
                      isSelected ? "p-1 ring-2 ring-primary" : ""
                    }`}
                  >
                    <TrailCard trail={trail} />
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isSelected ? "default" : "secondary"}
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedTrailId(trail.id);
                          window.scrollTo({ top: 380, behavior: "smooth" });
                        }}
                      >
                        {isSelected ? "Viewing on map" : "View route on map"}
                      </Button>

                      {/* 1-Click Offline Field Storage Toggle */}
                      <Button
                        variant={isCachedOffline ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => toggleOffline(trail.id)}
                        disabled={isSaving}
                        className={`gap-1 px-2.5 ${
                          isCachedOffline
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "text-stone-300 hover:text-white"
                        }`}
                        title={
                          isCachedOffline
                            ? "Cached for offline guidance"
                            : "Cache trail & stop dossiers for offline field use"
                        }
                      >
                        {isCachedOffline ? (
                          <>
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                            <span className="hidden sm:inline text-[11px]">Offline Ready</span>
                          </>
                        ) : (
                          <>
                            <Download className="size-3.5" />
                            <span className="hidden sm:inline text-[11px]">Save Offline</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant={saved.includes(trail.id) ? "secondary" : "outline"}
                        size="sm"
                        className="px-2.5"
                        onClick={() => {
                          setSavedStore((prev) => ({
                            ...prev,
                            trails: prev.trails.includes(trail.id)
                              ? prev.trails.filter((id) => id !== trail.id)
                              : [...prev.trails, trail.id],
                          }));
                          toast.success(
                            saved.includes(trail.id)
                              ? "Removed from itineraries"
                              : "Saved to your itineraries",
                          );
                        }}
                      >
                        <Bookmark className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border surface-heritage p-6">
          <h2 className="text-xl font-semibold">Local artisans & services on saved trails</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRAILS.flatMap((tr) =>
              tr.stops.flatMap((stop) => getSite(stop.siteSlug)?.artisans ?? []),
            )
              .slice(0, 6)
              .map((a) => (
                <li key={a.id} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.craft}</p>
                  <p className="text-xs text-muted-foreground">{a.contactNote}</p>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </>
  );
}
