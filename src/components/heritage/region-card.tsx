import type { CulturalRegion } from "@/lib/heritage-data";

export interface CulturalRegionCardProps {
  region: CulturalRegion;
  className?: string;
}

/**
 * CulturalRegionCard Presentation Component
 * Solves low-contrast overlay issues with a deep solid scrim, top vignette,
 * and an isolated frosted-glass typography foundation over authentic regional photography.
 */
export function CulturalRegionCard({ region, className = "" }: CulturalRegionCardProps) {
  const imgSrc = region.imageUrl || region.image || "/assets/hero-heritage.jpg";
  const displayTagline = region.tagline || region.blurb;

  return (
    <article
      className={`group relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl ${className}`}
    >
      {/* 1. Background Image with subtle zoom on hover */}
      <img
        src={imgSrc}
        alt={region.name}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.dataset["fallbackApplied"]) return;
          target.dataset["fallbackApplied"] = "true";
          target.src = "/assets/hero-heritage.jpg";
        }}
      />

      {/* 2. Deep Solid Scrim & Radial Vignette for Guaranteed Contrast */}
      {/* Dark tint on top for badges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent h-28 pointer-events-none" />

      {/* Heavy, dark bottom foundation specifically for all typography */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 via-45% to-transparent opacity-95 transition-opacity duration-300 pointer-events-none" />

      {/* 3. Card Content Area */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        {/* Top: State Badges */}
        <div className="flex flex-wrap gap-1.5">
          {region.states.slice(0, 3).map((st: string) => (
            <span
              key={st}
              className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-200 backdrop-blur-md border border-white/15 shadow-sm"
            >
              {st}
            </span>
          ))}
          {region.states.length > 3 && (
            <span
              className="rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400 backdrop-blur-md border border-white/15"
            >
              +{region.states.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Content Container (Isolated in a clean dark backdrop) */}
        <div className="space-y-2.5 rounded-2xl bg-black/40 p-3.5 backdrop-blur-md border border-white/10">
          {/* Region Name */}
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors drop-shadow-md">
            {region.name}
          </h3>

          {/* Tagline / Subtitle */}
          {displayTagline && (
            <p className="text-xs sm:text-sm text-zinc-200 leading-snug line-clamp-2 drop-shadow-sm font-normal">
              {displayTagline}
            </p>
          )}

          {/* Highlights Pills */}
          {region.highlights && region.highlights.length > 0 && (
            <div className="pt-2 border-t border-white/15 flex flex-wrap gap-1.5">
              {region.highlights.map((hl: string) => (
                <span
                  key={hl}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-medium font-mono"
                >
                  <span className="text-[8px] text-amber-400">◆</span>
                  {hl}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Re-export as RegionCard for backward compatibility with existing imports
export const RegionCard = CulturalRegionCard;
export type RegionCardProps = CulturalRegionCardProps;
