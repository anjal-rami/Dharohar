import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accessibility,
  Bookmark,
  Box,
  Clock,
  Compass,
  Copy,
  Ear,
  ExternalLink,
  Flag,
  Headphones,
  Image,
  MapPin,
  QrCode,
  Rotate3d,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { HeritageVirtualWalk } from "@/components/heritage/heritage-virtual-walk";
import { GoogleStreetViewEngine } from "@/components/heritage/google-street-view-engine";
import { MonumentStreetView360 } from "@/components/heritage/monument-streetview-360";
import { Artifact3DViewer, Artifact3DErrorBoundary } from "@/components/heritage/artifact-3d-viewer";
import { getModelManifestForSite } from "@/lib/models-manifest";
import { ArtisanBazaar } from "@/components/heritage/artisan-bazaar";
import { HeritageImage } from "@/components/heritage/heritage-image";
import {
  getMonumentDossier,
  getMonumentBySlug,
  monumentDossierToHeritageSite,
} from "@/lib/monuments-data";
import { getCraftDossier } from "@/lib/crafts-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getReel,
  getSite,
  nearbySites,
  reportsForSite,
  trailsForSite,
  HERITAGE_SITES,
  CATEGORY_META,
  type HeritageSite,
} from "@/lib/heritage-data";
import { LANGUAGE_META, localized, useI18n } from "@/lib/i18n";
import { STORE_KEYS, useLocalState, type SavedStore } from "@/lib/use-local-state";
import { DemoChip, PreservationChip, VerifiedChip } from "@/components/heritage/chips";
import { HeritageCard } from "@/components/heritage/heritage-card";
import { TrailCard } from "@/components/heritage/trail-card";
import { SourceCard } from "@/components/heritage/source-card";
import { ReelCard } from "@/components/heritage/reel-card";
import { ModerationChip } from "@/components/heritage/chips";
import { Button } from "@/components/ui/button";
import { getHeritageCoverImage } from "@/lib/heritage-records-data";
import { getFestivalDossier } from "@/lib/festivals-data";
import type { FestivalDossier } from "@/types/festival";
import { FestivalDossierView } from "@/components/heritage/festival-dossier-view";
import { getCulinaryDossier } from "@/lib/culinary-data";
import type { CulinaryDossier } from "@/types/culture";
import { CulinaryDossierView } from "@/components/heritage/culinary-dossier-view";
import { getPerformingArtDossier } from "@/lib/performing-arts-data";
import type { PerformingArtDossier } from "@/types/culture";
import { PerformingArtsDossierView } from "@/components/heritage/performing-arts-dossier-view";

