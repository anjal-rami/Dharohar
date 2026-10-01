import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Utensils,
  History,
  Users,
  Share2,
  Bookmark,
  ChevronRight,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import type { FestivalDossier } from "@/types/festival";
import { FESTIVAL_DOSSIERS } from "@/lib/festivals-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VerifiedChip } from "@/components/heritage/chips";

export function FestivalDossierView({ dossier }: { dossier: FestivalDossier }) {
  const [activeTab, setActiveTab] = useState<"rituals" | "origin" | "cuisine" | "artisans">("rituals");
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: dossier.name,
        text: dossier.significance,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Festival dossier link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setSaved(!saved);
    toast.success(!saved ? "Saved to your Cultural Itinerary!" : "Removed from saved festivals.");
  };

  // Other festivals in same region or across India
  const otherFestivals = FESTIVAL_DOSSIERS.filter((f) => f.slug !== dossier.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-stone-950 text-stone-100 pb-20 selection:bg-amber-500 selection:text-stone-950">
      {/* Dedicated Aspect-Ratio Showcase Container */}
      <div className="relative isolate overflow-hidden border-b border-stone-800/80 bg-gradient-to-b from-[#141414] via-stone-950 to-stone-950">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 inset-x-0 h-96 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6">
          {/* Breadcrumb nav */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-stone-400">
            <Link to="/" className="hover:text-amber-400 transition">Dharohar</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-amber-400 transition">Living Heritage</Link>
            <span>/</span>
            <span className="text-amber-400 font-medium">{dossier.name}</span>
          </nav>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              🪔 Living Festival
            </span>
            {dossier.unescoStatus && (
              <span className="rounded-full bg-marigold px-2.5 py-0.5 text-xs font-semibold text-marigold-foreground">
                UNESCO Inscribed
              </span>
            )}
            <VerifiedChip className="bg-card/90" />
          </div>

          {/* Native Script Calligraphy */}
          <p className="mt-3 font-serif text-2xl md:text-3xl text-amber-400/95 tracking-wide font-medium">
            {dossier.nativeName}
          </p>

          {/* Title */}
          <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {dossier.name}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 flex flex-wrap items-center gap-2 text-stone-400 text-sm">
            <span className="inline-flex items-center gap-1.5 text-stone-200">
              <MapPin className="size-4 text-amber-400" aria-hidden /> {dossier.state}, {dossier.region} India
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-stone-300">
              <Calendar className="size-4 text-amber-400" aria-hidden /> {dossier.monthHindi}
            </span>
            <span>&bull;</span>
            <span className="text-amber-300/90 font-medium">{dossier.historicalOrigin.period}</span>
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button onClick={handleBookmark}>
              <Bookmark className="mr-1.5 size-4" />
              {saved ? "Saved" : "Save Festival"}
            </Button>
            <Button variant="secondary" onClick={handleShare}>
              <Share2 className="mr-1.5 size-4" /> Share
            </Button>
            <Button asChild variant="outline" className="bg-card/80">
              <Link to="/explore">Explore all records</Link>
            </Button>
          </div>

          {/* Full Uncut Image Display Showcase (Option A) */}
          <div className="mt-8 relative w-full overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-950/80 shadow-2xl">
            {/* Ambient Blurred Aura behind uncropped image */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={dossier.heroImage}
                alt=""
                aria-hidden
                className="size-full object-cover blur-3xl opacity-25 scale-110"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.dataset["fallbackApplied"]) return;
                  target.dataset["fallbackApplied"] = "true";
                  target.src = "/assets/hero-heritage.jpg";
                }}
              />
              <div className="absolute inset-0 bg-stone-950/60" />
            </div>

            {/* Complete, Uncropped Photograph with Natural Proportions */}
            <img
              src={dossier.heroImage}
              alt={dossier.name}
              className="w-full h-auto max-h-[580px] object-contain mx-auto block rounded-2xl relative z-10 transition-transform duration-700 hover:scale-[1.01]"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset["fallbackApplied"]) return;
                target.dataset["fallbackApplied"] = "true";
                target.src = "/assets/hero-heritage.jpg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout matching 1.6fr : 1fr grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left Column: About & Dossier Tabs */}
        <div className="space-y-10">
          {/* About & Cultural Significance */}
          <section>
            <h2 className="text-2xl font-semibold text-white">About the Celebration</h2>
            <p className="mt-3 leading-relaxed text-stone-300">
              {dossier.significance}
            </p>
            <div className="mt-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4 text-sm">
              <p className="text-stone-200">
                <strong>Cultural significance.</strong> {dossier.significance}
              </p>
              {dossier.historicalOrigin.deityOrTheme && (
                <p className="mt-2 text-xs text-amber-400">
                  <strong>Presiding Deity / Theme:</strong> {dossier.historicalOrigin.deityOrTheme}
                </p>
              )}
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Season: {dossier.monthHindi} · Geographic zone: {dossier.region} India · Status: {dossier.unescoStatus || "National Heritage"}
            </p>
          </section>

          {/* Dossier Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
            {[
              { id: "rituals", label: "Day-by-Day Rituals", icon: Flame },
              { id: "origin", label: "Genesis & Lineage", icon: History },
              { id: "cuisine", label: "Sacred Prasadam", icon: Utensils },
              { id: "artisans", label: "Community & Crafts", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer shrink-0",
                      isActive
                        ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                        : "bg-stone-900/70 border border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200",
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Day-by-Day Rituals */}
            {activeTab === "rituals" && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Flame className="size-5 text-amber-500" />
                      <span>Day-by-Day Ritual Sequence</span>
                    </h2>
                    <p className="mt-1 text-xs text-stone-400">
                      Step-by-step unfolding of sacred community rites, temple liturgies, and mass festivities.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                    {dossier.rituals.length} Sacred Stages
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative border-l-2 border-stone-800 ml-4 space-y-6 pl-6">
                  {dossier.rituals.map((ritual, idx) => (
                    <div key={ritual.day} className="relative group">
                      {/* Timeline Marker */}
                      <div className="absolute -left-[33px] top-1 size-4 rounded-full border-2 border-stone-900 bg-amber-500 ring-4 ring-stone-950 group-hover:scale-125 transition-transform" />

                      <div className="rounded-2xl border border-stone-800/80 bg-[#161616] p-5 shadow-lg transition-all hover:border-amber-500/30 hover:bg-[#1a1a1a]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-md bg-stone-900 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-400 border border-stone-800">
                            {ritual.day}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-500">
                            Stage {idx + 1} of {dossier.rituals.length}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {ritual.title}
                        </h3>
                        <p className="mt-2 text-sm text-stone-300 leading-relaxed">
                          {ritual.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 2: Historical & Mythological Genesis */}
            {activeTab === "origin" && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="size-5 text-amber-500" />
                    <span>Historical & Mythological Genesis</span>
                  </h2>
                  <p className="mt-1 text-xs text-stone-400">
                    Ancient scriptural references, dynastic royal patronage, and deep philosophical origins.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-800 bg-[#161616] p-5">
                    <span className="text-xs font-semibold text-stone-400">Centuries Active & Period</span>
                    <p className="mt-1 text-lg font-bold text-amber-400">
                      {dossier.historicalOrigin.period}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-800 bg-[#161616] p-5">
                    <span className="text-xs font-semibold text-stone-400">Primary Deity / Philosophical Theme</span>
                    <p className="mt-1 text-lg font-bold text-amber-400">
                      {dossier.historicalOrigin.deityOrTheme}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[#181818] to-[#141414] p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <Sparkles className="size-4" />
                    <span>Mythological & Folklore Narrative</span>
                  </h3>
                  <p className="text-sm text-stone-200 leading-relaxed font-serif">
                    {dossier.historicalOrigin.lineage}
                  </p>
                </div>
              </section>
            )}

            {/* TAB 3: Sacred Cuisine / Prasadam */}
            {activeTab === "cuisine" && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Utensils className="size-5 text-amber-500" />
                    <span>Sacred Cuisine & Festive Prasadam</span>
                  </h2>
                  <p className="mt-1 text-xs text-stone-400">
                    Sacred offerings, seasonal harvest gastronomy, and temple banquets integral to the celebration.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {dossier.culinaryOfferings.map((dish) => (
                    <div
                      key={dish.dishName}
                      className="rounded-2xl border border-stone-800 bg-[#161616] p-5 hover:border-amber-500/40 transition-colors shadow-md"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-sm">
                          🍲
                        </span>
                        <h3 className="font-bold text-white text-base">{dish.dishName}</h3>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 4: Community & Socio-Economic Impact */}
            {activeTab === "artisans" && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="size-5 text-amber-500" />
                    <span>Artisanal Ecosystem & Socio-Economic Impact</span>
                  </h2>
                  <p className="mt-1 text-xs text-stone-400">
                    Sustaining traditional potters, weavers, idol-sculptors, florists, and folk musicians.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-[#161616] p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <Sparkles className="size-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white">
                        Livelihood & Craft Regeneration
                      </h3>
                      <p className="text-sm text-stone-300 leading-relaxed">
                        {dossier.artisanalEcosystem}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-stone-800 bg-stone-900/30 p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Empowering Local Master Artisans
                    </h4>
                    <p className="text-xs text-stone-400">
                      Explore authentic handcrafted festival essentials in our Artisan Bazaar with direct WhatsApp buying.
                    </p>
                  </div>
                  <Link
                    to="/bazaar"
                    className="shrink-0 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
                  >
                    Artisan Bazaar →
                  </Link>
                </div>
              </section>
            )}
          </div>

        {/* Right Column: Dossier Metadata & Other Festivals */}
        <div className="space-y-6">
          {/* Quick Dossier Metadata Card */}
          <div className="rounded-2xl border border-stone-800 bg-[#161616] p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Dossier Metadata
            </h3>
            <dl className="divide-y divide-stone-800 text-xs">
              <div className="flex justify-between py-2">
                <dt className="text-stone-400">State of Origin</dt>
                <dd className="font-bold text-white">{dossier.state}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-stone-400">Geographic Region</dt>
                <dd className="font-bold text-white">{dossier.region} India</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-stone-400">Auspicious Month</dt>
                <dd className="font-bold text-white">{dossier.monthHindi}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-stone-400">Heritage Status</dt>
                <dd className="font-bold text-amber-400">
                  {dossier.unescoStatus ? "UNESCO / National" : "Living Asset"}
                </dd>
              </div>
              {dossier.folkInstruments && dossier.folkInstruments.length > 0 && (
                <div className="pt-2.5 pb-1 space-y-1.5">
                  <dt className="text-stone-400 font-medium">Traditional Instruments</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {dossier.folkInstruments.map((inst) => (
                      <span
                        key={inst}
                        className="rounded-md bg-stone-900 border border-stone-800 px-2 py-0.5 text-[11px] font-medium text-amber-300/90"
                      >
                        {inst}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

            {/* Other Celebrations Across India */}
            <div className="rounded-2xl border border-stone-800 bg-[#161616] p-5 space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Explore Other Festivals
              </h3>
              <div className="space-y-2">
                {otherFestivals.map((other) => (
                  <Link
                    key={other.slug}
                    to="/festivals/$slug"
                    params={{ slug: other.slug }}
                    className="group flex items-center justify-between rounded-xl bg-stone-900/80 border border-stone-800/80 p-2.5 hover:border-amber-500/40 hover:bg-stone-800 transition"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {other.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {other.state} &bull; {other.region}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
  );
}
