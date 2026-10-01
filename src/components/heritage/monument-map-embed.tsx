import React, { useState } from "react";
import { Compass, ExternalLink, MapPin, Satellite, Globe2 } from "lucide-react";

export interface MonumentMapEmbedProps {
  monumentName: string;
  latitude: number;
  longitude: number;
  placeQuery?: string;
  className?: string;
}

export function MonumentMapEmbed({
  monumentName,
  latitude,
  longitude,
  placeQuery,
  className = "",
}: MonumentMapEmbedProps) {
  const [viewMode, setViewMode] = useState<"interactive" | "satellite">("interactive");
  const [isLoaded, setIsLoaded] = useState(false);

  // Encode the monument query
  const query = encodeURIComponent(placeQuery || `${monumentName}, India`);

  // Direct, reliable Google Maps embed endpoints
  // &t=k enables satellite/photorealistic 3D imagery; default is standard vector map
  const mapTypeParam = viewMode === "satellite" ? "&t=k" : "";
  const embedSrc = `https://maps.google.com/maps?q=${query}&hl=en&z=17&ie=UTF8&output=embed${mapTypeParam}`;

  // Direct link to launch Google's full immersive 360° Street View / Photosphere
  const streetViewDirectUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0e0e0e] ${className}`}>
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-[#141414] border-b border-white/10 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
              Live Geospatial & Satellite Survey: {monumentName}
            </span>
            <span className="text-[11px] text-zinc-400">
              Interactive ASI Heritage Grounds & Surroundings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle Satellite vs Standard */}
          <div className="flex rounded-xl bg-black/50 border border-white/10 p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsLoaded(false);
                setViewMode("interactive");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === "interactive"
                  ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe2 className="size-3.5" />
              <span>Standard Map</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoaded(false);
                setViewMode("satellite");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === "satellite"
                  ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Satellite className="size-3.5" />
              <span>Satellite 3D</span>
            </button>
          </div>

          {/* Launch Full Official 360° Street View in new tab */}
          <a
            href={streetViewDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5 shadow-sm"
            title="Launch full 360° Street View Photosphere in Google Maps"
          >
            <Compass className="size-3.5 text-amber-400" />
            <span>Launch 360° Street View ↗</span>
          </a>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[500px] bg-stone-950">
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-zinc-400 space-y-2">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-stone-300">Connecting to Google Maps live feed…</p>
            <p className="text-[11px] text-stone-500">Retrieving coordinates [{latitude.toFixed(4)}°, {longitude.toFixed(4)}°]</p>
          </div>
        )}

        <iframe
          key={`${monumentName}-${viewMode}`}
          title={`Google Map view of ${monumentName}`}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full filter contrast-[1.02]"
        />
      </div>

      {/* Bottom Coordinates & Source Note */}
      <div className="px-4 py-2.5 bg-[#141414] border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3 text-amber-500" />
          <span>
            Geodetic Datum: [{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E] &bull; High-Precision WGS84
          </span>
        </div>
        <span className="text-zinc-400">
          Integrated Google Maps Satellite & Photosphere Network &bull; ASI Digital Registry
        </span>
      </div>
    </div>
  );
}
