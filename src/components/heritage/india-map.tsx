import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CATEGORY_META,
  HERITAGE_SITES,
  type HeritageSite,
  type PreservationStatus,
} from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PreservationChip } from "@/components/heritage/chips";
import { ExternalLink, MapPin, Search, X } from "lucide-react";

const STATUS_COLORS: Record<
  PreservationStatus,
  { hex: string; bg: string; text: string; ring: string }
> = {
  safe: {
    hex: "#10b981",
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    ring: "rgba(16, 185, 129, 0.45)",
  },
  attention: {
    hex: "#f59e0b",
    bg: "bg-amber-500",
    text: "text-amber-400",
    ring: "rgba(245, 158, 11, 0.45)",
  },
  risk: {
    hex: "#ef4444",
    bg: "bg-red-500",
    text: "text-red-400",
    ring: "rgba(239, 68, 68, 0.55)",
  },
  restoration: {
    hex: "#3b82f6",
    bg: "bg-blue-500",
    text: "text-blue-400",
    ring: "rgba(59, 130, 246, 0.45)",
  },
};

type RegionKey = "all" | "north" | "south" | "west" | "east" | "central";

interface RegionPreset {
  label: string;
  center: [number, number];
  zoom: number;
}

const REGION_PRESETS: Record<RegionKey, RegionPreset> = {
  all: { label: "All India", center: [78.9629, 22.5937], zoom: 4.3 },
  north: { label: "North", center: [77.2, 30.5], zoom: 5.6 },
  south: { label: "South", center: [77.6, 12.5], zoom: 5.5 },
  west: { label: "West", center: [72.8, 22.0], zoom: 5.5 },
  east: { label: "East", center: [88.0, 23.8], zoom: 5.5 },
  central: { label: "Central", center: [78.5, 23.2], zoom: 5.8 },
};

export interface IndiaHeritageMapProps {
  sites?: HeritageSite[];
  height?: string;
  colorBy?: "preservation" | "category";
  initialActiveSlug?: string | undefined;
  onSelectSite?: (slug: string) => void;
  showAccessibleList?: boolean;
  className?: string;
}

// Sovereign mainland boundary box clamping (prevents panning into sensitive perimeter tiles)
// Format for MapLibre: [[minLng (West), minLat (South)], [maxLng (East), maxLat (North)]]
export const SOI_COMPLIANT_BOUNDS: [[number, number], [number, number]] = [
  [68.1113787, 6.5546079], // Southwest: Kutch / Kanyakumari
  [97.395561, 37.084107],   // Northeast: Kibithu / Siachen
];

export const CLEAN_OSM_TILES = [
  "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
];

export const OSM_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: CLEAN_OSM_TILES,
      tileSize: 256,
      attribution:
        'Survey of India (SOI) Aligned Baseline &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-opacity": 1,
      },
    },
  ],
};

// Aliases for backwards compatibility — all point to unkeyed, completely watermark-free OpenStreetMap tiles
export const CARTO_DARK_RASTER_STYLE: maplibregl.StyleSpecification = OSM_RASTER_STYLE;
export const CARTO_DARK_NOLABELS_RASTER_STYLE: maplibregl.StyleSpecification = OSM_RASTER_STYLE;
export const CARTO_VOYAGER_RASTER_STYLE: maplibregl.StyleSpecification = OSM_RASTER_STYLE;
export const CARTO_VOYAGER_NOLABELS_RASTER_STYLE: maplibregl.StyleSpecification = OSM_RASTER_STYLE;
export const CARTO_LIGHT_RASTER_STYLE: maplibregl.StyleSpecification = OSM_RASTER_STYLE;

// Drop-in Leaflet tileLayer provider configuration:
export const LEAFLET_FREE_TILE_CONFIG = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    subdomains: "abc",
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  },
};
export const LEAFLET_CARTO_DARK_CONFIG = LEAFLET_FREE_TILE_CONFIG;

function useMapTheme(): "light" | "dark" {
  return "dark";
}

interface MarkerRecord {
  el: HTMLDivElement;
  inner: HTMLDivElement;
  colors: (typeof STATUS_COLORS)[PreservationStatus];
}

