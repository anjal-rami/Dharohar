import React, { useState, useCallback } from "react";

export interface StreetView360Props {
  monumentName?: string;
  embedUrl?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Known pano IDs for major ASI heritage sites.
 * Each entry: approximate lat,lng key → { panoId, heading, pitch }
 */
const KNOWN_PANOS: Array<{
  lat: number;
  lng: number;
  panoId: string;
  heading: number;
  pitch: number;
}> = [
  // Brihadisvara Temple, Thanjavur
  { lat: 10.782806, lng: 79.131833, panoId: "CAoSK0FGMVFpcE1KcU5vSm9jTXBLNVl4clA4S2s1UXhUbkd3UGR1MmZ2dGFzVEk.", heading: 155, pitch: 8 },
  // Taj Mahal
  { lat: 27.1751, lng: 78.0421, panoId: "F3zVxHJ7kH0AAAQvxgbyTg", heading: 180, pitch: 5 },
  // Qutb Minar
  { lat: 28.5245, lng: 77.1855, panoId: "2JiGv0e4cPkAAAQvxgbyTg", heading: 90, pitch: 5 },
];

function buildEmbedUrl(lat: number, lng: number): string {
  const pano = KNOWN_PANOS.find(
    (p) => Math.abs(p.lat - lat) < 0.01 && Math.abs(p.lng - lng) < 0.01
  );

  if (pano) {
    return (
      `https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7` +
      `!1s${pano.panoId}!2m2!1d${lat}!2d${lng}` +
      `!3f${pano.heading}!4f${pano.pitch}!5f0.7820865974627469`
    );
  }

  // Generic coordinate-based Street View embed
  return `https://www.google.com/maps/embed?pb=!4v1700000000001!6m8!1m7!1sAF1QipN_placeholder!2m2!1d${lat}!2d${lng}!3f180!4f0!5f0.7820865974627469`;
}

export function MonumentStreetView360({
  monumentName = "Brihadisvara Temple, Thanjavur",
  embedUrl,
  latitude = 10.782806,
  longitude = 79.131833,
}: StreetView360Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const activeSrc = embedUrl || buildEmbedUrl(latitude, longitude);
  const fullscreenUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}&heading=155&pitch=8`;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0d]">
      {/* Top HUD Pill */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white shadow-lg pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-amber-300">{monumentName}</span>
        <span className="text-zinc-400">•</span>
        <span className="text-zinc-200">360° First-Person Walk</span>
      </div>

      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-20">
        <a
          href={fullscreenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full bg-black/85 hover:bg-black text-white text-xs border border-white/15 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:border-amber-500/50"
        >
          <span>⛶</span> Full Screen Walk ↗
        </a>
      </div>

      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-zinc-400 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono">Loading 360° Photosphere...</p>
          <p className="text-[11px] text-zinc-600">{monumentName}</p>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="w-full h-[560px] flex flex-col items-center justify-center bg-[#0d0d0d] p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            🧭
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-base font-bold text-white">Open in Google Maps</h4>
            <p className="text-xs text-zinc-400">
              Live Street View is available for {monumentName}. Open the full 360° walkthrough directly.
            </p>
          </div>
          <a
            href={fullscreenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition shadow-lg shadow-amber-500/20"
          >
            Enter 360° Walkthrough ↗
          </a>
        </div>
      )}

      {/* 360° Iframe Viewport */}
      {!hasError && (
        <iframe
          key={activeSrc}
          title={`360 Street View of ${monumentName}`}
          src={activeSrc}
          width="100%"
          height="580"
          style={{
            border: 0,
            display: "block",
            filter: "none",
            WebkitFilter: "none",
          }}
          allowFullScreen={true}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleLoad}
          onError={handleError}
          className="w-full"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      )}

      {/* Walk Instructions Footer */}
      <div className="px-5 py-3 bg-[#0d0d0d] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <span>🚶 Click ground arrows to walk forward</span>
          <span className="text-zinc-700">|</span>
          <span>Click &amp; drag to look around 360°</span>
        </span>
        <span className="font-mono text-zinc-600 text-[11px]">
          [{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E]
        </span>
      </div>
    </div>
  );
}

// Re-export alias
export const Monument360Viewer = MonumentStreetView360;
export type Monument360Props = StreetView360Props;

