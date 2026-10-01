import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Sparkles,
  History,
  Utensils,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ShieldCheck,
  ChevronRight,
  Flame,
  Leaf,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import type { CulinaryDossier } from "@/types/culture";
import { CULINARY_DOSSIERS } from "@/lib/culinary-data";
import { Button } from "@/components/ui/button";
import { VerifiedChip } from "@/components/heritage/chips";

interface CulinaryDossierViewProps {
  dossier: CulinaryDossier;
}

export function CulinaryDossierView({ dossier }: CulinaryDossierViewProps) {
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
          title: dossier.dishName || "Food Tradition",
          text: dossier.historicalGenesis?.culturalContext || dossier.shortDescription || "",
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Culinary dossier link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setSaved(!saved);
    toast.success(!saved ? "Saved to your Culinary Heritage Trail!" : "Removed from saved dishes.");
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
    const narrationText = `${dossier.dishName}, ${dossier.nativeName}. Traditional cuisine of ${dossier.state}, ${dossier.region} India. Period: ${dossier.historicalGenesis.period}. ${dossier.historicalGenesis.culturalContext}. Historical lineage: ${dossier.historicalGenesis.lineageText}. Key ingredients include: ${dossier.keyIngredients.join(", ")}. Preparation stages: ${dossier.traditionalPreparationMethod.map((s) => `${s.stage}: ${s.description}`).join(". ")}. Ayurvedic wisdom: ${dossier.nutritionalAndAyurvedicWisdom}. Serving tradition: ${dossier.culturalServingTradition}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    toast.info("Playing culinary heritage audio narration...");
  };

  const otherDishes = CULINARY_DOSSIERS.filter((d) => d.slug !== dossier.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-stone-950 text-stone-100 pb-24 selection:bg-amber-500 selection:text-stone-950">
      {/* Cinematic Showcase Container */}
      <div className="relative isolate overflow-hidden border-b border-stone-800/80 bg-gradient-to-b from-[#141414] via-stone-950 to-stone-950">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 inset-x-0 h-96 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6">
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
            <Link to="/explore" search={{ category: "food-traditions" }} className="hover:text-amber-400 transition">
              Food Traditions
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {dossier.dishName}
            </span>
          </nav>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              🍲 Culinary Heritage
            </span>
            <span className="rounded-full bg-sky-950/90 text-sky-200 border border-sky-400/70 px-3 py-1 text-xs font-semibold">
              ✨ {dossier.heritageClassification}
            </span>
            <span className="rounded-full bg-stone-800/80 px-3 py-1 text-xs font-medium text-stone-300 border border-stone-700">
              📍 {dossier.state} ({dossier.region} India)
            </span>
            <VerifiedChip className="bg-card/90" />
          </div>

          {/* Native Script Calligraphy */}
          <p className="mt-4 font-serif text-2xl md:text-3xl text-amber-400/95 tracking-wide font-medium">
            {dossier.nativeName}
          </p>

          {/* Title */}
          <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {dossier.dishName}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 flex flex-wrap items-center gap-3 text-stone-300 text-sm">
            <span className="inline-flex items-center gap-1.5 text-stone-200">
              <MapPin className="size-4 text-amber-400 shrink-0" aria-hidden /> {dossier.state},{" "}
              {dossier.region} India
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
              <History className="size-4 text-amber-400 shrink-0" aria-hidden />{" "}
              {dossier.historicalGenesis.period}
            </span>
            <span>&bull;</span>
            <span className="text-stone-300">
              Context: <strong className="text-white">{dossier.historicalGenesis.culturalContext}</strong>
            </span>
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleBookmark}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
            >
              <Bookmark className="mr-1.5 size-4" />
              {saved ? "Saved to Trail" : "Save Culinary Tradition"}
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
              <Link to="/explore">Explore All Cuisines</Link>
            </Button>
          </div>

          {/* Full Uncut Image Display Showcase */}
          <div className="mt-8 relative w-full overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-950/90 shadow-2xl">
            {/* Ambient Blurred Aura behind uncropped image */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <img
                src={dossier.heroImage}
                alt=""
                aria-hidden
                className="size-full object-cover blur-3xl opacity-20 scale-110"
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
              alt={dossier.dishName}
              loading="eager"
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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.65fr_1fr]">
        {/* Left Column: Genesis, Ingredients, Stages, Ayurveda & Etiquette */}
        <div className="space-y-10">
          {/* Section 1: Historical Genesis & Cultural Context */}
          <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-amber-400">
              <History className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Historical Genesis & Lineage</h2>
            </div>
            <p className="mt-4 leading-relaxed text-stone-200 text-base md:text-lg">
              {dossier.historicalGenesis.lineageText}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-800/80">
              <div className="rounded-xl bg-stone-950/70 p-4 border border-stone-800">
                <span className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold">
                  Historical Era
                </span>
                <p className="mt-1 text-base font-medium text-white">{dossier.historicalGenesis.period}</p>
              </div>
              <div className="rounded-xl bg-stone-950/70 p-4 border border-stone-800">
                <span className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold">
                  Cultural Context
                </span>
                <p className="mt-1 text-base font-medium text-white">{dossier.historicalGenesis.culturalContext}</p>
              </div>
            </div>
          </section>

          {/* Section 2: Key Authentic Ingredients */}
          <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-amber-400">
              <Leaf className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Key Heritage Ingredients</h2>
            </div>
            <p className="mt-2 text-sm text-stone-400">
              Indigenous grains, spices, cold-pressed oils, and traditional heirloom cultivars.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {dossier.keyIngredients.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-950/80 px-3.5 py-2 text-sm font-semibold text-amber-200 border border-stone-800 hover:border-amber-500/40 transition"
                >
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Section 3: Traditional Preparation Method & Stages */}
          <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-amber-400">
              <Flame className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Traditional Preparation Method
              </h2>
            </div>
            <p className="mt-2 text-sm text-stone-400">
              Ancient culinary techniques: slow-cooking, pit-baking, stone grinding, and dum pukht.
            </p>

            <div className="mt-6 space-y-4">
              {dossier.traditionalPreparationMethod.map((stage, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 transition hover:border-amber-500/40"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-bold text-amber-300 border border-amber-500/40 text-sm">
                      {idx + 1}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">{stage.stage}</h3>
                      <p className="text-sm leading-relaxed text-stone-300">{stage.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Nutritional & Ayurvedic Wisdom */}
          <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-emerald-400">
              <HeartPulse className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Nutritional & Ayurvedic Wisdom
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-stone-200">
              {dossier.nutritionalAndAyurvedicWisdom}
            </p>
          </section>

          {/* Section 5: Cultural Serving Tradition & Etiquette */}
          <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-amber-950/20 p-6 md:p-8 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-amber-400">
              <Utensils className="size-5" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Cultural Serving Tradition & Etiquette
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-stone-200">
              {dossier.culturalServingTradition}
            </p>
          </section>
        </div>

        {/* Right Column: Cultural Metadata Sidebar & Related Traditions */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Classification Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="size-4" />
              <span>Culinary Dossier Record</span>
            </div>

            <dl className="mt-5 space-y-4 text-sm divide-y divide-stone-800/80">
              <div className="pt-3 first:pt-0 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Domain</dt>
                <dd className="text-right text-stone-100 font-semibold">Indigenous Gastronomy</dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Classification</dt>
                <dd className="text-right text-amber-300 font-semibold">{dossier.heritageClassification}</dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Origin State</dt>
                <dd className="text-right text-stone-100 font-semibold">
                  {dossier.state} ({dossier.region} India)
                </dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Key Ingredients</dt>
                <dd className="text-right text-stone-200">{dossier.keyIngredients.length} Heritage Items</dd>
              </div>
              <div className="pt-3 flex justify-between gap-4">
                <dt className="text-stone-400 font-medium">Preparation Stages</dt>
                <dd className="text-right text-amber-300 font-semibold">{dossier.traditionalPreparationMethod.length} Codified Steps</dd>
              </div>
            </dl>
          </div>

          {/* Related Culinary Traditions */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center justify-between">
              <span>Related Culinary Feasts</span>
              <Sparkles className="size-4 text-amber-400" />
            </h3>
            <p className="mt-1 text-xs text-stone-400">
              Explore authentic regional cuisines across India
            </p>

            <div className="mt-4 space-y-3">
              {otherDishes.map((item) => (
                <Link
                  key={item.id}
                  to="/culinary/$slug"
                  params={{ slug: item.slug }}
                  className="group flex items-center gap-3.5 rounded-xl border border-stone-800/80 bg-stone-950/60 p-2.5 transition hover:border-amber-500/50 hover:bg-stone-900/80"
                >
                  <img
                    src={item.heroImage}
                    alt={item.dishName}
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
                      {item.dishName}
                    </p>
                    <p className="text-[11px] text-stone-400">{item.state} &bull; {item.region} India</p>
                    <p className="text-[10px] text-amber-400/90 font-serif">{item.nativeName}</p>
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
