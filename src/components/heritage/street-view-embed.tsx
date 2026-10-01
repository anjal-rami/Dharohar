import React, { useState, useRef } from "react";
import { Compass, ExternalLink, Maximize2, Minimize2, Sparkles, MapPin, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StreetViewEmbedProps {
  embedUrl: string;
  title?: string | undefined;
  location?: string | undefined;
  className?: string | undefined;
  height?: string | number | undefined;
  fallbackPanoramaUrl?: string | undefined;
  onSwitchToThreeJs?: (() => void) | undefined;
}

export function StreetViewEmbed({
  embedUrl,
  title = "Brihadisvara Temple, Thanjavur",
  location = "Thanjavur, Tamil Nadu",
  className = "",
  height = "520px",
  fallbackPanoramaUrl,
  onSwitchToThreeJs,
}: StreetViewEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sanitize embed URL (handles potential markdown link formatting [url](url))
  const cleanUrl = embedUrl.trim().startsWith("[")
    ? embedUrl.match(/\((https?:\/\/[^\s)]+)\)/)?.[1] ||
      embedUrl.replace(/[\[\]]/g, "").split(" ")[0]
    : embedUrl;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`group relative w-full overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-950/80 backdrop-blur-sm transition-opacity">
          <div className="relative flex size-12 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400/20" />
            <span className="relative flex size-8 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Compass className="size-5 animate-spin" style={{ animationDuration: "3s" }} />
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-stone-300">
            Initializing Official ASI 360° Photosphere…
          </p>
          <p className="text-[11px] text-stone-500">Google Maps Street View Partner Scan</p>
        </div>
      )}

      {/* Sandboxed Google Maps 360 Street View iframe */}
      <iframe
        src={cleanUrl}
        title={`360 Street View Tour of ${title}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full"
      />

      {/* Top Left: Monument Badge */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5">
        <div className="pointer-events-auto rounded-2xl border border-amber-500/30 bg-stone-900/85 px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-stone-100 tracking-tight">{title}</h3>
          </div>
          <p className="mt-0.5 text-[11px] text-stone-400 flex items-center gap-1">
            <MapPin className="size-3 text-amber-500" />
            {location} &bull; ASI Official 360° Street View
          </p>
        </div>
      </div>

      {/* Top Right: Fullscreen & Controls */}
      <div className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-2">
        {onSwitchToThreeJs && fallbackPanoramaUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSwitchToThreeJs}
            className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-stone-700/60 bg-stone-900/85 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800 shadow-md backdrop-blur-md"
            title="Switch to Three.js Photogrammetric Sphere"
          >
            <Layers className="size-3.5" />
            <span>3D Sphere Mode</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          className="pointer-events-auto size-9 rounded-xl border border-stone-700/60 bg-stone-900/85 p-0 text-stone-300 hover:text-amber-300 hover:bg-stone-800 shadow-md backdrop-blur-md"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen 360° View"}
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* Bottom Bar: Instructions & External Link */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 text-[11px] text-stone-300 shadow-md backdrop-blur-md flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>Click & drag to look around 360° &bull; Scroll to zoom</span>
        </div>

        <a
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-amber-300 hover:text-amber-200 hover:bg-black/80 shadow-md backdrop-blur-md transition"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
