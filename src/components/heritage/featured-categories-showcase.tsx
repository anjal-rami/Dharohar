import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  CULTURAL_CATEGORY_ITEMS,
  CATEGORY_TAB_CONFIG,
  type CategoryKey,
  type RegionKey,
  type CulturalCategoryItem,
} from "@/lib/categories-data";
import { cn } from "@/lib/utils";
import { Sparkles, MapPin, Award, Search, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { getHeritageCoverImage } from "@/lib/heritage-records-data";

const REGIONS: (RegionKey | "All")[] = ["All", "North", "South", "East", "West", "Central", "Northeast"];

function getFestivalSlug(id: string): string {
  const map: Record<string, string> = {
    "fest-garba-01": "navratri-garba",
    "fest-wb-durga-puja": "durga-puja-kolkata",
    "fest-punjab-baisakhi": "baisakhi-lohri",
    "fest-kerala-onam": "onam-vallam-kali",
    "fest-tn-pongal": "pongal-jallikattu",
    "fest-assam-bihu": "rongali-bihu",
    "fest-odisha-ratha-yatra": "puri-ratha-yatra",
    "fest-bihar-chhath": "chhath-puja",
    "fest-mh-ganesh-chaturthi": "ganesh-chaturthi",
    "fest-nagaland-hornbill": "hornbill-festival",
    "fest-ladakh-hemis": "hemis-festival",
    "fest-rajasthan-pushkar": "pushkar-camel-fair",
  };
  return map[id] || id.replace("fest-", "").replace(/-\d+$/, "");
}

function getPerformingArtSlug(item: CulturalCategoryItem): string {
  if (item.slug) return item.slug;
  const map: Record<string, string> = {
    "art-kerala-kathakali": "kathakali-kerala",
    "art-kathakali-kerala": "kathakali-kerala",
    "art-tn-bharatanatyam": "bharatanatyam-tamilnadu",
    "art-bharatanatyam-tn": "bharatanatyam-tamilnadu",
    "art-gujarat-garba-raas": "garba-dance-gujarat",
    "art-garba-gujarat": "garba-dance-gujarat",
    "art-punjab-bhangra": "bhangra-punjab",
    "art-punjab-bhangra-giddha": "bhangra-punjab",
    "art-bhangra-punjab": "bhangra-punjab",
    "dance-ghoomar-01": "ghoomar-rajasthan",
    "art-rajasthan-ghoomar": "ghoomar-rajasthan",
    "art-ghoomar-rajasthan": "ghoomar-rajasthan",
    "art-odisha-odissi": "odissi-odisha",
    "art-up-kathak": "kathak-up",
    "art-karnataka-yakshagana": "yakshagana-karnataka",
    "art-manipur-raas-leela": "manipuri-raas-manipur",
    "art-manipuri-raas": "manipuri-raas-manipur",
    "art-assam-sattriya": "sattriya-assam",
    "art-chhattisgarh-pandavani": "pandavani-chhattisgarh",
    "art-east-chhau": "chhau-dance-east",
    "art-jharkhand-chhau": "chhau-dance-east",
    "art-chhau-east": "chhau-dance-east",
  };
  return map[item.id] || item.id.replace("art-", "");
}

function getCulinarySlug(item: CulturalCategoryItem): string {
  if (item.slug) return item.slug;
  const map: Record<string, string> = {
    "food-gujarat-fafda-jalebi": "fafda-jalebi-gujarat",
    "food-fafda-jalebi-gujarat": "fafda-jalebi-gujarat",
    "food-rajasthan-dal-baati": "dal-baati-rajasthan",
    "food-dal-baati-rajasthan": "dal-baati-rajasthan",
    "food-punjab-makki-sarson": "makki-sarson-punjab",
    "food-makki-sarson-punjab": "makki-sarson-punjab",
    "food-kerala-onasadya": "onasadya-kerala",
    "food-onasadya-kerala": "onasadya-kerala",
    "food-bihar-litti-chokha": "litti-chokha-bihar",
    "food-litti-chokha-bihar": "litti-chokha-bihar",
    "food-hyderabad-biryani": "biryani-hyderabad",
    "food-biryani-hyderabad": "biryani-hyderabad",
    "food-wb-rosogolla": "rosogolla-bengal",
    "food-rosogolla-bengal": "rosogolla-bengal",
    "food-tn-idli-coffee": "idli-coffee-tamilnadu",
    "food-idli-coffee-tamilnadu": "idli-coffee-tamilnadu",
    "food-jk-wazwan": "wazwan-kashmir",
    "food-wazwan-kashmir": "wazwan-kashmir",
    "food-mh-misal-pav": "misal-pav-maharashtra",
    "food-misal-pav-maharashtra": "misal-pav-maharashtra",
    "food-goa-fish-curry": "goan-curry-goa",
    "food-goan-curry-goa": "goan-curry-goa",
    "food-assam-masor-tenga": "masor-tenga-assam",
    "food-masor-tenga-assam": "masor-tenga-assam",
  };
  return map[item.id] || item.id.replace("food-", "");
}

function getCraftSlug(item: CulturalCategoryItem): string {
  if (item.slug) return item.slug;
  const map: Record<string, string> = {
    "craft-patola-gujarat": "patan-patola-gujarat",
    "craft-blue-pottery-rajasthan": "blue-pottery-jaipur",
    "craft-banarasi-silk-up": "banarasi-brocade-up",
    "craft-pashmina-kashmir": "pashmina-kani-kashmir",
    "craft-pattachitra-odisha": "pattachitra-odisha",
    "craft-chanderi-mp": "chanderi-weaves-mp",
    "craft-kanchipuram-tn": "kanchipuram-silk-weaving",
    "kanchipuram-silk-weaving": "kanchipuram-silk-weaving",
    "bandhani-kutch": "bandhani-kutch",
    "craft-muga-silk-assam": "muga-silk-assam",
    "craft-kalamkari-andhra": "srikalahasti-kalamkari-andhra",
    "craft-channapatna-karnataka": "channapatna-lacquer-toys",
    "craft-bastar-dhokra-cg": "bastar-dhokra-chhattisgarh",
    "craft-madhubani-bihar": "madhubani-painting-bihar",
  };
  return map[item.id] || item.id.replace("craft-", "");
}

export function FeaturedCategoriesShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("festivals");
  const [activeRegion, setActiveRegion] = useState<RegionKey | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 150);

  const filteredItems = useMemo(() => {
    return CULTURAL_CATEGORY_ITEMS.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (activeRegion !== "All" && item.region && item.region !== activeRegion) return false;
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesState = item.state.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        const matchesTags = item.tags ? item.tags.some((t) => t.toLowerCase().includes(q)) : false;
        if (!matchesTitle && !matchesState && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [activeCategory, activeRegion, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
        {(Object.keys(CATEGORY_TAB_CONFIG) as CategoryKey[]).map((catKey) => {
          const config = CATEGORY_TAB_CONFIG[catKey];
          const count = CULTURAL_CATEGORY_ITEMS.filter((i) => i.category === catKey).length;
          const isActive = activeCategory === catKey;

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => {
                setActiveCategory(catKey);
                setActiveRegion("All");
              }}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer",
                isActive
                  ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <span className="text-base">{config.icon}</span>
              <span>{config.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-stone-950/20 text-stone-950"
                    : "bg-muted text-muted-foreground group-hover:text-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description & Search / Region Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-stone-300">
            {CATEGORY_TAB_CONFIG[activeCategory].description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search traditions or state..."
              className="w-full rounded-xl border border-border/60 bg-card/80 py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Region Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border/50 bg-card/60 p-1">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer shrink-0",
                  activeRegion === region
                    ? "bg-stone-800 text-amber-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Cultural Items */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            No records match the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveRegion("All");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-semibold text-amber-500 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => {
            const isFestival = item.category === "festivals";
            const isPerformingArt = item.category === "performing_arts";
            const isCulinary = item.category === "culinary";
            const isCraft = item.category === "crafts";

            const festivalSlug = isFestival ? getFestivalSlug(item.id) : "";
            const performingArtSlug = isPerformingArt ? getPerformingArtSlug(item) : "";
            const culinarySlug = isCulinary ? getCulinarySlug(item) : "";
            const craftSlug = isCraft ? getCraftSlug(item) : "";

            const CardContent = (
              <>
                {/* Image Frame */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={getHeritageCoverImage(item)}
                    alt={item.title}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.dataset["fallbackApplied"]) return;
                      target.dataset["fallbackApplied"] = "true";
                      target.src = "/assets/hero-heritage.jpg";
                    }}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* State & Region Tag */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/90 px-2.5 py-0.5 text-[11px] font-semibold text-stone-100 backdrop-blur-md border border-stone-700/80 shadow-md">
                      <MapPin className="size-3 text-amber-400 shrink-0" />
                      <span>{item.state}</span>
                      {item.region && (
                        <>
                          <span className="text-stone-500">&bull;</span>
                          <span className="text-stone-300">{item.region}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Heritage Status Badge */}
                  {item.heritageStatus && (
                    <div className="absolute top-2.5 right-2.5 z-10 max-w-[85%]">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight shadow-lg backdrop-blur-md border whitespace-nowrap shrink-0",
                          item.heritageStatus.includes("UNESCO") &&
                            "bg-emerald-950/90 text-emerald-200 border-emerald-400/70",
                          item.heritageStatus.includes("Classical") &&
                            "bg-purple-950/90 text-purple-200 border-purple-400/70",
                          item.heritageStatus.includes("Folk Theatre") &&
                            "bg-indigo-950/90 text-indigo-200 border-indigo-400/70",
                          item.heritageStatus.includes("Folk Tradition") &&
                            "bg-amber-950/90 text-amber-200 border-amber-400/70",
                          (item.heritageStatus.includes("Geographical") || item.heritageStatus.includes("GI")) &&
                            "bg-sky-950/90 text-sky-200 border-sky-400/70",
                          item.heritageStatus.includes("National") &&
                            "bg-amber-950/90 text-amber-200 border-amber-400/70",
                          item.heritageStatus.includes("Royal") &&
                            "bg-rose-950/90 text-rose-200 border-rose-400/70",
                          item.heritageStatus.includes("Community") &&
                            "bg-amber-950/90 text-amber-200 border-amber-400/70",
                        )}
                      >
                        <Award className="size-3 shrink-0" />
                        <span className="whitespace-nowrap">
                          {item.heritageStatus.includes("Geographical") || item.heritageStatus.includes("GI")
                            ? "Geographical Indication Registered"
                            : item.heritageStatus.includes("UNESCO")
                            ? "UNESCO ICH"
                            : item.heritageStatus.replace("Culinary Heritage", "Heritage")}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Technique Tag for Culinary Traditions & Master Crafts */}
                    {(item.cookingTechnique || (isCraft && item.tags && item.tags[0])) && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg w-fit whitespace-nowrap shrink-0">
                        <span className="shrink-0">{item.cookingTechnique ? "🔥" : "🧵"}</span>
                        <span className="whitespace-nowrap">{item.cookingTechnique || `Technique: ${item.tags?.[0]}`}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Tags & Action */}
                  <div className="pt-2 border-t border-stone-800/60 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stone-900 px-1.5 py-0.5 text-[10px] font-medium text-stone-400 whitespace-nowrap shrink-0"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {isFestival ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition group-hover:translate-x-0.5">
                        <span>Festival Dossier</span> &rarr;
                      </span>
                    ) : isPerformingArt ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition group-hover:translate-x-0.5">
                        <span>Art Dossier</span> &rarr;
                      </span>
                    ) : isCulinary ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition group-hover:translate-x-0.5">
                        <span>Culinary Dossier</span> &rarr;
                      </span>
                    ) : isCraft ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition group-hover:translate-x-0.5">
                        <span>Craft Dossier</span> &rarr;
                      </span>
                    ) : (
                      <Link
                        to="/explore"
                        search={{ q: item.title }}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Explore &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </>
            );

            if (isFestival) {
              return (
                <Link
                  key={item.id}
                  to="/festivals/$slug"
                  params={{ slug: festivalSlug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-[#141414] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer text-inherit no-underline"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isPerformingArt) {
              return (
                <Link
                  key={item.id}
                  to="/performing-arts/$slug"
                  params={{ slug: performingArtSlug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-[#141414] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer text-inherit no-underline"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isCulinary) {
              return (
                <Link
                  key={item.id}
                  to="/culinary/$slug"
                  params={{ slug: culinarySlug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-[#141414] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer text-inherit no-underline"
                >
                  {CardContent}
                </Link>
              );
            }

            if (isCraft) {
              return (
                <Link
                  key={item.id}
                  to="/crafts/$slug"
                  params={{ slug: craftSlug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-[#141414] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer text-inherit no-underline"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-[#141414] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {CardContent}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