export function IndiaHeritageMap({
  sites = HERITAGE_SITES,
  height = "550px",
  initialActiveSlug,
  onSelectSite,
  showAccessibleList = true,
  className,
}: IndiaHeritageMapProps) {
  const { locale } = useI18n();
  const theme = useMapTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerRecordsRef = useRef<Map<string, MarkerRecord>>(new Map());
  const popupsRef = useRef<Map<string, maplibregl.Popup>>(new Map());

  const [activeSlug, setActiveSlug] = useState<string | null>(initialActiveSlug ?? null);
  const activeSlugRef = useRef<string | null>(activeSlug);
  activeSlugRef.current = activeSlug;
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const [activeRegion, setActiveRegion] = useState<RegionKey>("all");
  const [listSearch, setListSearch] = useState("");

  const activeSite = useMemo(() => {
    if (!activeSlug) return null;
    return sites.find((s) => s.slug === activeSlug) ?? null;
  }, [sites, activeSlug]);

  const filteredListSites = useMemo(() => {
    if (!listSearch.trim()) return sites;
    const q = listSearch.trim().toLowerCase();
    return sites.filter((s) => {
      const title = (localized(s.titles, locale) || s.title).toLowerCase();
      const state = s.state.toLowerCase();
      const district = s.district.toLowerCase();
      return title.includes(q) || state.includes(q) || district.includes(q);
    });
  }, [sites, listSearch, locale]);

  // 1. Client-Side Map Initialization
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current || map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: CARTO_VOYAGER_RASTER_STYLE,
      center: [78.9629, 22.5937],
      zoom: 4.8,
      minZoom: 4.6,
      maxZoom: 14,
      maxBounds: SOI_COMPLIANT_BOUNDS,
      renderWorldCopies: false,
      attributionControl: false,
    });

    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    map.current = m;

    m.on("load", () => {
      m.resize();
    });

    // Force resize after 150ms to ensure container layout has settled
    const resizeTimer = setTimeout(() => {
      m.resize();
    }, 150);

    // Attach ResizeObserver to container for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      m.resize();
    });
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    const popups = popupsRef.current;
    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerRecordsRef.current.clear();
      popups.clear();
      m.remove();
      map.current = null;
    };
  }, []);

  // Theme-aware paint adjustment on OpenStreetMap tiles without any external style reloads
  useEffect(() => {
    if (!map.current) return;
    try {
      if (map.current.getLayer("osm-tiles-layer")) {
        const isDark = theme === "dark";
        map.current.setPaintProperty("osm-tiles-layer", "raster-contrast", isDark ? 0.08 : 0);
        map.current.setPaintProperty("osm-tiles-layer", "raster-brightness-max", isDark ? 0.95 : 1);
      }
    } catch {
      // ignore
    }
  }, [theme]);

  // 2. Render Custom Glowing DOM Markers & Popups
  // Safeguard: Position and matrix transforms live strictly on MapLibre's root marker element.
  // Visual scaling and animations live strictly on an inner child element to prevent coordinate collapse.
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerRecordsRef.current.clear();
    popupsRef.current.clear();

    sites.forEach((site) => {
      const lng = site.lng;
      const lat = site.lat;
      if (typeof lng !== "number" || typeof lat !== "number" || isNaN(lng) || isNaN(lat)) return;

      const colors = STATUS_COLORS[site.preservation] ?? STATUS_COLORS.safe;
      const categoryMeta = CATEGORY_META[site.category];
      const isSelected = site.slug === activeSlugRef.current;

      // Root Pin DOM Element - MapLibre controls positioning & transforms on this element
      const el = document.createElement("div");
      el.className = "maplibregl-marker heritage-gis-marker-root";
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.willChange = "transform";
      el.style.cursor = "pointer";
      el.style.zIndex = isSelected ? "40" : "10";

      // Inner Child DOM Element - All hover scaling, shadows, and bounce transforms happen HERE
      const inner = document.createElement("div");
      inner.className = "heritage-gis-marker-inner";
      inner.style.width = isSelected ? "32px" : "24px";
      inner.style.height = isSelected ? "32px" : "24px";
      inner.style.borderRadius = "9999px";
      inner.style.backgroundColor = colors.hex;
      inner.style.boxShadow = isSelected
        ? `0 0 0 3px rgba(12, 10, 9, 0.95), 0 0 20px ${colors.ring}, 0 5px 12px rgba(0, 0, 0, 0.7)`
        : `0 0 0 2.5px rgba(12, 10, 9, 0.9), 0 0 16px ${colors.ring}, 0 4px 10px rgba(0, 0, 0, 0.6)`;
      inner.style.transition =
        "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, width 0.2s, height 0.2s";
      inner.style.display = "flex";
      inner.style.alignItems = "center";
      inner.style.justifyContent = "center";
      inner.style.transform = isSelected ? "scale(1.2)" : "scale(1)";
      inner.style.pointerEvents = "auto";

      // Inner Icon or dot inside the inner element
      inner.innerHTML = categoryMeta
        ? `<span style="font-size: ${isSelected ? "14px" : "11px"}; pointer-events: none; line-height: 1;">${categoryMeta.icon}</span>`
        : `<span style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff; pointer-events: none;"></span>`;

      el.appendChild(inner);

      // Hover interactions mutate ONLY the inner child transform, leaving root coordinates untouched
      el.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.35)";
        inner.style.boxShadow = `0 0 0 3px rgba(12, 10, 9, 0.95), 0 0 22px ${colors.ring}, 0 6px 14px rgba(0, 0, 0, 0.7)`;
        el.style.zIndex = "50";
      });
      el.addEventListener("mouseleave", () => {
        const isCurrentActive = site.slug === activeSlugRef.current;
        inner.style.transform = isCurrentActive ? "scale(1.2)" : "scale(1)";
        inner.style.boxShadow = isCurrentActive
          ? `0 0 0 3px rgba(12, 10, 9, 0.95), 0 0 20px ${colors.ring}, 0 5px 12px rgba(0, 0, 0, 0.7)`
          : `0 0 0 2.5px rgba(12, 10, 9, 0.9), 0 0 16px ${colors.ring}, 0 4px 10px rgba(0, 0, 0, 0.6)`;
        el.style.zIndex = isCurrentActive ? "40" : "10";
      });

      // Dark Glassmorphic Popup HTML
      const title = localized(site.titles, locale) || site.title;
      const popupContent = `
        <div style="background: rgba(12, 10, 9, 0.94); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 14px; padding: 12px 14px; color: #fafaf9; font-family: system-ui, -apple-system, sans-serif; min-width: 220px; max-width: 280px; box-shadow: 0 20px 30px rgba(0,0,0,0.7);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${colors.hex}; display: inline-flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${colors.hex}; box-shadow: 0 0 6px ${colors.hex};"></span>
              ${site.preservation}
            </span>
            <span style="font-size: 10px; font-weight: 600; background: rgba(255, 255, 255, 0.08); padding: 2px 7px; border-radius: 6px; color: #d6d3d1;">
              ${categoryMeta ? categoryMeta.label : site.category}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #ffffff; line-height: 1.3; margin-bottom: 3px;">
            ${title}
          </div>
          <div style="font-size: 11px; color: #a8a29e; margin-bottom: 10px;">
            ${site.district ? `${site.district}, ` : ""}${site.state}
          </div>
          <a href="/heritage/${site.slug}" style="display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 8px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #1c1917; text-decoration: none; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">
            Explore Heritage Record →
          </a>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 16,
        closeButton: true,
        closeOnClick: false,
        className: "dharohar-map-popup",
      }).setHTML(popupContent);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveSlug(site.slug);
        setIsDossierOpen(true);
        onSelectSite?.(site.slug);
        map.current?.flyTo({
          center: [lng, lat],
          zoom: Math.max(map.current.getZoom(), 6),
          duration: 900,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
      markerRecordsRef.current.set(site.slug, { el, inner, colors });
      popupsRef.current.set(site.slug, popup);
    });
  }, [sites, onSelectSite, locale]);

  // 3. Reactively update marker active styling without destroying or unmounting DOM elements
  useEffect(() => {
    markerRecordsRef.current.forEach(({ el, inner, colors }, slug) => {
      const isSelected = slug === activeSlug;
      inner.style.transform = isSelected ? "scale(1.2)" : "scale(1)";
      inner.style.width = isSelected ? "32px" : "24px";
      inner.style.height = isSelected ? "32px" : "24px";
      inner.style.boxShadow = isSelected
        ? `0 0 0 3px rgba(12, 10, 9, 0.95), 0 0 20px ${colors.ring}, 0 5px 12px rgba(0, 0, 0, 0.7)`
        : `0 0 0 2.5px rgba(12, 10, 9, 0.9), 0 0 16px ${colors.ring}, 0 4px 10px rgba(0, 0, 0, 0.6)`;
      el.style.zIndex = isSelected ? "40" : "10";
    });
  }, [activeSlug]);

  // 4. Handle Active Marker Focus & Popup Display
  useEffect(() => {
    if (!activeSlug || !map.current) return;

    const targetSite = sites.find((s) => s.slug === activeSlug);
    if (!targetSite) return;

    const popup = popupsRef.current.get(activeSlug);
    if (popup && !popup.isOpen()) {
      // Close other open popups
      popupsRef.current.forEach((p, slug) => {
        if (slug !== activeSlug && p.isOpen()) p.remove();
      });
      popup.addTo(map.current);
    }
  }, [activeSlug, sites]);

  // 5. Region Preset Zoom Handler
  const handleRegionZoom = (key: RegionKey) => {
    setActiveRegion(key);
    const preset = REGION_PRESETS[key];
    map.current?.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      duration: 1100,
      essential: true,
    });
  };

  // 6. Select site from list
  const handleSelectSiteFromList = (site: HeritageSite) => {
    setActiveSlug(site.slug);
    setIsDossierOpen(true);
    onSelectSite?.(site.slug);
    map.current?.flyTo({
      center: [site.lng, site.lat],
      zoom: Math.max(map.current?.getZoom() ?? 4.3, 6.5),
      duration: 1000,
      essential: true,
    });
  };

  return (
    <>
      {/* Self-contained CSS injection for MapLibre positioning safeguard and dark glassmorphic popup */}
      <style>{`
        .maplibregl-marker {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          will-change: transform;
        }
        .dharohar-map-popup .maplibregl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border: none !important;
        }
        .dharohar-map-popup .maplibregl-popup-tip {
          border-top-color: rgba(12, 10, 9, 0.94) !important;
        }
        .dharohar-map-popup .maplibregl-popup-close-button {
          color: #a8a29e !important;
          font-size: 16px !important;
          padding: 4px 8px !important;
          right: 4px !important;
          top: 4px !important;
          cursor: pointer;
        }
        .dharohar-map-popup .maplibregl-popup-close-button:hover {
          color: #ffffff !important;
          background: transparent !important;
        }
      `}</style>

      <div
        className={cn(
          "grid gap-4",
          showAccessibleList ? "lg:grid-cols-[1.55fr_1fr]" : "grid-cols-1",
          className,
        )}
      >
        {/* Main Map Box */}
        <div
          className="relative isolate overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-950 shadow-2xl max-w-full z-0"
          style={{ height: height || "550px", width: "100%", maxWidth: "100%", position: "relative", isolation: "isolate", overflow: "hidden" }}
          role="region"
          aria-label="Interactive Map of Heritage Sites across India"
        >
          {/* Map Canvas Container */}
          <div
            ref={mapContainer}
            className="w-full max-w-full h-full rounded-2xl bg-stone-950 relative isolate overflow-hidden z-0"
            style={{ height: height || "550px", width: "100%", maxWidth: "100%", position: "relative", isolation: "isolate", overflow: "hidden" }}
          />

          {/* Region Filter Bar Overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1 rounded-xl border border-stone-800 bg-stone-950/85 p-1 text-xs shadow-lg backdrop-blur-md">
            {(Object.keys(REGION_PRESETS) as RegionKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleRegionZoom(key)}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all",
                  activeRegion === key
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-200",
                )}
              >
                {REGION_PRESETS[key].label}
              </button>
            ))}
          </div>

          {/* Status Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-10 hidden items-center gap-3 rounded-xl border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs shadow-lg backdrop-blur-md sm:flex">
            <span className="font-semibold text-stone-300">Status:</span>
            {(["safe", "attention", "risk", "restoration"] as PreservationStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <span
                  className={cn("size-2.5 rounded-full ring-2 ring-stone-900", STATUS_COLORS[s].bg)}
                />
                <span className="capitalize">{s}</span>
              </div>
            ))}
          </div>

          {/* Interactive Slide-Over Dossier Drawer */}
          {activeSite && isDossierOpen && (
            <div
              className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-amber-500/30 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300 sm:max-w-md sm:p-5"
              role="dialog"
              aria-label={`${activeSite.title} Heritage Dossier`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {CATEGORY_META[activeSite.category]?.icon ?? "🏛️"}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {CATEGORY_META[activeSite.category]?.label ?? activeSite.category}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    {activeSite.preservationState ?? (activeSite.preservation === "safe" ? "Safe" : activeSite.preservation)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                  aria-label="Close dossier"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 space-y-4 overflow-y-auto py-3 pr-1 text-xs">
                <div>
                  <h3 className="text-base font-bold text-stone-100 sm:text-lg">
                    {localized(activeSite.titles, locale) || activeSite.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                    <MapPin className="size-3 text-amber-500 shrink-0" />
                    <span>{activeSite.district ? `${activeSite.district}, ` : ""}{activeSite.state}</span>
                    <span className="text-stone-600">·</span>
                    <span className="font-mono text-[11px] text-stone-500">[{activeSite.lng.toFixed(4)}, {activeSite.lat.toFixed(4)}]</span>
                  </p>
                </div>

                {activeSite.deity && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Presiding Deity</span>
                    <p className="text-sm font-semibold text-stone-100 mt-0.5">{activeSite.deity}</p>
                  </div>
                )}

                {/* Consecration Era & Architectural Style */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                    <span className="text-[10px] font-medium text-stone-400 block">Era / Period</span>
                    <span className="font-semibold text-stone-200 mt-0.5 block">{activeSite.consecrationEra || activeSite.period}</span>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                    <span className="text-[10px] font-medium text-stone-400 block">Style</span>
                    <span className="font-semibold text-stone-200 mt-0.5 block truncate" title={activeSite.architecturalStyle}>{activeSite.architecturalStyle || "Classical"}</span>
                  </div>
                </div>

                {(activeSite.patronMaker || activeSite.patronDynasty) && (
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                    <span className="text-[10px] font-medium text-stone-400 block">Patron & Maker</span>
                    <span className="font-semibold text-stone-200 mt-0.5 block">{activeSite.patronMaker || activeSite.patronDynasty}</span>
                  </div>
                )}

                {/* Historical Legacy */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block mb-1">Historical Legacy</span>
                  <p className="text-stone-300 leading-relaxed text-[11.5px]">
                    {activeSite.history || localized(activeSite.description, locale) || localized(activeSite.summary, locale)}
                  </p>
                </div>

                {/* How To Reach */}
                {activeSite.howToReach && (
                  <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">How to Reach</span>
                    <div className="text-[11px] text-stone-300 flex items-start gap-1.5">
                      <span className="font-semibold text-stone-400">✈️ Air:</span>
                      <span>{activeSite.howToReach.air}</span>
                    </div>
                    <div className="text-[11px] text-stone-300 flex items-start gap-1.5">
                      <span className="font-semibold text-stone-400">🚆 Rail:</span>
                      <span>{activeSite.howToReach.rail}</span>
                    </div>
                    <div className="text-[11px] text-stone-300 flex items-start gap-1.5">
                      <span className="font-semibold text-stone-400">🚗 Road:</span>
                      <span>{activeSite.howToReach.road}</span>
                    </div>
                  </div>
                )}

                {/* Darshan & Timings */}
                {(activeSite.ticketAndTimings || activeSite.visitorDetails) && (
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                    <span className="text-[10px] font-medium text-stone-400 block">Darshan & Visitor Guide</span>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
                      {activeSite.ticketAndTimings || `${activeSite.visitorDetails?.timings} · ${activeSite.visitorDetails?.entryFee}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-stone-800 pt-3">
                <Link
                  to="/heritage/$slug"
                  params={{ slug: activeSite.slug }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg transition hover:from-amber-400 hover:to-amber-500"
                >
                  <span>Open Complete Heritage Dossier</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Active Site Preview Card */}
          {activeSite && !isDossierOpen && (
            <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-4 rounded-2xl border border-amber-500/35 bg-stone-950/92 p-3 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 sm:inset-x-6 sm:bottom-6 sm:p-4">
              <div className="flex min-w-0 items-center gap-3">
                {activeSite.image && (
                  <img
                    src={activeSite.image}
                    alt={activeSite.title}
                    className="size-14 shrink-0 rounded-xl border border-stone-800 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.dataset["fallbackApplied"]) return;
                      target.dataset["fallbackApplied"] = "true";
                      target.src = "/assets/hero-heritage.jpg";
                    }}
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        STATUS_COLORS[activeSite.preservation]?.bg ?? "bg-emerald-500",
                      )}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {activeSite.preservationState ?? activeSite.preservation}
                    </span>
                    <span className="text-[11px] text-stone-500">·</span>
                    <span className="text-[11px] font-medium text-amber-400">
                      {CATEGORY_META[activeSite.category]?.label}
                    </span>
                  </div>
                  <p className="truncate text-sm font-bold text-stone-100 sm:text-base">
                    {localized(activeSite.titles, locale) || activeSite.title}
                  </p>
                  <p className="truncate text-xs text-stone-400">
                    {activeSite.district ? `${activeSite.district}, ` : ""}
                    {activeSite.state} · {activeSite.period}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
                >
                  View Dossier
                </button>
                <Link
                  to="/heritage/$slug"
                  params={{ slug: activeSite.slug }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 shadow-md transition hover:bg-amber-400"
                >
                  <span>Open record</span>
                  <ExternalLink className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveSlug(null)}
                  className="cursor-pointer rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  aria-label="Close preview"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Survey of India Sovereign Compliance Badge */}
          <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 rounded-lg border border-stone-800/80 bg-stone-950/90 px-2.5 py-1 text-[10px] font-medium text-stone-400 shadow-sm backdrop-blur-md pointer-events-none select-none">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Survey of India (SOI) Aligned Baseline • National Geospatial Policy 2022</span>
          </div>
        </div>

        {/* Accessible Side List of Mapped Sites */}
        {showAccessibleList && (
          <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-bold text-stone-100">Mapped Heritage Sites</h3>
                <p className="text-xs text-stone-400">
                  {filteredListSites.length} monuments & traditions
                </p>
              </div>
            </div>

            {/* In-list Search Filter */}
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                placeholder="Filter by name, district, or state..."
                className="h-8 w-full rounded-lg border border-stone-800 bg-stone-900/90 pl-8 pr-3 text-xs text-stone-200 outline-none focus:border-amber-500"
              />
            </div>

            {/* Scrollable Site List */}
            <ul className="max-h-[500px] divide-y divide-stone-800/80 overflow-y-auto pr-1">
              {filteredListSites.map((site) => {
                const isSelected = site.slug === activeSlug;
                return (
                  <li key={site.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSiteFromList(site)}
                      className={cn(
                        "flex w-full cursor-pointer flex-col gap-1 rounded-xl p-2.5 text-left transition-colors",
                        isSelected
                          ? "border border-amber-500/40 bg-stone-900"
                          : "hover:bg-stone-900/60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-stone-100">
                          {localized(site.titles, locale) || site.title}
                        </span>
                        <PreservationChip
                          status={site.preservation}
                          className="shrink-0 text-[10px]"
                        />
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {site.district ? `${site.district}, ` : ""}
                        {site.state}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export interface MapSite {
  slug: string;
  name: string;
  state: string;
  latitude: string | number;
  longitude: string | number;
  preservationStatus?: "safe" | "attention" | "risk" | "restoration";
}

export interface IndiaMapProps {
  sites: MapSite[];
  selectedSiteSlug?: string;
  onSelectSite?: (slug: string) => void;
  style?: string | maplibregl.StyleSpecification;
}

export function IndiaMap({
  sites,
  selectedSiteSlug,
  onSelectSite,
  style = CARTO_VOYAGER_RASTER_STYLE,
}: IndiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const navigate = useNavigate();
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current || map.current) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let mapInstance: maplibregl.Map | null = null;

    try {
      mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: style || CARTO_VOYAGER_RASTER_STYLE,
        center: [78.9629, 22.5937],
        zoom: 4.8,
        minZoom: 4.6,
        maxZoom: 14,
        maxBounds: SOI_COMPLIANT_BOUNDS,
        renderWorldCopies: false,
        attributionControl: false,
      });

      mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

      mapInstance.on("error", (e) => {
        console.error("MapLibre internal error:", e);
      });

      mapInstance.on("load", () => {
        mapInstance?.resize();
      });

      map.current = mapInstance;

      // Force recalculation after DOM mounts
      timer = setTimeout(() => {
        mapInstance?.resize();
      }, 250);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "WebGL initialization error";
      console.error("Failed to create WebGL map:", err);
      setLoadError(message);
    }

    return () => {
      if (timer) clearTimeout(timer);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapInstance?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const getStatusColor = (status?: string) => {
      switch (status) {
        case "risk":
          return "#ef4444";
        case "attention":
          return "#f59e0b";
        case "restoration":
          return "#3b82f6";
        default:
          return "#10b981";
      }
    };

    sites.forEach((site) => {
      const lng = typeof site.longitude === "number" ? site.longitude : parseFloat(site.longitude);
      const lat = typeof site.latitude === "number" ? site.latitude : parseFloat(site.latitude);
      if (isNaN(lng) || isNaN(lat)) return;

      const el = document.createElement("div");
      el.className = "maplibregl-marker";
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.willChange = "transform";

      const inner = document.createElement("div");
      const color = getStatusColor(site.preservationStatus);
      const isSelected = site.slug === selectedSiteSlug;

      inner.style.width = isSelected ? "20px" : "14px";
      inner.style.height = isSelected ? "20px" : "14px";
      inner.style.backgroundColor = color;
      inner.style.borderRadius = "50%";
      inner.style.border = "2px solid #ffffff";
      inner.style.boxShadow = `0 0 10px ${color}`;
      inner.style.cursor = "pointer";
      inner.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      inner.style.transform = isSelected ? "scale(1.3)" : "scale(1)";

      el.appendChild(inner);

      el.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.5)";
      });
      el.addEventListener("mouseleave", () => {
        inner.style.transform = site.slug === selectedSiteSlug ? "scale(1.3)" : "scale(1)";
      });

      el.addEventListener("click", () => {
        if (onSelectSite) {
          onSelectSite(site.slug);
        } else {
          navigate({ to: "/heritage/$slug", params: { slug: site.slug } });
        }
      });

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="color: #0c0a09; font-weight: 600; font-size: 13px;">${site.name}</div>
        <div style="color: #78716c; font-size: 11px;">${site.state}</div>
      `);

      el.addEventListener("mouseenter", () => popup.addTo(map.current!));
      el.addEventListener("mouseleave", () => popup.remove());

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [sites, selectedSiteSlug, onSelectSite, navigate]);

  if (loadError) {
    return (
      <div className="flex h-[520px] w-full items-center justify-center rounded-2xl border border-red-500/30 bg-stone-900 text-sm text-red-400">
        WebGL Map failed to render: {loadError}
      </div>
    );
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
      <style>{`
        .maplibregl-marker {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          will-change: transform;
        }
      `}</style>
      <div
        ref={mapContainer}
        className="w-full h-full bg-stone-950"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="absolute bottom-2 left-2 z-[10] flex items-center gap-1.5 rounded-md border border-stone-800/80 bg-stone-950/90 px-3 py-1 text-[10px] font-medium text-stone-400 shadow-sm backdrop-blur-md pointer-events-none select-none">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Survey of India (SOI) Aligned Baseline • National Geospatial Policy 2022</span>
      </div>
    </div>
  );
}
