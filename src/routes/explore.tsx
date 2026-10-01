import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  Filter,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import {
  CATEGORY_META,
  CULTURAL_REGIONS,
  ERAS,
  HERITAGE_SITES,
  STATES,
  type HeritageCategory,
} from "@/lib/heritage-data";
import { FESTIVAL_HERITAGE_SITES } from "@/lib/festivals-data";
import { CULINARY_HERITAGE_SITES } from "@/lib/culinary-data";
import { PERFORMING_ARTS_HERITAGE_SITES } from "@/lib/performing-arts-data";
import { INGESTED_HERITAGE_SITES } from "@/lib/heritage-records-data";
import { LANGUAGE_META, LOCALES, localized, useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { GlobalSearch } from "@/components/heritage/global-search";
import { HeritageCard } from "@/components/heritage/heritage-card";
import { IndiaHeritageMap } from "@/components/heritage/india-map";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";

import { CATEGORY_OPTIONS } from "@/lib/categories-data";

const SIDEBAR_CATEGORIES: HeritageCategory[] = [
  "monuments",
  "crafts",
  "festivals",
  "performing-arts",
  "food",
  "music",
  "manuscripts",
  "oral-history",
  "temple",
];

type ExploreSearch = {
  q?: string;
  category?: string;
  region?: string;
};

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => {
    const rawQ = search["q"];
    const rawCategory = search["category"];
    const rawRegion = search["region"];
    const parsed: ExploreSearch = {};
    if (typeof rawQ === "string" && rawQ) parsed.q = rawQ;
    if (typeof rawCategory === "string" && rawCategory) {
      parsed.category = rawCategory;
    }
    if (typeof rawRegion === "string" && rawRegion) {
      parsed.region = rawRegion;
    }
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Explore India's heritage records — Dharohar" },
      {
        name: "description",
        content:
          "Filter thousands of heritage records by state, district, category, era, language, UNESCO status and accessibility.",
      },
      { property: "og:title", content: "Explore India's heritage records — Dharohar" },
      {
        property: "og:description",
        content:
          "Advanced multilingual search across monuments, crafts, festivals and living traditions.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { t, locale } = useI18n();
  const search = Route.useSearch();
  const [query, setQuery] = useState(search.q ?? "");
  const debouncedQuery = useDebounce(query, 180);
  const [states, setStates] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>(
    search.region ? [search.region] : [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const raw = search.category;
    if (!raw) return "all";
    if (
      raw === "food" ||
      raw === "food-traditions" ||
      raw === "Food Traditions" ||
      raw === "culinary" ||
      raw === "Culinary Traditions"
    ) {
      return "food-traditions";
    }
    return raw;
  });
  const [categories, setCategories] = useState<HeritageCategory[]>([]);
  const [eras, setEras] = useState<string[]>([]);
  const [languages, setLanguages] = useState<Locale[]>([]);
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [intangibleOnly, setIntangibleOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<"relevance" | "recent" | "az">("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Unify heritage sites, festivals, culinary traditions, performing arts, and verified ingested records into a single deduplicated dataset
  const allRecords = useMemo(() => {
    const map = new Map<string, (typeof HERITAGE_SITES)[number]>();

    for (const item of HERITAGE_SITES) {
      if (
        item.slug === "palm-leaf-manuscripts-odisha" ||
        item.slug === "kailasa-temple-ellora" ||
        item.slug === "ramanathaswamy-temple-rameswaram" ||
        item.slug === "chandratal-hill-temples" ||
        item.slug === "sattriya-majuli" ||
        item.slug === "pandavani-oral-epic" ||
        item.slug === "kedarnath-temple" ||
        item.slug === "kashi-vishwanath-temple" ||
        item.slug === "meenakshi-sundareswarar-temple" ||
        item.slug === "somnath-temple" ||
        item.slug === "puri-jagannath-temple" ||
        item.slug === "tirupati-venkateswara-temple" ||
        item.slug === "chettinad-kitchen-traditions" ||
        item.slug === "baul-song-bengal"
      ) {
        continue;
      }
      map.set(item.slug || item.id, item);
    }

    for (const item of FESTIVAL_HERITAGE_SITES) {
      map.set(item.slug || item.id, item);
    }

    for (const item of CULINARY_HERITAGE_SITES) {
      if (item.slug === "chettinad-kitchen-traditions") continue;
      map.set(item.slug || item.id, item);
    }

    for (const item of PERFORMING_ARTS_HERITAGE_SITES) {
      if (
        item.slug === "baul-song-bengal" ||
        item.slug === "sattriya-assam" ||
        item.slug === "pandavani-chhattisgarh"
      ) {
        continue;
      }
      map.set(item.slug || item.id, item);
    }

    for (const item of INGESTED_HERITAGE_SITES) {
      map.set(item.slug || item.id, item);
    }

    return Array.from(map.values());
  }, []);

  // Compute dynamic category counts across the merged records
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const site of allRecords) {
      let cat: string = site.category;
      if (
        cat === "Food Traditions" ||
        cat === "food-traditions" ||
        cat === "Culinary Traditions" ||
        cat === "Culinary" ||
        site.type === "food"
      ) {
        cat = "food";
      } else if (
        cat === "Monuments & Sites" ||
        cat === "temple" ||
        site.type === "monuments"
      ) {
        cat = "monuments";
      } else if (
        cat === "Crafts & Textiles" ||
        cat === "Crafts & Handlooms" ||
        site.type === "crafts"
      ) {
        cat = "crafts";
      } else if (
        cat === "Performing Arts" ||
        site.type === "performing-arts"
      ) {
        cat = "performing-arts";
      }
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allRecords]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = allRecords.filter((site) => {
      // 1. Text search matching
      if (q) {
        const hay = [
          ...Object.values(site.titles),
          ...Object.values(site.summary),
          ...Object.values(site.description),
          site.state,
          site.district,
          site.region || "",
          site.category,
          site.type || "",
          ...site.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // 2. State filtering
      if (states.length && !states.includes(site.state)) return false;

      // 3. Cultural region filtering (e.g., "Deccan & South", "Western Deserts & Coast")
      if (regions.length) {
        const matchesRegion = regions.some((regId) => {
          const culturalRegion = CULTURAL_REGIONS.find(
            (r) =>
              r.id.toLowerCase() === regId.toLowerCase() ||
              r.name.toLowerCase() === regId.toLowerCase(),
          );
          if (culturalRegion) {
            return (
              culturalRegion.states.includes(site.state) ||
              site.regionId === culturalRegion.id ||
              (site.region &&
                (culturalRegion.name.toLowerCase().includes(site.region.toLowerCase()) ||
                  site.region.toLowerCase().includes(culturalRegion.name.toLowerCase())))
            );
          }
          return (
            site.regionId === regId ||
            (site.region && site.region.toLowerCase().includes(regId.toLowerCase()))
          );
        });
        if (!matchesRegion) return false;
      }

      // 4. Quick-filter Category option matching
      if (selectedCategory !== "all") {
        const siteCat = (site.category as string) || "";
        const catLower = siteCat.toLowerCase();
        const matchesCategory =
          catLower === selectedCategory.toLowerCase() ||
          (selectedCategory === "food-traditions" &&
            (siteCat === "Food Traditions" ||
              siteCat === "food-traditions" ||
              siteCat === "Culinary Traditions" ||
              siteCat === "Culinary" ||
              siteCat === "food" ||
              site.type === "food" ||
              site.tags?.some(
                (t) =>
                  t.toLowerCase().includes("food") ||
                  t.toLowerCase().includes("culinary") ||
                  t.toLowerCase().includes("feast") ||
                  t.toLowerCase().includes("banquet") ||
                  t.toLowerCase().includes("biryani") ||
                  t.toLowerCase().includes("sadya"),
              ))) ||
          (selectedCategory === "performing-arts" &&
            (siteCat === "performing-arts" ||
              siteCat === "Performing Arts" ||
              siteCat === "music" ||
              site.type === "performing-arts" ||
              site.tags?.some((t) => t.toLowerCase().includes("performing")))) ||
          (selectedCategory === "crafts" &&
            (siteCat === "crafts" ||
              siteCat === "Crafts & Textiles" ||
              siteCat === "Crafts & Handlooms" ||
              site.type === "crafts" ||
              site.tags?.some((t) => t.toLowerCase().includes("craft")))) ||
          (selectedCategory === "festivals" &&
            (siteCat === "festivals" ||
              siteCat === "Festivals & Rituals" ||
              site.type === "festival")) ||
          (selectedCategory === "monuments" &&
            (siteCat === "monuments" ||
              siteCat === "Monuments & Sites" ||
              siteCat === "temple" ||
              site.type === "monuments"));

        if (!matchesCategory) return false;
      }

      // 4.5 Sidebar checkbox multi-select category filtering
      if (categories.length) {
        const matchesSidebar = categories.some((c) => {
          const siteCat = (site.category as string) || "";
          if (c === "food") {
            return (
              siteCat === "food" ||
              siteCat === "Food Traditions" ||
              siteCat === "food-traditions" ||
              siteCat === "Culinary Traditions" ||
              siteCat === "Culinary" ||
              site.type === "food" ||
              site.tags?.some(
                (t) =>
                  t.toLowerCase().includes("food") ||
                  t.toLowerCase().includes("culinary"),
              )
            );
          }
          if (c === "performing-arts") {
            return (
              siteCat === "performing-arts" ||
              siteCat === "Performing Arts" ||
              siteCat === "music" ||
              site.type === "performing-arts"
            );
          }
          if (c === "monuments") {
            return (
              siteCat === "monuments" ||
              siteCat === "temple" ||
              siteCat === "Monuments & Sites" ||
              site.type === "monuments"
            );
          }
          if (c === "crafts") {
            return (
              siteCat === "crafts" ||
              siteCat === "Crafts & Textiles" ||
              siteCat === "Crafts & Handlooms" ||
              site.type === "crafts"
            );
          }
          return siteCat === c;
        });
        if (!matchesSidebar) return false;
      }

      // 5. Era, language, unesco, accessibility filtering
      if (eras.length && !eras.includes(site.era)) return false;
      if (languages.length && !languages.some((l) => site.languages.includes(l))) return false;
      if (unescoOnly && !site.unesco) return false;
      if (intangibleOnly && !site.intangibleListed) return false;
      if (accessibleOnly && !site.accessibility.wheelchair) return false;
      return true;
    });

    if (sort === "az")
      return [...list].sort((a, b) =>
        localized(a.titles, locale).localeCompare(localized(b.titles, locale)),
      );
    if (sort === "recent") return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return list;
  }, [
    allRecords,
    debouncedQuery,
    states,
    regions,
    selectedCategory,
    categories,
    eras,
    languages,
    unescoOnly,
    intangibleOnly,
    accessibleOnly,
    sort,
    locale,
  ]);

  const toggle = <T,>(value: T, list: T[], set: (v: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const reset = () => {
    setQuery("");
    setStates([]);
    setRegions([]);
    setSelectedCategory("all");
    setCategories([]);
    setEras([]);
    setLanguages([]);
    setUnescoOnly(false);
    setIntangibleOnly(false);
    setAccessibleOnly(false);
  };

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          {SIDEBAR_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={categories.includes(cat)}
                  onCheckedChange={() => toggle(cat, categories, setCategories)}
                />
                <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer">
                  {CATEGORY_META[cat]?.icon} {CATEGORY_META[cat]?.label}
                </Label>
              </div>
              <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {categoryCounts[cat] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-sm font-semibold">Cultural Region</h3>
        <div className="space-y-2">
          {CULTURAL_REGIONS.map((reg) => (
            <div key={reg.id} className="flex items-center gap-2">
              <Checkbox
                id={`reg-${reg.id}`}
                checked={regions.includes(reg.id)}
                onCheckedChange={() => toggle(reg.id, regions, setRegions)}
              />
              <Label htmlFor={`reg-${reg.id}`} className="text-sm font-normal cursor-pointer">
                {reg.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-sm font-semibold">State</h3>
        <div className="space-y-2">
          {STATES.map((state) => (
            <div key={state} className="flex items-center gap-2">
              <Checkbox
                id={`st-${state}`}
                checked={states.includes(state)}
                onCheckedChange={() => toggle(state, states, setStates)}
              />
              <Label htmlFor={`st-${state}`} className="text-sm font-normal">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-sm font-semibold">Era</h3>
        <div className="space-y-2">
          {ERAS.map((era) => (
            <div key={era} className="flex items-center gap-2">
              <Checkbox
                id={`era-${era}`}
                checked={eras.includes(era)}
                onCheckedChange={() => toggle(era as string, eras, setEras)}
              />
              <Label htmlFor={`era-${era}`} className="text-sm font-normal capitalize">
                {era}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-sm font-semibold">Content language</h3>
        <div className="space-y-2">
          {LOCALES.map((code) => (
            <div key={code} className="flex items-center gap-2">
              <Checkbox
                id={`lang-${code}`}
                checked={languages.includes(code)}
                onCheckedChange={() => toggle(code, languages, setLanguages)}
              />
              <Label htmlFor={`lang-${code}`} className="text-sm font-normal">
                {LANGUAGE_META[code].native}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="mb-2 text-sm font-semibold">Status & access</h3>
        <div className="flex items-center gap-2">
          <Checkbox id="unesco" checked={unescoOnly} onCheckedChange={(v) => setUnescoOnly(!!v)} />
          <Label htmlFor="unesco" className="text-sm font-normal">
            UNESCO World Heritage
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="intangible"
            checked={intangibleOnly}
            onCheckedChange={(v) => setIntangibleOnly(!!v)}
          />
          <Label htmlFor="intangible" className="text-sm font-normal">
            Intangible heritage listed
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="access"
            checked={accessibleOnly}
            onCheckedChange={(v) => setAccessibleOnly(!!v)}
          />
          <Label htmlFor="access" className="text-sm font-normal">
            <Accessibility className="mr-1 inline size-3.5" aria-hidden />
            Wheelchair accessible
          </Label>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={reset}>
        {t("common.reset")}
      </Button>
    </div>
  );

  return (
    <>
      <PageHeader
        kicker={t("nav.explore")}
        title={t("explore.title")}
        subtitle={t("explore.subtitle")}
      >
        <div className="max-w-3xl">
          <label htmlFor="explore-q" className="sr-only">
            {t("common.search")}
          </label>
          <input
            id="explore-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.searchPlaceholder")}
            className="h-12 w-full rounded-full border border-border bg-card px-5 text-sm shadow-heritage outline-none focus-visible:border-primary"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {CATEGORY_OPTIONS.map((opt) => {
              const active = selectedCategory === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(opt.id);
                    setCategories([]);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border shadow-sm cursor-pointer",
                    active
                      ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-amber-500/20 scale-[1.02]"
                      : "bg-card/90 text-muted-foreground border-border hover:text-foreground hover:bg-card hover:border-amber-500/40",
                  )}
                  aria-pressed={active}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Button
            variant="outline"
            className="w-full lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
          >
            <Filter className="mr-1.5 size-4" /> {t("explore.filters")}
          </Button>
          <div
            className={`mt-4 rounded-2xl border border-border bg-card p-4 lg:mt-0 lg:block ${showFilters ? "block" : "hidden"}`}
          >
            <p className="mb-4 flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="size-4 text-primary" aria-hidden />
              {t("explore.filters")}
            </p>
            {filters}
          </div>
        </aside>

        <section aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{results.length}</strong> {t("explore.results")}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-border bg-card p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                    viewMode === "grid"
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="size-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                    viewMode === "map"
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={viewMode === "map"}
                >
                  <MapIcon className="size-3.5" />
                  <span>GIS Map</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Label htmlFor="sort" className="text-sm text-muted-foreground">
                  Sort
                </Label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Recently updated</option>
                  <option value="az">A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-3 font-semibold">{t("common.noResults")}</p>
              <Button variant="outline" className="mt-4" onClick={reset}>
                {t("common.reset")}
              </Button>
            </div>
          ) : viewMode === "map" ? (
            <div className="mt-6">
              <IndiaHeritageMap sites={results} height="620px" />
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((site) => (
                <HeritageCard key={site.id} site={site} />
              ))}
            </div>
          )}

          <div className="mt-10">
            <GlobalSearch />
          </div>
        </section>
      </div>
    </>
  );
}
