import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Calendar,
  MessageCircle,
  Award,
  Phone,
  Store,
  Clock,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ARTISAN_SHOPS,
  isProductInSeason,
  buildWhatsAppInquiryUrl,
  type ArtisanShop,
  type ArtisanProduct,
} from "@/lib/artisan-data";

interface ArtisanBazaarProps {
  siteSlug?: string;
  monumentName?: string;
  className?: string;
  showHeader?: boolean;
}

type FilterType = "all" | "seasonal" | "year-round" | "gi-tagged";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ArtisanBazaar({
  siteSlug,
  monumentName = "Historic Monument",
  className = "",
  showHeader = true,
}: ArtisanBazaarProps) {
  // Real-time system calendar month (1-indexed: 1 = Jan, 9 = Sep)
  const realCurrentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(realCurrentMonth);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedGuildId, setSelectedGuildId] = useState<string>("all");
  const [activeGiModal, setActiveGiModal] = useState<{ product: ArtisanProduct; shop: ArtisanShop } | null>(null);

  // Filter shops: match monumentSlug if provided, otherwise all shops
  const matchedShops = useMemo(() => {
    if (!siteSlug) return ARTISAN_SHOPS;
    const s = siteSlug.toLowerCase();
    const matching = ARTISAN_SHOPS.filter(
      (shop) =>
        shop.monumentSlug.toLowerCase() === s ||
        s.includes(shop.monumentSlug.toLowerCase()) ||
        shop.monumentSlug.toLowerCase().includes(s) ||
        shop.monumentName.toLowerCase().includes(s) ||
        s.includes(shop.id.replace("shop-", "")) ||
        s.includes(shop.location.toLowerCase().split(",")[0]?.trim() || ""),
    );
    return matching.length > 0 ? matching : ARTISAN_SHOPS;
  }, [siteSlug]);

  const activeShops = useMemo(() => {
    if (selectedGuildId === "all") return matchedShops;
    return ARTISAN_SHOPS.filter((s) => s.id === selectedGuildId);
  }, [matchedShops, selectedGuildId]);

  // Flatten all products with their associated unique shop
  const allProducts = useMemo(() => {
    const list: Array<{ product: ArtisanProduct; shop: ArtisanShop }> = [];
    activeShops.forEach((shop) => {
      shop.featuredProducts.forEach((product) => {
        list.push({ product, shop });
      });
    });
    return list;
  }, [activeShops]);

  // Apply active category filter
  const displayedItems = useMemo(() => {
    return allProducts.filter(({ product }) => {
      if (activeFilter === "seasonal") return product.isSeasonal;
      if (activeFilter === "year-round") return !product.isSeasonal;
      if (activeFilter === "gi-tagged") return product.giTagged || false;
      return true;
    });
  }, [allProducts, activeFilter]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: allProducts.length,
      seasonal: allProducts.filter((i) => i.product.isSeasonal).length,
      yearRound: allProducts.filter((i) => !i.product.isSeasonal).length,
      giTagged: allProducts.filter((i) => i.product.giTagged).length,
    };
  }, [allProducts]);

  return (
    <section
      className={`rounded-3xl border border-stone-800 bg-stone-950/80 p-6 shadow-2xl backdrop-blur-md ${className}`}
    >
      {showHeader && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Store className="size-4" />
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight text-stone-100">
                Local Artisan & Heritage Bazaar
              </h3>
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Direct connection with hereditary artisan guilds, seasonal sweets, and GI-tagged
              crafts around {monumentName}.
            </p>
          </div>

          {/* Smart Calendar Season Simulator for Demo & Jury Presentation */}
          <div className="flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/90 px-3 py-1.5 shadow-inner">
            <Calendar className="size-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-medium text-stone-400">Festival Calendar:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border-0 bg-transparent text-xs font-semibold text-amber-300 outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1} className="bg-stone-900 text-stone-200">
                  {m} {idx + 1 === realCurrentMonth ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Guild Roster Bar (6 Verified Master Guilds) */}
      <div className="mb-5 flex flex-wrap items-center gap-1.5 border-b border-stone-800/60 pb-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400 mr-1.5">
          Craft Guilds:
        </span>
        <button
          type="button"
          onClick={() => setSelectedGuildId("all")}
          className={`rounded-xl px-2.5 py-1 text-xs font-medium transition ${
            selectedGuildId === "all"
              ? "bg-amber-500 text-stone-950 font-semibold"
              : "border border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800"
          }`}
        >
          {matchedShops.length < ARTISAN_SHOPS.length ? "Local Guild" : "All 6 Guilds"} (
          {activeShops.length})
        </button>
        {ARTISAN_SHOPS.map((shop) => (
          <button
            key={shop.id}
            type="button"
            onClick={() => setSelectedGuildId(shop.id)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
              selectedGuildId === shop.id
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "border border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800"
            }`}
          >
            <span>{shop.location.split(",")[0]}</span>
            <span className="text-[10px] opacity-75">({shop.artisanName.split(" ")[0]})</span>
          </button>
        ))}
      </div>

      {/* Filter Chips Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            activeFilter === "all"
              ? "bg-amber-500 text-stone-950 shadow-md"
              : "border border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
          }`}
        >
          <span>All Items</span>
          <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("seasonal")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            activeFilter === "seasonal"
              ? "bg-amber-500 text-stone-950 shadow-md"
              : "border border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
          }`}
        >
          <span>🌿 Seasonal Specials</span>
          <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
            {counts.seasonal}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("year-round")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            activeFilter === "year-round"
              ? "bg-amber-500 text-stone-950 shadow-md"
              : "border border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
          }`}
        >
          <span>Year-Round Crafts</span>
          <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
            {counts.yearRound}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("gi-tagged")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            activeFilter === "gi-tagged"
              ? "bg-amber-500 text-stone-950 shadow-md"
              : "border border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
          }`}
        >
          <Award className="size-3 text-amber-400" />
          <span>GI Tagged</span>
          <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
            {counts.giTagged}
          </span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map(({ product, shop }) => {
          const inSeason = isProductInSeason(product, selectedMonth);

          // Item-Specific WhatsApp URL dynamically built from the shop's unique whatsappNumber and artisan name
          const encodedMessage = encodeURIComponent(
            `Namaste ${shop.artisanName}, I found "${shop.shopName}" on the Dharohar Heritage portal for ${monumentName}. ` +
            `I am inquiring about the availability of "${product.name}". Could you please let me know if it is currently in stock or available for pickup? Thank you!`
          );
          const waUrl = `https://wa.me/${shop.whatsappNumber}?text=${encodedMessage}`;

          return (
            <article
              key={`${shop.id}-${product.id}`}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 ${
                product.isSeasonal && inSeason
                  ? "border-amber-500/50 bg-gradient-to-b from-stone-900 to-amber-950/20 shadow-lg shadow-amber-950/20"
                  : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
              }`}
            >
              <div className="p-5">
                {/* Status Badges Row */}
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {product.isSeasonal ? (
                    inSeason ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 shadow-sm animate-pulse">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        ✨ In Season Now ({product.seasonName})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-stone-700/60 bg-stone-800/80 px-2.5 py-1 text-[10px] font-medium text-stone-400">
                        <Clock className="size-3 text-stone-400" />
                        ⏳ Seasonal Craft • Available in {product.seasonName}
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-stone-800 bg-stone-800/50 px-2 py-0.5 text-[10px] font-medium text-stone-400">
                      <CheckCircle2 className="size-3 text-stone-500" />
                      Year-Round Craft
                    </span>
                  )}

                  {product.giTagged && (
                    <button
                      type="button"
                      onClick={() => setActiveGiModal({ product, shop })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer shadow-xs"
                      title="Verify Official GI Certificate & Authenticity Registry"
                    >
                      <Award className="size-3 text-amber-400" />
                      <span>GI Certified</span>
                      <span className="text-[9px] font-normal text-amber-400/80 underline">Verify ↗</span>
                    </button>
                  )}
                </div>

                {/* Product Name & Price */}
                <h4 className="text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h4>

                <p className="mt-1 font-mono text-xs font-semibold text-amber-400">
                  {product.estimatedPrice}
                </p>

                {/* Cultural Description */}
                {product.description && (
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-stone-300">
                    {product.description}
                  </p>
                )}

                {/* Verified Artisan & Shop Provenance Card */}
                <div className="mt-4 rounded-xl border border-stone-800/80 bg-stone-950/70 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-200">{shop.shopName}</span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {shop.experienceYears}+ yrs craft
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-amber-300/90">
                    Artisan: {shop.artisanName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-stone-400">{shop.craftTitle}</p>

                  <div className="mt-2 flex items-center justify-between border-t border-stone-800/60 pt-2 text-[10px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary shrink-0" />
                      {shop.location.split(",")[0]}, {shop.state}
                    </span>
                    <a
                      href={`tel:${shop.phone.replace(/[\s+]/g, "")}`}
                      className="flex items-center gap-1 text-stone-300 hover:text-amber-400 transition"
                      title="Direct telephone call"
                    >
                      <Phone className="size-2.5" />
                      {shop.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Button: Item-Specific WhatsApp Inquiry Routing */}
              <div className="border-t border-stone-800/80 bg-stone-900/40 p-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    toast.success(`Opening WhatsApp inquiry to ${shop.artisanName}`, {
                      description: `Connecting to ${shop.shopName} (${shop.phone}) regarding "${product.name}"`,
                    });
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-semibold transition shadow-md ${
                    product.isSeasonal && inSeason
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-950/40"
                      : "bg-stone-800 text-stone-100 hover:bg-amber-500 hover:text-stone-950"
                  }`}
                >
                  <MessageCircle className="size-4 shrink-0" />
                  <span>Inquire on WhatsApp ({shop.artisanName.split(" ")[0]})</span>
                  <ExternalLink className="size-3 opacity-60 ml-auto" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {displayedItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-800 p-8 text-center text-xs text-stone-400">
          No artisan products match the selected filter. Try selecting &quot;All Items&quot;.
        </div>
      )}

      {/* Official GI Provenance Certificate Dialog */}
      <Dialog open={!!activeGiModal} onOpenChange={(open) => !open && setActiveGiModal(null)}>
        {activeGiModal && (
          <DialogContent className="max-w-md border-amber-500/40 bg-stone-950 text-stone-100 p-6 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Geographical Indication Registry Verification</span>
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {activeGiModal.product.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-400">
                Statutory heritage certification verified under the Geographical Indications of Goods Act, 1999.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3.5 border-t border-stone-800/80 pt-4 text-xs">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-amber-400 block tracking-wider">
                    Registration Authority
                  </span>
                  <span className="text-xs font-bold text-amber-200">
                    Controller General of Patents, Designs & Trademarks (CGPDTM)
                  </span>
                </div>
                <Award className="size-7 text-amber-400 shrink-0" />
              </div>

              <dl className="divide-y divide-stone-800/80 rounded-xl bg-stone-900/70 p-3.5 border border-stone-800 text-xs">
                <div className="pb-2.5 flex justify-between">
                  <dt className="text-stone-400 font-medium">Authorized Artisan</dt>
                  <dd className="font-semibold text-white">{activeGiModal.shop.artisanName}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-stone-400 font-medium">Certified Guild</dt>
                  <dd className="font-semibold text-stone-200 text-right">{activeGiModal.shop.shopName}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-stone-400 font-medium">Geographic Cluster</dt>
                  <dd className="font-semibold text-amber-300">
                    {activeGiModal.shop.location}, {activeGiModal.shop.state}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-stone-400 font-medium">Craft Experience</dt>
                  <dd className="font-mono text-stone-200">{activeGiModal.shop.experienceYears}+ Years Lineage</dd>
                </div>
                <div className="pt-2.5 flex justify-between">
                  <dt className="text-stone-400 font-medium">Authentication Status</dt>
                  <dd className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Direct Guild Sourced
                  </dd>
                </div>
              </dl>

              <div className="rounded-lg bg-stone-900/50 p-2.5 border border-stone-800/80">
                <p className="text-[11px] text-stone-400 leading-relaxed italic">
                  💡 Zero-middleman trade: Purchases and WhatsApp inquiries connect directly to this verified cooperative society, protecting authentic indigenous weavers and sculptors.
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
