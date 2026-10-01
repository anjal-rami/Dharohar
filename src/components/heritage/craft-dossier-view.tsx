import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Sparkles,
  History,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ShieldCheck,
  ChevronRight,
  Hammer,
  Feather,
  Layers,
  Leaf,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { CraftDossier } from "@/types/craft";
import { CRAFT_DOSSIERS } from "@/lib/crafts-data";
import { Button } from "@/components/ui/button";
import { VerifiedChip } from "@/components/heritage/chips";
import { cn } from "@/lib/utils";

interface CraftDossierViewProps {
  dossier: CraftDossier;
}

export function CraftDossierView({ dossier }: CraftDossierViewProps) {
  const [saved, setSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: dossier.craftName,
          text: dossier.historicalLineage?.royalPatronageOrGenesis || dossier.craftName,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Craft dossier link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setSaved(!saved);
    toast.success(!saved ? "Saved to your Artisan Heritage Trail!" : "Removed from saved crafts.");
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const stagesText = (dossier.artisanalTechnique || [])
      .map((s, idx) => `Stage ${idx + 1}: ${s.stage}. ${s.description}`)
      .join(". ");
    const originText = dossier.historicalLineage
      ? `Origin: ${dossier.historicalLineage.originCentury} at ${dossier.historicalLineage.clusterLocation}. ${dossier.historicalLineage.royalPatronageOrGenesis}.`
      : "";
    const materialsText = dossier.rawMaterials?.length ? `Key raw materials include: ${dossier.rawMaterials.join(", ")}.` : "";
    const narrationText = `${dossier.craftName}, ${dossier.nativeName}. Traditional craft of ${dossier.state}, ${dossier.region} India. ${originText} ${materialsText} Artisanal techniques: ${stagesText}. Sustainability and ecosystem: ${dossier.sustainabilityAndEcosystem || ""}. Current preservation status: ${dossier.preservationStatus || ""}.`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    toast.info("Playing craft heritage audio narration...");
  };

  const otherCrafts = CRAFT_DOSSIERS.filter((c) => c.slug !== dossier.slug).slice(0, 4);

  const isVulnerable = dossier.preservationStatus === "Vulnerable";
  const isEndangered = dossier.preservationStatus === "Endangered Technique Requiring GI Enforcement";

  return (
    <article className="min-h-screen bg-stone-950 text-stone-100 pb-24 selection:bg-amber-500 selection:text-stone-950">
      {/* Cinematic Showcase Container with Authentic Craft Cover Image */}
      <div className="relative isolate overflow-hidden border-b border-stone-800/80">
        {/* Full Bleed Hero Cover Image */}
        <div className="absolute inset-0 -z-20 size-full overflow-hidden">
          <img
            src={dossier.heroImage || dossier.imageUrl}
            alt={dossier.craftName || dossier.title}
            className="size-full object-cover object-center transform scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset["fallbackApplied"]) return;
              target.dataset["fallbackApplied"] = "true";
              target.src = "/assets/hero-heritage.jpg";
            }}
          />
        </div>
        {/* Deep Gradient Scrim Overlay for Crisp Contrast and Readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/45 backdrop-blur-[2px]" />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6">
          {/* Breadcrumb nav */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-stone-400">
            <Link to="/" className="hover:text-amber-400 transition">
              Dharohar
            </Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-amber-400 transition">
              Living Heritage
            </Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-amber-400 transition">
              Crafts & Handlooms
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {dossier.craftName}
            </span>
          </nav>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              🧵 {dossier.category}
            </span>

            {/* Official GI Tag Certified ribbon */}
            <span className="rounded-full bg-sky-950/90 text-sky-200 border border-sky-400/70 px-3.5 py-1 text-xs font-bold tracking-tight shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <ShieldCheck className="size-3.5 text-sky-400 shrink-0" />
              <span className="whitespace-nowrap">{dossier.giTag || dossier.giStatus || "Geographical Indication (GI) Registered"}</span>
            </span>

            <span className="rounded-full bg-stone-800/80 px-3 py-1 text-xs font-medium text-stone-300 border border-stone-700 whitespace-nowrap shrink-0">
              📍 {dossier.state} ({dossier.region} India)
            </span>

            {/* Preservation Status Badge */}
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 border whitespace-nowrap shrink-0",
                isEndangered
                  ? "bg-rose-950/90 text-rose-200 border-rose-500/70"
                  : isVulnerable
                  ? "bg-amber-950/90 text-amber-200 border-amber-500/70"
                  : "bg-emerald-950/90 text-emerald-200 border-emerald-500/70"
              )}
            >
              {isEndangered || isVulnerable ? (
                <AlertTriangle className="size-3 shrink-0" />
              ) : (
                <CheckCircle2 className="size-3 shrink-0" />
              )}
              <span className="whitespace-nowrap">Status: {dossier.preservationStatus || "Thriving"}</span>
            </span>

            <VerifiedChip className="bg-card/90" />
          </div>

          {/* Native Script Calligraphy */}
          <p className="mt-4 font-serif text-2xl md:text-3xl text-amber-400/95 tracking-wide font-medium">
            {dossier.nativeName || dossier.title || dossier.craftName}
          </p>

          {/* Title */}
          <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {dossier.craftName || dossier.title}
          </h1>

          {/* Subtitle & Cluster Genesis */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-stone-300 text-sm">
            {dossier.historicalLineage?.clusterLocation && (
              <span className="inline-flex items-center gap-1.5 text-stone-200">
                <MapPin className="size-4 text-amber-400 shrink-0" aria-hidden />{" "}
                Cluster: <strong className="text-white font-semibold">{dossier.historicalLineage.clusterLocation}</strong>
              </span>
            )}
            {dossier.historicalLineage?.clusterLocation && dossier.historicalLineage?.originCentury && (
              <span>&bull;</span>
            )}
            {dossier.historicalLineage?.originCentury && (
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                <History className="size-4 text-amber-400 shrink-0" aria-hidden />{" "}
                {dossier.historicalLineage.originCentury}
              </span>
            )}
            {dossier.state && (
              <>
                <span>&bull;</span>
                <span className="text-stone-300">
                  State: <strong className="text-white">{dossier.state}</strong>
                </span>
              </>
            )}
          </div>

          {/* Technique & Heritage Tags */}
          {dossier.tags && dossier.tags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-400 mr-1 flex items-center gap-1 shrink-0">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Verified Techniques:</span>
              </span>
              {dossier.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-900 border border-stone-800 px-2.5 py-0.5 text-xs font-medium text-stone-300 shadow-xs whitespace-nowrap shrink-0 hover:border-amber-500/40 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleBookmark}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/20"
            >
              <Bookmark className="mr-1.5 size-4" />
              {saved ? "Saved to Trail" : "Save Craft Tradition"}
            </Button>
            <Button
              variant="outline"
              onClick={toggleSpeech}
              className="border-stone-700 bg-stone-900/80 text-stone-200 hover:bg-stone-800"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="mr-1.5 size-4 text-amber-400 animate-pulse" /> Stop Narration
                </>
              ) : (
                <>
                  <Volume2 className="mr-1.5 size-4 text-amber-400" /> Listen to Audio Dossier
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleShare}
              className="bg-stone-800/80 text-stone-200 hover:bg-stone-700 border border-stone-700"
            >
              <Share2 className="mr-1.5 size-4" /> Share
            </Button>
            <Button asChild variant="outline" className="border-stone-700 bg-stone-900/80 text-stone-300 hover:bg-stone-800">
              <Link to="/explore">Explore All Crafts</Link>
            </Button>
          </div>

          {/* Hero Section: Full Uncropped Photograph Showcase */}
          <div className="mt-8 relative w-full overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-950/90 shadow-2xl">
            {/* Ambient Blurred Aura behind uncropped image */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
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
              alt={dossier.craftName}
              loading="eager"
              className="w-full h-auto max-h-[620px] object-contain mx-auto block rounded-2xl relative z-10 transition-transform duration-700 hover:scale-[1.01]"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset["fallbackApplied"]) return;
                target.dataset["fallbackApplied"] = "true";
                target.src = "/assets/hero-heritage.jpg";
              }}
            />
            
            {/* Image caption bar */}
            <div className="relative z-20 border-t border-stone-800/70 bg-stone-950/80 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-stone-400 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <Compass className="size-3.5 text-amber-400" />
                <span>Documented Master Cluster: <strong className="text-stone-200">{dossier.historicalLineage?.clusterLocation || dossier.region}</strong></span>
              </span>
              <span className="text-amber-400/90 font-semibold">{dossier.giTag || dossier.giStatus || "Geographical Indication (GI) Registered"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout matching 1.65fr : 1fr grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.65fr_1fr]">
        {/* Left Column: Lineage, Technique Breakdown, Raw Materials, Ecosystem */}
        <div className="space-y-10">
          {/* Section 1: Historical Lineage & Royal Genesis */}
          {dossier.historicalLineage && (
            <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 text-amber-400">
                <History className="size-5" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Historical Lineage & Royal Genesis</h2>
              </div>
              <p className="mt-4 leading-relaxed text-stone-200 text-base md:text-lg">
                {dossier.historicalLineage.royalPatronageOrGenesis}
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-800/80">
                <div className="rounded-xl bg-stone-950/70 p-4 border border-stone-800">
                  <span className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                    <History className="size-3.5" /> Origin Era & Century
                  </span>
                  <p className="mt-1 text-base font-semibold text-white">{dossier.historicalLineage.originCentury}</p>
                </div>
                <div className="rounded-xl bg-stone-950/70 p-4 border border-stone-800">
                  <span className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Artisan Master Cluster
                  </span>
                  <p className="mt-1 text-base font-semibold text-white">{dossier.historicalLineage.clusterLocation}</p>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Technique Breakdown - Interactive Numbered Stages */}
          {Boolean(dossier.artisanalTechnique?.length) && (
            <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 text-amber-400">
                <Hammer className="size-5" />
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Artisanal Technique & Codified Stages
                </h2>
              </div>
              <p className="mt-2 text-sm text-stone-400">
                Master manufacturing methodology transmitted down generations through hereditary guilds and oral memory.
              </p>

              <div className="mt-6 space-y-4">
                {dossier.artisanalTechnique?.map((stage, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-900/90 shadow-md group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-500/5 font-mono text-sm font-bold text-amber-300 border border-amber-500/40 group-hover:scale-110 transition-transform">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {stage.stage}
                        </h3>
                        <p className="text-sm leading-relaxed text-stone-300">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Raw Materials & Tooling Grid */}
          {Boolean(dossier.rawMaterials?.length) && (
            <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 text-emerald-400">
                <Leaf className="size-5" />
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Raw Materials & Indigenous Tooling
                </h2>
              </div>
              <p className="mt-2 text-sm text-stone-400">
                Zero-chemical, biodegradable, and sustainable mineral/botanical elements harvestable locally from Indian soil.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {dossier.rawMaterials?.map((material, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-stone-950/80 p-4 border border-stone-800 hover:border-emerald-500/40 transition group"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400/90 uppercase tracking-wider mb-1">
                      <Feather className="size-3.5" />
                      <span>Material #{idx + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                      {material}
                    </p>
                    <span className="inline-block mt-2 rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/20">
                      Eco-Friendly & Indigenous
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Artisan Ecosystem & Sustainability Card */}
          <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-amber-950/20 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-amber-400">
              <Users className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Artisan Ecosystem & Sustainability
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-stone-200 text-base md:text-lg">
              {dossier.sustainabilityAndEcosystem}
            </p>

            <div className="mt-6 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                  Preservation Condition
                </span>
                <p className={cn(
                  "text-lg font-bold mt-1",
                  isEndangered ? "text-rose-400" : isVulnerable ? "text-amber-400" : "text-emerald-400"
                )}>
                  {dossier.preservationStatus}
                </p>
              </div>

              <div className="rounded-xl bg-stone-950/90 border border-stone-800 px-4 py-2.5">
                <span className="text-[11px] text-stone-400 block font-medium">Environmental Impact</span>
                <span className="text-xs font-bold text-emerald-400">Zero-Carbon & Non-Toxic Footprint</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Cultural Metadata Sidebar & Related Crafts */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Classification & GI Dossier Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="size-4" />
              <span>Craft Heritage Dossier</span>
            </div>

            <dl className="mt-5 space-y-4 text-sm divide-y divide-stone-800/80">
              <div className="pt-3 first:pt-0 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Domain</dt>
                <dd className="text-right text-stone-100 font-semibold">{dossier.category}</dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">GI Certification</dt>
                <dd className="text-right text-sky-300 font-semibold text-xs max-w-[200px]">
                  {dossier.giTag || dossier.giStatus || "Geographical Indication (GI) Registered"}
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">State & Region</dt>
                <dd className="text-right text-stone-100 font-semibold">
                  {dossier.state} ({dossier.region} India)
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Master Cluster</dt>
                <dd className="text-right text-amber-300 font-semibold">
                  {dossier.historicalLineage?.clusterLocation || dossier.region}
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Origin Period</dt>
                <dd className="text-right text-stone-200">
                  {dossier.historicalLineage?.originCentury || "Ancient Tradition"}
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Codified Steps</dt>
                <dd className="text-right text-amber-300 font-semibold">
                  {dossier.artisanalTechnique?.length || (dossier.tags?.length || 3)} Handcraft Stages
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Preservation</dt>
                <dd className={cn(
                  "text-right font-bold text-xs",
                  isEndangered ? "text-rose-400" : isVulnerable ? "text-amber-400" : "text-emerald-400"
                )}>
                  {dossier.preservationStatus}
                </dd>
              </div>
            </dl>
          </div>

          {/* Related Crafts & Handlooms */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center justify-between">
              <span>Related Master Handcrafts</span>
              <Sparkles className="size-4 text-amber-400" />
            </h3>
            <p className="mt-1 text-xs text-stone-400">
              Discover GI-certified weaves, ceramics, and folk art forms across India
            </p>

            <div className="mt-4 space-y-3">
              {otherCrafts.map((item) => (
                <Link
                  key={item.id}
                  to="/crafts/$slug"
                  params={{ slug: item.slug }}
                  className="group flex items-center gap-3.5 rounded-xl border border-stone-800/80 bg-stone-950/60 p-2.5 transition hover:border-amber-500/50 hover:bg-stone-900/80 cursor-pointer"
                >
                  <img
                    src={item.heroImage}
                    alt={item.craftName}
                    className="size-14 rounded-lg object-cover border border-stone-800 shrink-0 group-hover:scale-105 transition"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.dataset["fallbackApplied"]) return;
                      target.dataset["fallbackApplied"] = "true";
                      target.src = "/assets/hero-heritage.jpg";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white group-hover:text-amber-300 transition">
                      {item.craftName}
                    </p>
                    <p className="text-[11px] text-stone-400">{item.state} &bull; {item.region} India</p>
                    <p className="text-[10px] text-amber-400/90 font-serif truncate">{item.nativeName}</p>
                  </div>
                  <ChevronRight className="size-4 text-stone-600 group-hover:text-amber-400 transition shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
