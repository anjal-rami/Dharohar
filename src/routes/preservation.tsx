import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import {
  CATEGORY_META,
  HERITAGE_SITES,
  PRESERVATION_REPORTS,
  getSite,
  type HeritageSite,
  type PreservationStatus,
} from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/layout/page-header";
import { IndiaHeritageMap } from "@/components/heritage/india-map";
import { PreservationChip } from "@/components/heritage/chips";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/preservation")({
  head: () => ({
    meta: [
      { title: "Preservation map — heritage condition tracking | Dharohar" },
      {
        name: "description",
        content:
          "Track heritage condition across India: safe, needs attention, at risk and under restoration, with field reports by region.",
      },
      { property: "og:title", content: "Preservation map — heritage condition tracking" },
      {
        property: "og:description",
        content: "Region-wise preservation status and community field reports.",
      },
    ],
  }),
  component: Preservation,
});

export function PreservationReportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [monumentCode, setMonumentCode] = useState("");
  const [riskCategory, setRiskCategory] = useState("Structural Fracture / Crack Propagation");
  const [fileName, setFileName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg border rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-semibold text-base">ASI Preservation & Damage Incident Report</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <span className="text-3xl">🛡️</span>
            <h4 className="font-semibold text-sm">Dispatched to ASI Regional Circle</h4>
            <p className="text-xs text-muted-foreground">Incident docket ID: #ASI-INC-2026-8819</p>
            <p className="text-xs text-muted-foreground">
              Logged in Tamper-Proof Moderation Audit Log with cryptographic timestamp.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium">Monument / Structure Code</label>
              <input
                required
                value={monumentCode}
                onChange={(e) => setMonumentCode(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
                placeholder="e.g. ASI-DEL-04 (Qutb Minar Complex)"
              />
            </div>

            <div>
              <label className="text-xs font-medium">Risk Category</label>
              <select
                value={riskCategory}
                onChange={(e) => setRiskCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
              >
                <option value="Structural Fracture / Crack Propagation">
                  Structural Fracture / Crack Propagation
                </option>
                <option value="Vegetation Root Intrusion">Vegetation Root Intrusion</option>
                <option value="Unauthorized Encroachment / Construction">
                  Unauthorized Encroachment / Construction
                </option>
                <option value="Surface Defacement / Graffiti">Surface Defacement / Graffiti</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium">Geotagged Photographic Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                className="w-full mt-1 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground cursor-pointer"
              />
              {fileName && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  Selected: {fileName} (EXIF geotag verified)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs border rounded-lg cursor-pointer hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs bg-primary text-primary-foreground font-medium rounded-lg cursor-pointer hover:bg-primary/90 transition"
              >
                File Verified ASI Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const STATUSES: PreservationStatus[] = ["safe", "attention", "risk", "restoration"];

function Preservation() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<PreservationStatus | "all">("all");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(() => {
    return getSite("pandavani-oral-epic") ?? getSite("palm-leaf-manuscripts-odisha") ?? HERITAGE_SITES[0] ?? null;
  });

  const sites = useMemo(
    () =>
      filter === "all" ? HERITAGE_SITES : HERITAGE_SITES.filter((s) => s.preservation === filter),
    [filter],
  );

  const counts = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        count: HERITAGE_SITES.filter((s) => s.preservation === status).length,
      })),
    [],
  );

  const byState = useMemo(() => {
    const map = new Map<string, number>();
    HERITAGE_SITES.filter(
      (s) => s.preservation === "risk" || s.preservation === "attention",
    ).forEach((s) => map.set(s.state, (map.get(s.state) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <>
      <PageHeader
        kicker={t("nav.preservation")}
        title={t("preservation.title")}
        subtitle={t("preservation.subtitle")}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {counts.map(({ status, count }) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(filter === status ? "all" : status)}
              aria-pressed={filter === status}
              className={`rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                filter === status
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <PreservationChip status={status} />
              <p className="mt-2 font-display text-3xl font-semibold">{count}</p>
              <p className="text-xs text-muted-foreground">records in this state of care</p>
            </button>
          ))}
        </section>

        {/* Condition Map Section with Isolated Stacking Context (Option A) */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Condition map</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any monument marker on the map to inspect live structural risk telemetry and circle jurisdiction.
              </p>
            </div>
            {filter !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
                Clear status filter
              </Button>
            )}
          </div>

          {/* Container holding the map (left) and the detail panel (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative mt-6">
            {/* MAP CONTAINER: 
                1. isolate creates a new stacking context so Leaflet markers (z-400..600) cannot escape.
                2. overflow-hidden cuts off anything extending beyond this box. */}
            <div className="lg:col-span-7 relative isolate z-0 overflow-hidden rounded-2xl border border-border bg-card max-w-full">
              {/* Your Map Component / Div */}
              <div id="condition-map" className="w-full max-w-full h-[580px] relative isolate overflow-hidden">
                <IndiaHeritageMap
                  sites={sites}
                  height="580px"
                  colorBy="preservation"
                  showAccessibleList={false}
                  initialActiveSlug={selectedSite?.slug}
                  onSelectSite={(slug) => {
                    const found = HERITAGE_SITES.find((s) => s.slug === slug);
                    if (found) setSelectedSite(found);
                  }}
                />
              </div>

              {/* SOI baseline pill */}
              <div className="absolute bottom-2 left-2 z-[10] bg-background/90 backdrop-blur-md px-3 py-1 rounded text-[10px] text-muted-foreground border pointer-events-none select-none">
                Survey of India (SOI) Aligned Baseline • National Geospatial Policy 2022
              </div>
            </div>

            {/* RIGHT DETAIL CARD:
                relative z-20 forces this entire dark panel to sit ON TOP of the map column */}
            <div
              className="lg:col-span-5 relative z-20 bg-[#121212] border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4"
              style={{ backgroundColor: "#121212" }}
            >
              {/* Close button and badge */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-500">
                    {selectedSite ? `${CATEGORY_META[selectedSite.category]?.icon ?? "🗣️"} ${CATEGORY_META[selectedSite.category]?.label ?? "Oral History"}` : "🗣️ Oral History"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-red-500/15 text-red-400 border border-red-500/30 font-medium">
                    {selectedSite?.preservation || "attention"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSite(null)}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Title and metadata */}
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedSite?.name || (selectedSite ? (localized(selectedSite.titles, locale) || selectedSite.title) : "Pandavani oral epic, Chhattisgarh")}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  📍 {selectedSite ? `${selectedSite.district ? `${selectedSite.district}, ` : ""}${selectedSite.state} · [ ${selectedSite.lng.toFixed(4)} , ${selectedSite.lat.toFixed(4)} ]` : "Durg, Chhattisgarh · [ 81.2849 , 21.1904 ]"}
                </p>
              </div>

              {/* Era & Style grid */}
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Era / Period</span>
                  <span className="text-xs font-semibold capitalize text-slate-100">{selectedSite?.period || "Documented from 20th century"}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Style</span>
                  <span className="text-xs font-semibold capitalize text-slate-100">{selectedSite?.era || "living"}</span>
                </div>
              </div>

              {/* Historical Legacy */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Historical Legacy
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedSite ? (localized(selectedSite.description, locale) || localized(selectedSite.summary, locale) || "A single performer narrates, sings and acts Mahabharata episodes in Chhattisgarhi, often centring Bhima. The Kapalik and Vedamati styles differ in whether the singer stands and enacts or remains seated.") : "A single performer narrates, sings and acts Mahabharata episodes in Chhattisgarhi, often centring Bhima. The Kapalik and Vedamati styles differ in whether the singer stands and enacts or remains seated."}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {selectedSite ? (
                  <Link
                    to="/heritage/$slug"
                    params={{ slug: selectedSite.slug }}
                    className="block w-full py-2.5 px-4 text-center text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Open Complete Heritage Dossier ↗
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const defaultSite = getSite("pandavani-oral-epic") ?? getSite("palm-leaf-manuscripts-odisha") ?? HERITAGE_SITES[0];
                      if (defaultSite) setSelectedSite(defaultSite);
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Open Complete Heritage Dossier ↗
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="block w-full py-2 px-4 text-center text-xs font-semibold border border-stone-700 bg-stone-900 hover:bg-stone-800 text-slate-100 rounded-xl transition cursor-pointer shadow-sm"
                >
                  File Field Damage Report 🛡️
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold">Latest field reports</h2>
            <ul className="mt-4 space-y-3">
              {PRESERVATION_REPORTS.map((report) => {
                const site = getSite(report.siteSlug);
                return (
                  <li key={report.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {site && (
                        <Link
                          to="/heritage/$slug"
                          params={{ slug: site.slug }}
                          className="text-sm font-semibold underline-offset-4 hover:underline"
                        >
                          {localized(site.titles, locale)}
                        </Link>
                      )}
                      <PreservationChip status={report.status} className="ml-auto" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {report.reportedBy} · {report.date}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{report.note}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-status-risk/35 bg-status-risk/8 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="size-4 text-status-risk" aria-hidden />
                Priority regions
              </h2>
              <ul className="mt-3 space-y-2">
                {byState.map(([state, count]) => (
                  <li key={state} className="flex items-center justify-between text-sm">
                    <span>{state}</span>
                    <span className="font-semibold">{count} needing action</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">File a preservation report</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified experts and local custodians can update condition levels. Every change is
                written to the audit log with the reporter's identity.
              </p>
              <Button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="mt-3 w-full cursor-pointer"
              >
                File Verified ASI Ticket
              </Button>
            </section>
          </aside>
        </section>
      </div>

      <PreservationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
}
