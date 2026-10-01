import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Upload } from "lucide-react";
import heroImage from "@/assets/hero-heritage.jpg";
import {
  CATEGORY_META,
  CULTURAL_REGIONS,
  HERITAGE_SITES,
  REELS,
  TRAILS,
  type HeritageCategory,
} from "@/lib/heritage-data";
import { useI18n } from "@/lib/i18n";
import { GlobalSearch } from "@/components/heritage/global-search";
import { IndiaHeritageMap } from "@/components/heritage/india-map";
import { HeritageCard } from "@/components/heritage/heritage-card";
import { ReelCard } from "@/components/heritage/reel-card";
import { TrailCard } from "@/components/heritage/trail-card";
import { CulturalRegionCard } from "@/components/heritage/region-card";
import { FeaturedCategoriesShowcase } from "@/components/heritage/featured-categories-showcase";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dharohar — Discover India's Cultural Heritage" },
      {
        name: "description",
        content:
          "Explore verified heritage records, GIS trails, cultural reels and a multilingual AI assistant across every Indian state.",
      },
      { property: "og:title", content: "Dharohar — Discover India's Cultural Heritage" },
      {
        property: "og:description",
        content:
          "Multilingual discovery of monuments, crafts, festivals, music, food and oral history — community-driven and source-verified.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FEATURED_CATEGORIES: HeritageCategory[] = [
  "monuments",
  "crafts",
  "festivals",
  "performing-arts",
  "manuscripts",
  "food",
];

function Home() {
  const { t } = useI18n();
  const featured = HERITAGE_SITES.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Golden-hour view of a carved South Indian temple gopuram"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/80 via-black/55 to-black/25" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-marigold">
              {t("home.heroKicker")}
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-semibold md:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">{t("home.heroBody")}</p>

            <div className="mt-8 max-w-xl">
              <GlobalSearch size="lg" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/explore">
                  {t("home.ctaExplore")} <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/assistant">
                  <Sparkles className="mr-1.5 size-4" /> {t("home.ctaAsk")}
                </Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-white">
              {[
                { label: "Heritage records", value: HERITAGE_SITES.length },
                { label: "Trails mapped", value: TRAILS.length },
                { label: "Languages live", value: 4 },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-white/70">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Categories Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl text-white">{t("home.categories")}</h2>
            <p className="mt-1 text-sm text-stone-300">
              Explore living traditions, performing arts, sacred banquets, and master crafts spanning all regions of India.
            </p>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition hover:underline">
            {t("common.viewAll")} →
          </Link>
        </div>

        <FeaturedCategoriesShowcase />
      </section>

      {/* Map */}
      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("home.map")}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Markers are coloured by preservation status. Every marker is also available as a
            keyboard-navigable list.
          </p>
          <div className="mt-6">
            <IndiaHeritageMap />
          </div>
        </div>
      </section>

      {/* Featured records */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold md:text-3xl">Featured heritage records</h2>
          <Link to="/explore" className="text-sm font-semibold text-primary hover:underline">
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((site) => (
            <HeritageCard key={site.id} site={site} />
          ))}
        </div>
      </section>

      {/* Regions */}
      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">{t("home.regions")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Distinct cultural geographics spanning temple towns, stepwells, terracotta floodplains, and Himalayan passes.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURAL_REGIONS.map((region) => (
              <CulturalRegionCard key={region.id} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* Reels */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("home.reels")}</h2>
          <Link to="/reels" className="text-sm font-semibold text-primary hover:underline">
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REELS.slice(0, 4).map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </section>

      {/* Trails */}
      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold md:text-3xl">{t("home.trails")}</h2>
            <Link to="/trails" className="text-sm font-semibold text-primary hover:underline">
              {t("common.viewAll")} →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TRAILS.slice(0, 3).map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border surface-heritage p-8 md:p-12">
          <div className="pattern-kolam absolute inset-0 opacity-[0.12]" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">{t("home.ctaBannerTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.ctaBannerBody")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/archive">
                  <Upload className="mr-1.5 size-4" /> {t("nav.archive")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/preservation">{t("nav.preservation")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
