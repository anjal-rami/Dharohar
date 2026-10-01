import React, { useState } from "react";
import { Landmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeritageImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  containerClassName?: string;
}

/**
 * Universal Image Fallback Safeguard for Dharohar
 * Automatically detects failed image loads, broken CDNs, or missing local assets,
 * gracefully rendering a styled heritage ambient placeholder with Indian architectural motifs.
 */
export function HeritageImage({
  src,
  alt = "Heritage Cultural Relic",
  className,
  containerClassName,
  fallbackText,
  fallbackIcon: FallbackIcon = Landmark,
  loading = "lazy",
  ...props
}: HeritageImageProps) {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source provided or previous load failed, render the ambient fallback
  if (hasError || !src) {
    return (
      <div
        className={cn(
          "relative flex size-full flex-col items-center justify-center overflow-hidden border border-stone-800/60 bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950/40 p-4 text-center select-none",
          containerClassName,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {/* Ambient background mandala halo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-400 shadow-inner">
            <FallbackIcon className="size-5" />
          </div>

          <p className="mt-2.5 max-w-[200px] text-xs font-semibold text-stone-200 line-clamp-1">
            {fallbackText || alt}
          </p>

          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="size-2.5" />
            Dharohar Archive
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton / Ambient backdrop during initial network download */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900 animate-pulse">
          <Landmark className="size-6 text-stone-700 animate-pulse" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
