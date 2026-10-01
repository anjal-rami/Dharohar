import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "@tanstack/react-router";
import {
  CARTO_VOYAGER_RASTER_STYLE,
  SOI_COMPLIANT_BOUNDS,
} from "./india-map";

export interface MapSite {
  slug: string;
  name?: string;
  title?: string;
  state: string;
  latitude?: string | number;
  longitude?: string | number;
  lat?: number;
  lng?: number;
  preservationStatus?: "safe" | "attention" | "risk" | "restoration";
  preservation?: "safe" | "attention" | "risk" | "restoration";
}

export interface IndiaMapLibreProps {
  sites: MapSite[];
  selectedSiteSlug?: string;
  onSelectSite?: (slug: string) => void;
  trailCoordinates?: [number, number][]; // Optional line path for trails: [lng, lat][]
  style?: string | maplibregl.StyleSpecification;
}

const OSM_RASTER_FALLBACK: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function IndiaMapLibre({
  sites,
  selectedSiteSlug,
  onSelectSite,
  trailCoordinates,
  style = CARTO_VOYAGER_RASTER_STYLE,
}: IndiaMapLibreProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const navigate = useNavigate();

  // 1. Initialize Map centered over India
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style || CARTO_VOYAGER_RASTER_STYLE,
      center: [78.9629, 22.5937], // India center coordinates
      zoom: 4.8,
      minZoom: 4.6,
      maxZoom: 12,
      maxBounds: SOI_COMPLIANT_BOUNDS,
      renderWorldCopies: false,
    });

    map.current.once("error", (e) => {
      const msg = e?.error?.message || "";
      if (msg.includes("style") || msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        try {
          map.current?.setStyle(OSM_RASTER_FALLBACK);
        } catch {
          // ignore
        }
      }
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    map.current.on("load", () => {
      map.current?.resize();
    });

    // Force resize after 150ms to ensure container layout has settled
    const resizeTimer = setTimeout(() => {
      map.current?.resize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // 2. Reactively Add or Update Trail Layer when trailCoordinates change
  useEffect(() => {
    if (!map.current) return;
    const currentMap = map.current;

    const updateTrail = () => {
      if (!currentMap.isStyleLoaded()) return;

      const source = currentMap.getSource("trail-route") as maplibregl.GeoJSONSource | undefined;
      const coords = trailCoordinates && trailCoordinates.length > 1 ? trailCoordinates : [];

      const geojson = {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates: coords,
        },
      };

      if (source) {
        source.setData(geojson);
      } else if (coords.length > 1) {
        currentMap.addSource("trail-route", {
          type: "geojson",
          data: geojson,
        });

        if (!currentMap.getLayer("trail-line")) {
          currentMap.addLayer({
            id: "trail-line",
            type: "line",
            source: "trail-route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#f59e0b", // amber-500
              "line-width": 4,
              "line-dasharray": [2, 2],
            },
          });
        }
      }

      if (coords.length > 1) {
        const bounds = coords.reduce(
          (acc, coord) => acc.extend(coord),
          new maplibregl.LngLatBounds(coords[0], coords[0]),
        );
        currentMap.fitBounds(bounds, { padding: 60, maxZoom: 8 });
      }
    };

    if (currentMap.isStyleLoaded()) {
      updateTrail();
    } else {
      currentMap.once("load", updateTrail);
    }
  }, [trailCoordinates]);

  // 3. Render Custom HTML Markers for Sites
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const getStatusColor = (status?: string) => {
      switch (status) {
        case "risk":
          return "bg-red-500 ring-red-400/40";
        case "attention":
          return "bg-amber-500 ring-amber-400/40";
        case "restoration":
          return "bg-blue-500 ring-blue-400/40";
        default:
          return "bg-emerald-500 ring-emerald-400/40";
      }
    };

    sites.forEach((site) => {
      const rawLng = site.longitude ?? site.lng;
      const rawLat = site.latitude ?? site.lat;
      const lng = typeof rawLng === "number" ? rawLng : parseFloat(rawLng || "");
      const lat = typeof rawLat === "number" ? rawLat : parseFloat(rawLat || "");
      if (isNaN(lng) || isNaN(lat)) return;

      const status = site.preservationStatus || site.preservation;
      const displayName = site.name || site.title || site.slug;

      const el = document.createElement("div");
      el.className = "maplibregl-marker";
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.willChange = "transform";

      const inner = document.createElement("div");
      const isSelected = site.slug === selectedSiteSlug;
      inner.className = `w-4 h-4 rounded-full ${getStatusColor(status)} ring-4 cursor-pointer transition-transform hover:scale-150 ${
        isSelected ? "scale-150 ring-8 ring-amber-300" : ""
      }`;
      el.appendChild(inner);

      // Popup
      const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="color: #1c1917; font-family: sans-serif; padding: 4px;">
          <strong style="font-size: 13px; display: block;">${displayName}</strong>
          <span style="font-size: 11px; color: #78716c;">${site.state}</span>
          <div style="margin-top: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${
            status === "risk" ? "#dc2626" : "#16a34a"
          };">
            ● Status: ${status || "safe"}
          </div>
        </div>
      `);

      el.addEventListener("click", () => {
        if (onSelectSite) {
          onSelectSite(site.slug);
        } else {
          navigate({ to: "/heritage/$slug", params: { slug: site.slug } });
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [sites, selectedSiteSlug, onSelectSite, navigate]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-stone-950 shadow-2xl"
      style={{ height: "550px", width: "100%", position: "relative" }}
    >
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
        className="w-full h-full rounded-2xl bg-stone-950"
        style={{ height: "550px", width: "100%", position: "relative" }}
      />

      {/* Preservation Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-950/85 px-3.5 py-2.5 text-xs backdrop-blur-md">
        <span className="font-medium text-stone-300">Site Status:</span>
        <div className="flex items-center gap-1.5 text-stone-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Safe
        </div>
        <div className="flex items-center gap-1.5 text-stone-400">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Attention
        </div>
        <div className="flex items-center gap-1.5 text-stone-400">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Risk
        </div>
      </div>

      {/* Survey of India Sovereign Compliance Badge */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 rounded-lg border border-stone-800/80 bg-stone-950/90 px-3 py-1.5 text-[10px] font-medium text-stone-400 shadow-sm backdrop-blur-md pointer-events-none select-none">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Survey of India (SOI) Aligned Baseline • National Geospatial Policy 2022</span>
      </div>
    </div>
  );
}
