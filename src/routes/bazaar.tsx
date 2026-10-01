import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Calendar, ShoppingBag, MapPin, Search, Filter, MessageCircle, Award, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ARTISAN_SHOPS, isProductInSeason, buildWhatsAppInquiryUrl, type ArtisanShop, type ArtisanProduct } from "@/lib/artisan-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/bazaar")({
  head: () => ({
    meta: [
      { title: "Local Artisan & Heritage Bazaar — Dharohar" },
      {
        name: "description",
        content:
          "Discover seasonal & festival-linked traditional crafts, sweets, and textiles direct from verified master artisans across India.",
      },
    ],
  }),
  component: BazaarPage,
});

const MONTH_NAMES = [
  "January (Makar Sankranti / Pongal)",
  "February (Basant Panchami)",
  "March (Holi & Spring)",
  "April (Baisakhi / Puthandu)",
  "May (Summer Folk Crafts)",
  "June (Rath Yatra / Monsoon onset)",
  "July (Shravan & Teej)",
  "August (Raksha Bandhan / Krishna Janmashtami)",
  "September (Ganesh Utsav & Autumn)",
  "October (Navaratri & Durga Puja)",
  "November (Diwali & Dev Deepawali)",
  "December (Winter Solstice & Heritage Weaves)",
];

function BazaarPage() {
  const { t } = useI18n();
  const currentSystemMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentSystemMonth);
  const [activeFilter, setActiveFilter] = useState<"all" | "seasonal" | "year-round" | "gi">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allProductsWithShop = useMemo(() => {
    return ARTISAN_SHOPS.flatMap((shop) =>
      shop.featuredProducts.map((product) => ({
        product,
        shop,
      }))
    );
  }, []);

  const filteredItems = useMemo(() => {
    return allProductsWithShop.filter(({ product, shop }) => {
      // Region filter
      if (selectedRegion !== "all" && shop.id !== selectedRegion) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          product.name.toLowerCase().includes(q) ||
          shop.artisanName.toLowerCase().includes(q) ||
          shop.monumentName.toLowerCase().includes(q) ||
          (product.description && product.description.toLowerCase().includes(q)) ||
          (product.seasonName && product.seasonName.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Category / Type filter
      if (activeFilter === "seasonal") {
        return product.isSeasonal;
      }
      if (activeFilter === "year-round") {
        return !product.isSeasonal;
      }
      if (activeFilter === "gi") {
        return Boolean(product.giTagged || shop.giTagged);
      }
      return true;
    });
  }, [allProductsWithShop, selectedRegion, searchQuery, activeFilter]);

  const seasonalCount = allProductsWithShop.filter((i) => i.product.isSeasonal).length;
  const yearRoundCount = allProductsWithShop.filter((i) => !i.product.isSeasonal).length;
  const giCount = allProductsWithShop.filter((i) => i.product.giTagged || i.shop.giTagged).length;

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        kicker="Heritage Marketplace"
        title="Local Artisan & Heritage Bazaar"
        subtitle="Empowering heritage craft guilds, GI-tagged masters & seasonal festive confectioners"
      />

      {/* Hero Announcement & Calendar Controller */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-emerald-500/10 p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Sparkles className="size-3.5 animate-spin" />
                Live Festival & Seasonal Availability Engine
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                100% Direct Artisan Benefit (Zero Commission)
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Authentic Indian Crafts, Sweets & Handlooms
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Each heritage site is surrounded by indigenous artisan communities whose crafts peak during specific regional festivals. Connect directly over WhatsApp to inquire or place authentic pre-orders.
            </p>
          </div>

          {/* Month Simulator */}
          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur shrink-0 sm:min-w-[320px]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              Calendar Season Simulator
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Simulate festive dates to inspect dynamic seasonal craft availability:
            </p>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1 === currentSystemMonth ? `📍 Current: ${name}` : name}
                </option>
              ))}
            </select>
            {selectedMonth !== currentSystemMonth && (
              <button
                type="button"
                onClick={() => setSelectedMonth(currentSystemMonth)}
                className="mt-2 text-xs text-primary underline underline-offset-2 hover:opacity-80"
              >
                Reset to current system date ({MONTH_NAMES[currentSystemMonth - 1]?.split(" ")[0]})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Guild Highlights / Region Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
          Guilds:
        </span>
        <button
          type="button"
          onClick={() => setSelectedRegion("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            selectedRegion === "all"
              ? "bg-primary text-primary-foreground shadow"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          All Guilds ({ARTISAN_SHOPS.length})
        </button>
        {ARTISAN_SHOPS.map((shop) => (
          <button
            key={shop.id}
            type="button"
            onClick={() => setSelectedRegion(shop.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedRegion === shop.id
                ? "bg-primary text-primary-foreground shadow"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {shop.location.split(",")[0]} • {shop.craftTitle.split("&")[0]}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === "all"
                ? "bg-foreground text-background font-semibold"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            All Items ({allProductsWithShop.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("seasonal")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === "seasonal"
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            🌿 Seasonal Specials ({seasonalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("year-round")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === "year-round"
                ? "bg-foreground text-background font-semibold"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            Year-Round Crafts ({yearRoundCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("gi")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === "gi"
                ? "bg-emerald-600 text-white font-semibold shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            GI Tagged ({giCount})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sweets, weaves, crafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Products */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-base font-medium">No items match your selected filters</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search terms or selecting &quot;All Guilds&quot;
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(({ product, shop }) => {
            const inSeason = isProductInSeason(product, selectedMonth);
            const whatsappUrl = buildWhatsAppInquiryUrl(shop, product, selectedMonth);

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-3">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.isSeasonal ? (
                      inSeason ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-pulse">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          ✨ In Season Now ({product.seasonName})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-500/10 border border-stone-500/20 px-3 py-1 text-xs font-medium text-muted-foreground">
                          <span>⏳</span>
                          Seasonal Craft • Available in {product.seasonName}
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        ✦ Year-Round Availability
                      </span>
                    )}

                    {(product.giTagged || shop.giTagged) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        <Award className="size-3" />
                        GI Certified
                      </span>
                    )}
                  </div>

                  {/* Product Title and Price */}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      Estimated Price: {product.estimatedPrice}
                    </p>
                  </div>

                  {product.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {/* Artisan / Guild Footnote */}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs font-semibold text-foreground">{shop.shopName}</p>
                    <p className="text-[11px] text-amber-500/90 font-medium">Artisan: {shop.artisanName}</p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary shrink-0" />
                        {shop.location.split(",")[0]}, {shop.state}
                      </span>
                      <span>📞 {shop.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="mt-5 space-y-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    <MessageCircle className="size-4" />
                    Inquire on WhatsApp ({shop.artisanName.split(" ")[0]})
                  </a>

                  <Link
                    to="/heritage/$slug"
                    params={{ slug: shop.monumentSlug }}
                    className="block text-center text-[11px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    View monument dossier ({shop.monumentName.split(",")[0]}) →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