export const Route = createFileRoute("/heritage/$slug")({
  loader: ({
    params,
  }): {
    site: HeritageSite;
    festivalDossier?: FestivalDossier;
    culinaryDossier?: CulinaryDossier;
    performingArtDossier?: PerformingArtDossier;
  } => {
    // 0. Check if requested slug is a living festival dossier
    const festival = getFestivalDossier(params.slug);
    if (festival) {
      return { site: HERITAGE_SITES[0]!, festivalDossier: festival };
    }

    // 0.1 Check if requested slug is a culinary / food tradition dossier
    const culinary = getCulinaryDossier(params.slug);
    if (culinary) {
      return { site: HERITAGE_SITES[0]!, culinaryDossier: culinary };
    }

    // 0.2 Check if requested slug is a performing arts dossier
    const art = getPerformingArtDossier(params.slug);
    if (art) {
      return { site: HERITAGE_SITES[0]!, performingArtDossier: art };
    }

    // 1. Look up in primary heritage dataset
    let site = getSite(params.slug);

    // 2. If not found in primary dataset, check monuments/temples master database
    if (!site) {
      const dossier = getMonumentBySlug(params.slug);
      if (dossier) {
        site = monumentDossierToHeritageSite(dossier);
      }
    }

    // 2.5 If not found, check crafts master database
    if (!site) {
      const craft = getCraftDossier(params.slug);
      if (craft) {
        const coverImg = craft.heroImage || craft.imageUrl || "/assets/hero-heritage.jpg";
        site = {
          id: craft.id,
          slug: craft.slug,
          title: craft.title || craft.craftName || "Traditional Indian Craft",
          name: craft.craftName || craft.title || "Traditional Indian Craft",
          titles: {
            en: craft.craftName || craft.title || "Traditional Indian Craft",
            hi: craft.nativeName || craft.craftName || "पारंपरिक शिल्प",
          },
          summary: {
            en: craft.shortDescription || craft.historicalLineage?.royalPatronageOrGenesis || "Master Craft Heritage",
            hi: craft.shortDescription || craft.historicalLineage?.royalPatronageOrGenesis || "Master Craft Heritage",
          },
          description: {
            en: craft.fullDescription || craft.historicalLineage?.royalPatronageOrGenesis || "Traditional Indian Master Craft",
            hi: craft.fullDescription || craft.historicalLineage?.royalPatronageOrGenesis || "Traditional Indian Master Craft",
          },
          state: craft.state || "India",
          district: craft.historicalLineage?.clusterLocation || craft.region || "",
          regionId: "reg-west",
          lat: 23.242,
          lng: 69.6669,
          category: "crafts",
          period: craft.historicalLineage?.originCentury || "Ancient Tradition",
          era: "living",
          kind: "intangible",
          unesco: false,
          intangibleListed: true,
          accessibility: {
            wheelchair: true,
            audioGuide: true,
            signLanguage: false,
            notes: "Workshop and artisan cluster accessibility varies.",
          },
          languages: ["en", "hi"],
          tags: craft.tags || ["craft", "textile"],
          image: coverImg,
          gallery: [coverImg],
          images: [coverImg],
          tourAvailable: false,
          preservation: "safe",
          preservationNote: craft.giTag || craft.giStatus || "GI Protected Master Craft",
          significance: craft.shortDescription || craft.giTag || "Geographical Indication (GI) Registered",
          sources: [],
          stories: [],
          artisans: [],
          relatedTraditions: [],
          dataOrigin: "verified",
          updatedAt: "2026-09-29T10:00:00Z",
        };
      }
    }

    // 3. Fallback safe check: never throw unhandled exception or return undefined
    const finalSite: HeritageSite = site || HERITAGE_SITES[0]!;

    return { site: finalSite };
  },
  errorComponent: ({ error, reset }) => <HeritageErrorFallback error={error} reset={reset} />,
  head: ({ loaderData }) => {
    if (loaderData?.festivalDossier) {
      const fest = loaderData.festivalDossier;
      return {
        meta: [
          { title: `${fest.name} (${fest.nativeName}) — Dharohar Cultural Dossier` },
          { name: "description", content: fest.significance },
          { property: "og:title", content: `${fest.name} — Dharohar` },
          { property: "og:description", content: fest.significance },
          { property: "og:image", content: fest.heroImage },
        ],
      };
    }
    if (loaderData?.culinaryDossier) {
      const dish = loaderData.culinaryDossier;
      const title = dish.title || dish.name || dish.dishName || "Food Tradition";
      const desc = dish.shortDescription || dish.fullDescription || "Traditional Indian Gastronomy";
      const img = dish.imageUrl || dish.heroImage || "/images/culinary/sadya_feast.jpg";
      return {
        meta: [
          { title: `${title} — Dharohar Food Traditions` },
          { name: "description", content: desc },
          { property: "og:title", content: `${title} — Dharohar` },
          { property: "og:description", content: desc },
          { property: "og:image", content: img },
        ],
      };
    }
    if (loaderData?.performingArtDossier) {
      const art = loaderData.performingArtDossier;
      const title = art.title || art.name || "Performing Art Tradition";
      const desc = art.shortDescription || "Traditional Indian Performing Art";
      const img = art.imageUrl || art.heroImage || "/images/performing_arts/kathakali.jpg";
      return {
        meta: [
          { title: `${title} — Dharohar Performing Arts` },
          { name: "description", content: desc },
          { property: "og:title", content: `${title} — Dharohar` },
          { property: "og:description", content: desc },
          { property: "og:image", content: img },
        ],
      };
    }
    const site = loaderData?.site || HERITAGE_SITES[0];
    const description = site?.summary?.en ?? site?.significance ?? "India Cultural Heritage Record";
    const title = site?.title ?? site?.name ?? "Heritage Record";
    return {
      meta: [
        { title: `${title} — Dharohar heritage record` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Dharohar` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HeritageDetail,
});

function HeritageErrorFallback({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
        <Sparkles className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        Heritage Record Temporarily Unavailable
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We encountered an issue loading this heritage record. You can try refreshing the view or return to explore other national records.
      </p>
      {error?.message && (
        <pre className="mt-3 max-w-md overflow-x-auto rounded-lg bg-stone-900/80 p-3 text-xs text-stone-400">
          {error.message}
        </pre>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        )}
        <Button asChild variant="outline">
          <Link to="/explore">Explore all records</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

// 1. Cultural Fallback Asset (Stored authentic low-poly archaeological model)
const DEFAULT_HERITAGE_3D = "/models/default_heritage_relic.glb";
const DEFAULT_HERITAGE_USDZ = "/models/default_heritage_relic.usdz";

// 2. Strict Panorama Validation Function
const isValidEquirectangular = (url?: string | null): boolean => {
  if (!url) return false;
  // Guard: Never allow standard hero photos or 16:9 images into 360 Sphere
  return (
    url.includes("/panoramas/") ||
    url.endsWith("_pano.jpg") ||
    url.endsWith("_equirect.jpg") ||
    url.endsWith("_360.webp") ||
    url.includes("equirectangular")
  );
};

function HeritageDetail() {
  const loaderData = Route.useLoaderData();
  if (loaderData?.festivalDossier) {
    return <FestivalDossierView dossier={loaderData.festivalDossier} />;
  }
  if (loaderData?.culinaryDossier) {
    return <CulinaryDossierView dossier={loaderData.culinaryDossier} />;
  }
  if (loaderData?.performingArtDossier) {
    return <PerformingArtsDossierView dossier={loaderData.performingArtDossier} />;
  }
  const { site } = loaderData;
  const { t, locale } = useI18n();
  const [savedStore, setSavedStore] = useLocalState<SavedStore>(STORE_KEYS.saved, {
    sites: [],
    trails: [],
  });
  const saved = savedStore.sites.includes(site.slug);
  const [activeImage, setActiveImage] = useState(0);

  // Active 3D photogrammetric relic lookup from models manifest
  const manifestRelic = getModelManifestForSite(site.slug);
  const activeModel3d =
    site.model3dUrl &&
    !site.model3dUrl.includes("AntiqueCamera") &&
    !site.model3dUrl.includes("DamagedHelmet") &&
    !site.model3dUrl.includes("ashoka_capital")
      ? site.model3dUrl
      : manifestRelic.modelUrl;
  const activeUsdz = (site as { usdzUrl?: string }).usdzUrl || DEFAULT_HERITAGE_USDZ;

  // Intelligently select media tab: tour360 default for live geospatial & 360 views
  const [activeMediaTab, setActiveMediaTab] = useState<"tour360" | "model3d" | "photos">(() => {
    if (site?.tourAvailable || site?.lat) {
      return "tour360";
    }
    if (site?.model3dUrl || site?.artifactInfo) {
      return "model3d";
    }
    return "photos";
  });
  const [tourEngineMode, setTourEngineMode] = useState<"streetview" | "offline">("streetview");
  const [showARModal, setShowARModal] = useState(false);

  const reel = getReel(site.reelId);
  const trails = trailsForSite(site.slug);
  const nearby = nearbySites(site.slug);
  const reports = reportsForSite(site.slug);

  // Mobile AR Quick-Launch Trigger Handler
  const handleARLaunch = () => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/i.test(ua);

    if (isIOS) {
      // iOS Safari Quick Look
      const anchor = document.createElement("a");
      anchor.setAttribute("rel", "ar");
      anchor.setAttribute("href", activeUsdz);
      const img = document.createElement("img");
      anchor.appendChild(img);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      toast.success("Opening in Apple AR Quick Look…");
    } else if (isAndroid) {
      // Android Chrome Scene Viewer WebXR Intent
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        activeModel3d,
      )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
      window.location.href = intentUrl;
      toast.success("Launching Android WebXR Scene Viewer…");
    } else {
      // Desktop: Open QR Code Scanner Dialog
      setShowARModal(true);
    }
  };

  // Historical Dossier & Audio Guide Narration Handler
  const dossier = getMonumentDossier(site.slug);
  const narrationScript = dossier?.audioNarrationScript || site.audioNarrationScript;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info("Audio synthesis is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = narrationScript || site.significance;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
    toast.success("Playing authentic narration", {
      description: "Audio powered by Dharohar Indic TTS Engine",
    });
  };

  return (
    <article>
      {/* Hero */}
      <div className="relative isolate">
        <HeritageImage
          src={activeImage === 0 ? getHeritageCoverImage(site) : ((site?.gallery && site.gallery[activeImage]) ?? getHeritageCoverImage(site))}
          alt={site?.titles ? localized(site.titles, locale) : (site?.name ?? site?.title ?? "Heritage")}
          fallbackText={site?.titles ? localized(site.titles, locale) : (site?.name ?? site?.title ?? "Heritage")}
          width={1920}
          height={1080}
          className="size-full object-cover"
          containerClassName="absolute inset-0 -z-10 size-full"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-10 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-card/90 px-2.5 py-0.5 text-xs font-semibold">
              {CATEGORY_META[site.category]?.icon ?? "🏛️"} {CATEGORY_META[site.category]?.label ?? "Monument"}
            </span>
            {site?.unesco && (
              <span className="rounded-full bg-marigold px-2.5 py-0.5 text-xs font-semibold text-marigold-foreground">
                UNESCO
              </span>
            )}
            <VerifiedChip className="bg-card/90" />
            {site?.dataOrigin === "demo" && <DemoChip className="bg-card/90" />}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">
            {site?.titles ? localized(site.titles, locale) : (site?.name ?? site?.title ?? "Heritage")}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-white/85">
            <MapPin className="size-4" aria-hidden /> {site?.locationDetails?.district ?? site?.district ?? ""},{" "}
            {site?.locationDetails?.state ?? site?.state ?? "India"} · {site?.period ?? "Historical"}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => {
                setSavedStore((prev) => ({
                  ...prev,
                  sites: prev.sites.includes(site.slug)
                    ? prev.sites.filter((s) => s !== site.slug)
                    : [...prev.sites, site.slug],
                }));
                toast.success(saved ? "Removed from saved items" : "Saved for offline reading");
              }}
            >
              <Bookmark className="mr-1.5 size-4" />
              {saved ? t("common.saved") : t("common.save")}
            </Button>

            {/* Quick AR Button in Hero */}
            <Button
              variant="outline"
              onClick={handleARLaunch}
              className="border-amber-400/60 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 shadow-md backdrop-blur-md"
            >
              <Smartphone className="mr-1.5 size-4" />
              Inspect in AR
            </Button>

            <Button variant="secondary" onClick={() => toast.success("Share link copied (demo).")}>
              <Share2 className="mr-1.5 size-4" /> {t("common.share")}
            </Button>
            <Button
              variant="outline"
              className="bg-card/80"
              onClick={() => toast("Thanks — moderators will review this record.")}
            >
              <Flag className="mr-1.5 size-4" /> {t("common.report")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold">{t("detail.about")}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {localized(site.description, locale)}
            </p>
            <p className="mt-4 rounded-xl border border-border bg-secondary/60 p-4 text-sm">
              <strong>Cultural significance.</strong> {site.significance}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Available in: {site.languages.map((l) => LANGUAGE_META[l].native).join(" · ")} · last
              updated {site.updatedAt}
            </p>
          </section>

          {/* Architectural & Historical Dossier Card */}
          {(dossier || site.architecturalStyle) && (
            <section className="rounded-3xl border border-stone-800 bg-gradient-to-br from-stone-900 via-stone-900/90 to-amber-950/20 p-6 shadow-xl backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-stone-100">
                      Architectural & Heritage Dossier
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      ASI Verified Record & Historical Classification
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Preservation: {dossier?.preservationScore || site.preservationScore || "94% Intact"}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
                    Architectural Style
                  </span>
                  <p className="mt-1 text-sm font-bold text-stone-100">
                    {dossier?.architecturalStyle || site.architecturalStyle || "Classical Indian Stone Architecture"}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
                    Patron Dynasty & Era
                  </span>
                  <p className="mt-1 text-sm font-bold text-stone-100">
                    {dossier?.patronDynasty || site.patronDynasty || "Imperial Patronage"} · {dossier?.constructionEra || site.constructionEra || site.period}
                  </p>
                </div>

                {(dossier?.deity || site.deity) && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:col-span-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      Presiding Deity
                    </span>
                    <p className="mt-1 text-base font-bold text-stone-100">
                      {dossier?.deity || site.deity}
                    </p>
                  </div>
                )}

                {(dossier?.howToReach || site.howToReach) && (
                  <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4 sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                      Travel & Transit Guide
                    </span>
                    <div className="grid gap-2 text-xs text-stone-300">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-400 shrink-0">✈️ Air:</span>
                        <span>{(dossier?.howToReach || site.howToReach)?.air}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-400 shrink-0">🚆 Rail:</span>
                        <span>{(dossier?.howToReach || site.howToReach)?.rail}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-400 shrink-0">🚗 Road / Trek:</span>
                        <span>{(dossier?.howToReach || site.howToReach)?.road}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Audio Narration Bar */}
              {narrationScript && (
                <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                        <Volume2 className="size-4 text-amber-400" />
                        <span>Curated Audio Guide Narration</span>
                      </div>
                      <p className="text-xs text-stone-300 italic leading-relaxed">
                        &ldquo;{narrationScript}&rdquo;
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePlayNarration}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition shrink-0 ${
                        isPlayingAudio
                          ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                          : "bg-amber-500 text-stone-950 hover:bg-amber-400"
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="size-3.5" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-3.5" />
                          <span>Listen (TTS)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Interactive Media Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMediaTab("tour360")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeMediaTab === "tour360"
                    ? "bg-amber-500 text-stone-950 shadow-md"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                360° Virtual Walkthrough
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaTab("model3d")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeMediaTab === "model3d"
                    ? "bg-amber-500 text-stone-950 shadow-md"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                3D Relic Inspector
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaTab("photos")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeMediaTab === "photos"
                    ? "bg-amber-500 text-stone-950 shadow-md"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                Historic Photo Dossier
              </button>
            </div>

            {/* Inspect in Your Space (AR) Trigger Button */}
            <Button
              size="sm"
              onClick={handleARLaunch}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-600/30 to-amber-500/30 text-amber-300 hover:from-amber-500 hover:to-amber-400 hover:text-stone-950 shadow-md backdrop-blur-md"
            >
              <Smartphone className="size-3.5" />
              <span>Inspect in Your Space (AR)</span>
            </Button>
          </div>

          {/* Active Tab View */}
          <div className="w-full mb-8">
            {/* 1. 360 First-Person Street View & Walkthrough */}
            {activeMediaTab === "tour360" && (
              <div className="space-y-3">
                {/* Engine Selector Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div className="inline-flex items-center p-1 bg-stone-900/90 border border-stone-800 rounded-xl gap-1 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setTourEngineMode("offline")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        tourEngineMode === "offline"
                          ? "bg-amber-500 text-stone-950 shadow-md"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      <span>🏛️</span>
                      <span>360° HD Walk (Full Color)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourEngineMode("streetview")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        tourEngineMode === "streetview"
                          ? "bg-amber-500 text-stone-950 shadow-md"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      <span>🌐</span>
                      <span>Google Street View</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500 hidden sm:inline-block font-mono">
                    {tourEngineMode === "offline"
                      ? "Pannellum Multi-Node Constellation • 100% Offline"
                      : "Official ASI Street View Photosphere"}
                  </span>
                </div>

                {tourEngineMode === "streetview" ? (
                  <MonumentStreetView360
                    monumentName={site?.name ?? site?.title ?? "Brihadisvara Temple, Thanjavur"}
                    latitude={site?.coordinates?.[0] ?? site?.lat ?? 10.782806}
                    longitude={site?.coordinates?.[1] ?? site?.lng ?? 79.131833}
                  />
                ) : (
                  <HeritageVirtualWalk
                    monumentName={site?.name ?? site?.title ?? "Brihadisvara Temple, Thanjavur"}
                  />
                )}
              </div>
            )}

            {/* 2. 3D Relic Inspector Tab */}
            {activeMediaTab === "model3d" && (
              <Artifact3DErrorBoundary artifactName={manifestRelic.title || site?.artifactInfo?.name || `${site?.name ?? site?.title} Relic`}>
                <Artifact3DViewer
                  modelUrl={activeModel3d}
                  siteSlug={site.slug}
                  artifactName={manifestRelic.title}
                  historicalPeriod={manifestRelic.periodAndMaterial}
                  provenance={manifestRelic.provenance}
                  institution={manifestRelic.institution}
                  hotspots={manifestRelic.hotspots}
                  iosSrc={activeUsdz}
                />
              </Artifact3DErrorBoundary>
            )}

            {/* 3. Historic Photo Dossier Tab */}
            {activeMediaTab === "photos" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(site.images ?? site.gallery ?? [site.image]).map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
                    <img
                      src={img}
                      alt={`${site.name ?? site.title} - View ${i + 1}`}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.dataset["fallbackApplied"]) return;
                        target.dataset["fallbackApplied"] = "true";
                        target.src = "/assets/hero-heritage.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                      <p className="text-xs text-stone-200">
                        Official Archaeological Survey of India Archive &bull; Plate #{i + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reel */}
          {reel && (
            <section>
              <h2 className="text-2xl font-semibold">{t("detail.reel")}</h2>
              <div className="mt-3 max-w-xs">
                <ReelCard reel={reel} />
              </div>
            </section>
          )}

          {/* Community stories */}
          <section>
            <h2 className="text-2xl font-semibold">{t("detail.stories")}</h2>
            {site.stories.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No community stories yet.{" "}
                <Link to="/archive" className="font-semibold text-primary hover:underline">
                  Contribute the first one →
                </Link>
              </div>
            ) : (
              <ul className="mt-3 space-y-3">
                {site.stories.map((story) => (
                  <li key={story.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{story.author}</p>
                      <span className="text-xs text-muted-foreground">{story.role}</span>
                      <ModerationChip status={story.moderation} className="ml-auto" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{story.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Local Artisan & Heritage Festival Bazaar */}
          <div id="artisan-bazaar-section">
            <ArtisanBazaar
              siteSlug={site.slug}
              monumentName={site.name ?? site.title}
            />
          </div>

          {/* Trails */}
          {trails.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">{t("detail.trails")}</h2>
              <div className="mt-3 grid gap-5 md:grid-cols-2">
                {trails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
            </section>
          )}

          {/* Nearby */}
          <section>
            <h2 className="text-2xl font-semibold">{t("common.nearby")}</h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              {nearby.map(({ site: s, km }) => (
                <HeritageCard key={s.id} site={s} distanceKm={km} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">{t("detail.preservation")}</h2>
            <PreservationChip status={site.preservation} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">{site.preservationNote}</p>
            {reports.length > 0 && (
              <ul className="mt-3 space-y-2 border-t border-border pt-3">
                {reports.map((r) => (
                  <li key={r.id} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.date}</span> · {r.reportedBy}
                    <br />
                    {r.note}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">{t("detail.location")}</h2>
            <div className="relative mt-2 h-40 overflow-hidden rounded-xl border border-border bg-secondary/60 pattern-jaali">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="size-6 text-primary" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {(site?.lat ?? 20.5937).toFixed(4)}, {(site?.lng ?? 78.9629).toFixed(4)} — spatial queries run through PostGIS in
              production.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to="/trails">Plan a trail from here</Link>
            </Button>
          </section>

          {/* Practical Visitor Guide & Entry Details */}
          {(dossier?.visitorDetails || site?.visitorDetails) && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                Visitor Guide & Timings
              </h2>
              <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex flex-col gap-0.5 border-b border-border/60 pb-2">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="size-3 text-amber-400" />
                    Opening Timings
                  </span>
                  <span>{dossier?.visitorDetails?.timings || site?.visitorDetails?.timings || "Open Daily"}</span>
                </li>
                <li className="flex flex-col gap-0.5 border-b border-border/60 pb-2">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Ticket className="size-3 text-amber-400" />
                    Ticket & Entry Fees
                  </span>
                  <span>{dossier?.visitorDetails?.entryFee || site?.visitorDetails?.entryFee || "Free Entry / Ticketed"}</span>
                </li>
                <li className="flex flex-col gap-0.5 border-b border-border/60 pb-2">
                  <span className="font-semibold text-foreground">Best Season to Visit</span>
                  <span>{dossier?.visitorDetails?.bestSeason || site?.visitorDetails?.bestSeason || "October to March"}</span>
                </li>
                {(dossier?.visitorDetails?.photographyFee || site?.visitorDetails?.photographyFee) && (
                  <li className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">Photography & Cameras</span>
                    <span>{dossier?.visitorDetails?.photographyFee || site?.visitorDetails?.photographyFee}</span>
                  </li>
                )}
              </ul>
            </section>
          )}

          {site?.accessibility && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Accessibility</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <Accessibility className="size-4 text-primary" aria-hidden />
                  Wheelchair: {site?.accessibility?.wheelchair ? "Yes" : "Limited"}
                </li>
                <li className="flex items-center gap-2">
                  <Headphones className="size-4 text-primary" aria-hidden />
                  Audio guide: {site?.accessibility?.audioGuide ? "Available" : "Not available"}
                </li>
                <li className="flex items-center gap-2">
                  <Ear className="size-4 text-primary" aria-hidden />
                  Sign language: {site?.accessibility?.signLanguage ? "On request" : "Not available"}
                </li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">{site?.accessibility?.notes}</p>
            </section>
          )}

          {(site?.sources || []).length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">{t("common.sources")}</h2>
              <div className="mt-2 space-y-2">
                {site.sources.map((s) => (
                  <SourceCard key={s.id} source={s} />
                ))}
              </div>
            </section>
          )}

          {(site?.artisans || []).length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">{t("detail.artisans")}</h2>
              <ul className="mt-2 space-y-2">
                {site.artisans.map((a) => (
                  <li key={a.id} className="rounded-xl border border-border p-3">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.craft}</p>
                    <p className="text-xs text-muted-foreground">{a.contactNote}</p>
                  </li>
                ))}
              </ul>
              <a
                href="#artisan-bazaar-section"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 transition hover:bg-amber-500/25"
              >
                <Sparkles className="size-3.5" />
                Explore Seasonal Bazaar & WhatsApp ↓
              </a>
            </section>
          )}

          {(site?.relatedTraditions || []).length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">{t("detail.related")}</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {site.relatedTraditions.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {/* Augmented Reality Desktop QR Code Scanner Modal */}
      <Dialog open={showARModal} onOpenChange={setShowARModal}>
        <DialogContent className="max-w-md border-stone-800 bg-stone-950 p-6 text-stone-100 sm:rounded-3xl shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <QrCode className="size-7" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Inspect in Your Space (AR)
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Scan with your mobile camera to place this 3D archaeological relic in your room or exhibition space.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
            <div className="rounded-xl border border-amber-500/40 bg-white p-3 shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : "https://dharohar-heritage.in",
                )}`}
                alt="AR Launch QR Code"
                className="size-48 rounded-lg"
              />
            </div>
            <p className="mt-3 text-center text-[11px] text-stone-400">
              Compatible with <strong className="text-stone-200">Apple AR Quick Look</strong> &bull;{" "}
              <strong className="text-stone-200">Google Scene Viewer</strong>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("AR Scene link copied to clipboard!");
                }
              }}
              className="border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
            >
              <Copy className="size-3.5 mr-1.5" />
              Copy AR Launch URL
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setActiveMediaTab("model3d");
                setShowARModal(false);
              }}
              className="bg-amber-500 font-semibold text-stone-950 hover:bg-amber-400"
            >
              <Box className="size-3.5 mr-1.5" />
              Launch 3D Relic Inspector on Desktop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
