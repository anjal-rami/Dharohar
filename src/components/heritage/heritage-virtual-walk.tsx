import React, { useState, useEffect, useRef } from "react";
import { Compass, Footprints, Layers, Sparkles } from "lucide-react";

// Multi-scene constellation definition for Brihadisvara Temple
export const TOUR_SCENES: Record<
  string,
  {
    title: string;
    image: string;
    pitch: number;
    yaw: number;
    hfov: number;
    hotSpots: Array<{
      pitch: number;
      yaw: number;
      type: "scene" | "info";
      text: string;
      targetScene?: string;
    }>;
  }
> = {
  courtyard: {
    title: "Outer Courtyard & Great Vimana Tower",
    image: "/panoramas/brihadisvara_courtyard.jpg",
    pitch: 10,
    yaw: 160,
    hfov: 110,
    hotSpots: [
      {
        pitch: -12,
        yaw: 155,
        type: "scene",
        text: "🚶 Walk Forward to Pillared Mandapa",
        targetScene: "mandapa",
      },
      {
        pitch: 28,
        yaw: 162,
        type: "info",
        text: "🏛️ 216-ft Granite Vimana (Single 80-tonne capstone apex)",
      },
    ],
  },
  mandapa: {
    title: "Chola Pillared Mandapa & Nandi Pavilion",
    image: "/panoramas/brihadisvara_mandapa.jpg",
    pitch: 0,
    yaw: 0,
    hfov: 100,
    hotSpots: [
      {
        pitch: -10,
        yaw: 180,
        type: "scene",
        text: "🚶 Step Back into Main Courtyard",
        targetScene: "courtyard",
      },
      {
        pitch: 5,
        yaw: 45,
        type: "info",
        text: "🐂 Monolithic Nandi (Carved from a single granite block)",
      },
    ],
  },
};

declare global {
  interface Window {
    pannellum?: any;
  }
}

export interface HeritageVirtualWalkProps {
  monumentName?: string | undefined;
  className?: string | undefined;
}

export function HeritageVirtualWalk({
  monumentName = "Brihadisvara Temple, Thanjavur",
  className = "",
}: HeritageVirtualWalkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSceneId, setCurrentSceneId] = useState("courtyard");
  const viewerRef = useRef<any>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isLoadingScene, setIsLoadingScene] = useState(true);

  // 1. Dynamically inject lightweight Pannellum assets
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cssId = "pannellum-css";
    const jsId = "pannellum-js";

    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById(jsId)) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      script.onload = () => setIsEngineReady(true);
      document.body.appendChild(script);
    } else if (window.pannellum) {
      setIsEngineReady(true);
    }
  }, []);

  // 2. Initialize the Pannellum Tour Engine
  useEffect(() => {
    if (!isEngineReady || !containerRef.current || !window.pannellum) return;

    try {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }

      const scenesConfig: Record<string, any> = {};
      Object.entries(TOUR_SCENES).forEach(([key, scene]) => {
        scenesConfig[key] = {
          title: scene.title,
          type: "equirectangular",
          panorama: scene.image,
          pitch: scene.pitch,
          yaw: scene.yaw,
          hfov: scene.hfov,
          hotSpots: scene.hotSpots.map((hs) => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: hs.type,
            text: hs.text,
            sceneId: hs.targetScene,
            clickHandlerFunc: hs.targetScene
              ? () => {
                  setCurrentSceneId(hs.targetScene!);
                }
              : undefined,
          })),
        };
      });

      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        default: {
          firstScene: currentSceneId,
          sceneFadeDuration: 800, // Smooth optical cross-fade
          autoLoad: true,
          compass: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          mouseZoom: true,
        },
        scenes: scenesConfig,
      });

      viewerRef.current.on("load", () => {
        setIsLoadingScene(false);
      });
      viewerRef.current.on("scenechange", (sceneId: string) => {
        setCurrentSceneId(sceneId);
        setIsLoadingScene(false);
      });
    } catch (err) {
      console.error("Failed to initialize Pannellum tour:", err);
      setIsLoadingScene(false);
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // cleanup
        }
      }
    };
  }, [isEngineReady]);

  // Handle switching scene programmatically if state changes
  const switchScene = (sceneId: string) => {
    if (viewerRef.current && TOUR_SCENES[sceneId]) {
      setIsLoadingScene(true);
      viewerRef.current.loadScene(sceneId);
      setCurrentSceneId(sceneId);
    }
  };

  const currentScene = TOUR_SCENES[currentSceneId];

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0e0e0e] text-white ${className}`}>
      {/* Top HUD Controller */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs shadow-lg pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-amber-300">{monumentName}</span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-200 font-medium">{currentScene?.title}</span>
      </div>

      {/* Scene Navigation Quick-Switcher Pills */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {Object.entries(TOUR_SCENES).map(([key]) => (
          <button
            key={key}
            type="button"
            onClick={() => switchScene(key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition shadow-md ${
              currentSceneId === key
                ? "bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-amber-500/20"
                : "bg-black/60 text-zinc-300 border-white/10 hover:bg-black/90 hover:text-white"
            }`}
          >
            {key === "courtyard" ? "📍 Outer Courtyard" : "🏛️ Pillared Mandapa"}
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {(!isEngineReady || isLoadingScene) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm space-y-3 pointer-events-none">
          <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-stone-300">
            {isEngineReady ? "Transitioning to 360° Scene…" : "Initializing Photogrammetric Walk Engine…"}
          </p>
          <p className="text-[11px] text-stone-500">
            {currentScene?.title}
          </p>
        </div>
      )}

      {/* Main 360° WebGL Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[580px] bg-[#0a0a0a] cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Walk Instructions */}
      <div className="px-5 py-3 bg-[#121212] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
        <span className="flex items-center gap-2">
          <Footprints className="size-3.5 text-amber-400" />
          <span>Click circular ground targets / arrows to walk between locations</span>
          <span className="text-zinc-600">|</span>
          <span>Drag to look around 360°</span>
        </span>
        <span className="text-amber-400/90 font-mono text-[11px] flex items-center gap-1">
          <Sparkles className="size-3" />
          Self-Hosted WebGL Photogrammetric Walk &bull; Pannellum Engine
        </span>
      </div>
    </div>
  );
}
