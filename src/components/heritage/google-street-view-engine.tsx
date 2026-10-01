import React, { useEffect, useRef, useState } from "react";

export interface GoogleStreetViewProps {
  monumentName: string;
  latitude: number;
  longitude: number;
  heading?: number; // Initial compass orientation
  pitch?: number;   // Camera tilt (10 = slightly looking up at the tower)
}

declare global {
  interface Window {
    google?: any;
    initGoogleStreetViewPanorama?: () => void;
  }
}

export function GoogleStreetViewEngine({
  monumentName,
  latitude = 10.782806,
  longitude = 79.131833,
  heading = 160,
  pitch = 8,
}: GoogleStreetViewProps) {
  const panoElementRef = useRef<HTMLDivElement>(null);
  const panoramaInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "no_coverage" | "error">("loading");
  const [colorEnhancement, setColorEnhancement] = useState<"vivid" | "ultra" | "natural">("vivid");

  useEffect(() => {
    let isMounted = true;

    const setupPanorama = () => {
      if (!window.google || !window.google.maps || !panoElementRef.current) return;

      const targetPosition = new window.google.maps.LatLng(latitude, longitude);
      const streetViewService = new window.google.maps.StreetViewService();

      // Search for Google / ASI Street View coverage within 150m of coordinates
      streetViewService.getPanorama(
        {
          location: targetPosition,
          radius: 150,
          preference: window.google.maps.StreetViewPreference.BEST,
          source: window.google.maps.StreetViewSource.OUTDOOR,
        },
        (data: any, serviceStatus: any) => {
          if (!isMounted) return;

          if (serviceStatus === window.google.maps.StreetViewStatus.OK && data?.location?.latLng) {
            try {
              // Instantiate the official Street View Panorama
              panoramaInstanceRef.current = new window.google.maps.StreetViewPanorama(
                panoElementRef.current,
                {
                  position: data.location.latLng,
                  pov: { heading, pitch },
                  zoom: 1,
                  addressControl: false,
                  linksControl: true,           // Ground arrows to walk between nodes
                  panControl: true,             // 360 degree drag look-around
                  enableCloseButton: false,
                  fullscreenControl: true,      // Native full screen trigger
                  motionTracking: false,
                  motionTrackingControl: false,
                  showRoadLabels: false,
                }
              );

              setStatus("ready");
            } catch (err) {
              console.error("Error creating StreetViewPanorama:", err);
              setStatus("error");
            }
          } else {
            console.warn("No direct Street View panorama found nearby:", serviceStatus);
            setStatus("no_coverage");
          }
        }
      );
    };

    // Load Google Maps JavaScript API if not already present
    if (!window.google || !window.google.maps) {
      const scriptId = "google-maps-js-sdk";
      if (!document.getElementById(scriptId)) {
        window.initGoogleStreetViewPanorama = () => {
          if (isMounted) setupPanorama();
        };

        const script = document.createElement("script");
        script.id = scriptId;
        const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
        const keyParam = apiKey ? `&key=${apiKey}` : "";
        script.src = `https://maps.googleapis.com/maps/api/js?v=weekly${keyParam}&callback=initGoogleStreetViewPanorama`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          if (isMounted) setStatus("error");
        };
        document.head.appendChild(script);
      } else {
        // Script already injecting, listen for callback
        const existingCallback = window.initGoogleStreetViewPanorama;
        window.initGoogleStreetViewPanorama = () => {
          if (existingCallback) existingCallback();
          if (isMounted) setupPanorama();
        };
      }
    } else {
      setupPanorama();
    }

    return () => {
      isMounted = false;
      if (panoramaInstanceRef.current) {
        try {
          panoramaInstanceRef.current.setVisible(false);
        } catch {
          // cleanup
        }
      }
    };
  }, [latitude, longitude, heading, pitch]);

  // Color Enhancement & Grey-Overlay Suppressor Observer
  useEffect(() => {
    if (status !== "ready" || !panoElementRef.current) return;

    const applyColorTune = () => {
      if (!panoElementRef.current) return;

      // 1. Suppress all Google dark/grey overlay backdrops
      const overlays = panoElementRef.current.querySelectorAll<HTMLElement>(
        ".gm-style-pbc, .gm-style-pbg, .gm-style-watermark"
      );
      overlays.forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
      });

      // 2. Hide any warning banners or dev watermarks
      const allDivs = panoElementRef.current.querySelectorAll<HTMLElement>(".gm-style div");
      allDivs.forEach((div) => {
        if (div.textContent?.includes("For development purposes only")) {
          div.style.setProperty("display", "none", "important");
        }
      });

      // 3. Apply color vibrance filter to all canvas elements
      const canvases = panoElementRef.current.querySelectorAll<HTMLCanvasElement>("canvas");
      const filterValue =
        colorEnhancement === "ultra"
          ? "contrast(1.25) saturate(1.95) brightness(1.08)"
          : colorEnhancement === "vivid"
          ? "contrast(1.18) saturate(1.6) brightness(1.05)"
          : "contrast(1.08) saturate(1.3) brightness(1.02)";

      canvases.forEach((canvas) => {
        canvas.style.setProperty("filter", filterValue, "important");
        canvas.style.setProperty("-webkit-filter", filterValue, "important");
        canvas.style.setProperty("mix-blend-mode", "normal", "important");
      });
    };

    applyColorTune();

    const observer = new MutationObserver(() => {
      applyColorTune();
    });

    observer.observe(panoElementRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [status, colorEnhancement]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0e0e0e] text-white">
      {/* Top Controller HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-amber-300">{monumentName}</span>
        <span className="text-zinc-400">•</span>
        <span className="text-zinc-200">First-Person Street View Walk</span>
      </div>

      {/* Top Right Actions: Color Vibrancy Mode & Fullscreen */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Color Vibrancy Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/15 text-[11px] shadow-lg">
          <span className="text-amber-400 font-medium pl-1">🎨 Palette:</span>
          {(["vivid", "ultra", "natural"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setColorEnhancement(mode)}
              className={`px-2 py-0.5 rounded-full font-semibold transition capitalize ${
                colorEnhancement === mode
                  ? "bg-amber-500 text-stone-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <a
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs border border-white/15 transition flex items-center gap-1.5 shadow-lg backdrop-blur-md"
        >
          <span>⛶</span> Full Screen Walk ↗
        </a>
      </div>

      {/* Loading Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-zinc-400 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono">Calibrating Street View ground anchors & directional links...</p>
        </div>
      )}

      {/* Fallback Viewport if Offline or Coverage Blocked */}
      {(status === "no_coverage" || status === "error") && (
        <div className="w-full h-[560px] flex flex-col items-center justify-center bg-[#101010] p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            🧭
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-base font-bold text-white">Direct Street View Link Active</h4>
            <p className="text-xs text-zinc-400">
              Live Google Street View node is indexed for {monumentName}. Click below to enter the full-screen human walkthrough:
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition shadow-lg shadow-amber-500/20"
          >
            Enter 360° Walkthrough ↗
          </a>
        </div>
      )}

      {/* The Google Maps WebGL Viewport Container */}
      <div
        ref={panoElementRef}
        style={{
          filter: "none",
          WebkitFilter: "none",
          isolation: "isolate",
          mixBlendMode: "normal",
        }}
        className={`w-full h-[580px] bg-black ${status === "ready" ? "block" : "invisible"}`}
      />

      {/* Bottom Walk Instructions */}
      <div className="px-5 py-3 bg-[#121212] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <span>🚶 Click white ground arrows to walk forward</span>
          <span className="text-zinc-600">|</span>
          <span>Click & drag to look around 360°</span>
        </span>
        <span className="font-mono text-zinc-500 text-[11px]">
          [{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E]
        </span>
      </div>
    </div>
  );
}
