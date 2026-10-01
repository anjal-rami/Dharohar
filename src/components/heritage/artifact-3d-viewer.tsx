import React, { useEffect, useState, useRef } from "react";
import {
  RotateCw,
  ZoomIn,
  Maximize2,
  Minimize2,
  AlertCircle,
  Smartphone,
  Info,
  X,
  Compass,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { getModelManifestForSite, type ArtifactHotspot, type ModelManifestEntry } from "@/lib/models-manifest";

export interface Artifact3DViewerProps {
  modelUrl?: string | undefined;
  siteSlug?: string | undefined;
  artifactName?: string | undefined;
  historicalPeriod?: string | undefined;
  provenance?: string | undefined;
  institution?: string | undefined;
  hotspots?: ArtifactHotspot[] | undefined;
  iosSrc?: string | undefined;
}

export function Artifact3DViewer({
  modelUrl: propModelUrl,
  siteSlug,
  artifactName: propArtifactName,
  historicalPeriod: propHistoricalPeriod,
  provenance: propProvenance,
  institution: propInstitution,
  hotspots: propHotspots,
  iosSrc,
}: Artifact3DViewerProps) {
  // Resolve from models manifest dynamically using siteSlug
  const manifestData: ModelManifestEntry = getModelManifestForSite(siteSlug);

  const finalModelUrl = propModelUrl || manifestData.modelUrl;
  const finalTitle = propArtifactName || manifestData.title;
  const finalPeriod = propHistoricalPeriod || manifestData.periodAndMaterial;
  const finalProvenance = propProvenance || manifestData.provenance;
  const finalInstitution = propInstitution || manifestData.institution || "Archaeological Survey of India (ASI)";
  const finalHotspots = propHotspots && propHotspots.length > 0 ? propHotspots : (manifestData.hotspots ?? []);

  const [isClient, setIsClient] = useState(false);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<ArtifactHotspot | null>(null);
  const [showProvenanceDrawer, setShowProvenanceDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Dynamically load Google Model Viewer only in browser runtime (SSR safe)
    import("@google/model-viewer")
      .then(() => {
        setModelViewerLoaded(true);
      })
      .catch((err) => {
        console.warn("Failed to load @google/model-viewer module:", err);
        setError("3D Model Viewer is not supported in this browser environment.");
        setLoading(false);
      });
  }, []);

  // Listen to model-viewer load events
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const handleLoad = () => {
      setLoading(false);
      setError(null);
    };

    const handleError = (e: any) => {
      console.warn("Model-viewer asset load error:", e);
      // Fallback seamlessly if specific model fails
      if (!finalModelUrl.includes("default_heritage_relic.glb")) {
        mv.src = "/models/default_heritage_relic.glb";
      } else {
        setError("Unable to render 3D relic model.");
        setLoading(false);
      }
    };

    mv.addEventListener("load", handleLoad);
    mv.addEventListener("error", handleError);

    return () => {
      mv.removeEventListener("load", handleLoad);
      mv.removeEventListener("error", handleError);
    };
  }, [modelViewerLoaded, finalModelUrl]);

  // Fullscreen toggle
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

  // Reset 3D view orientation
  const resetCamera = () => {
    const mv = modelViewerRef.current;
    if (mv) {
      mv.cameraOrbit = "0deg 75deg 105%";
      mv.fieldOfView = "auto";
      setSelectedHotspot(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group/viewer relative w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-[#0d0d0d] shadow-2xl transition-all ${
        isFullscreen ? "h-screen rounded-none" : "h-[480px] sm:h-[540px]"
      }`}
    >
      {/* 1. Archaeological Provenance Header Badge */}
      <div className="absolute top-4 left-4 z-20 max-w-[85%] sm:max-w-md bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-stone-800/90 shadow-xl text-left pointer-events-auto">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase font-semibold">
            Photogrammetric Relic Inspector
          </span>
          <span className="text-stone-600">•</span>
          <span className="text-[10px] text-stone-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> ASI Verified
          </span>
        </div>

        <h3 className="text-stone-100 font-bold text-sm sm:text-base leading-snug">
          {finalTitle}
        </h3>
        <p className="text-amber-300/90 text-xs font-medium tracking-wide mt-0.5">
          {finalPeriod}
        </p>

        {finalProvenance && (
          <button
            type="button"
            onClick={() => setShowProvenanceDrawer((prev) => !prev)}
            className="mt-2 flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition underline-offset-2 hover:underline"
          >
            <Info className="w-3 h-3" />
            <span>{showProvenanceDrawer ? "Hide Epigraphical Notes" : "View Archaeological Dossier"}</span>
          </button>
        )}
      </div>

      {/* 2. Top Right Quick Actions (Fullscreen, Reset Camera) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={resetCamera}
          title="Reset Camera View"
          className="flex size-9 items-center justify-center rounded-xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition shadow-lg"
        >
          <Compass className="size-4 text-amber-400" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Inspector"}
          className="flex size-9 items-center justify-center rounded-xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>

      {/* 3. Provenance & Epigraphical Dossier Drawer */}
      {showProvenanceDrawer && finalProvenance && (
        <div className="absolute top-24 left-4 z-30 max-w-sm sm:max-w-md rounded-xl border border-amber-500/30 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Archaeological Provenance & Records</span>
            </div>
            <button
              type="button"
              onClick={() => setShowProvenanceDrawer(false)}
              className="text-stone-400 hover:text-stone-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {finalProvenance}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-900 flex items-center justify-between text-[11px] text-stone-400">
            <span>Repository:</span>
            <span className="text-amber-300/90 font-medium">{finalInstitution}</span>
          </div>
        </div>
      )}

      {/* 4. Interactive Callout Details Card (Revealed on hotspot click) */}
      {selectedHotspot && (
        <div className="absolute bottom-16 sm:bottom-6 left-4 right-4 sm:left-4 sm:right-auto sm:max-w-md z-30 rounded-xl border border-amber-500/40 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
                Archaeological Callout
              </span>
              <h4 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400" />
                {selectedHotspot.label}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-stone-800/60 transition"
              aria-label="Close Callout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-300 leading-relaxed">
            {selectedHotspot.description}
          </p>
        </div>
      )}

      {/* 5. Bottom Controls Helper Bar */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-800 text-stone-400 text-xs shadow-lg">
        <span className="flex items-center gap-1.5 text-stone-300">
          <RotateCw className="w-3.5 h-3.5 text-amber-400" /> Drag to rotate
        </span>
        <span className="text-stone-700">•</span>
        <span className="flex items-center gap-1.5 text-stone-300">
          <ZoomIn className="w-3.5 h-3.5 text-amber-400" /> Pinch / Scroll to zoom
        </span>
        {finalHotspots.length > 0 && (
          <>
            <span className="text-stone-700">•</span>
            <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
              <span className="size-2 rounded-full bg-amber-400 animate-ping" /> Click pins for callouts
            </span>
          </>
        )}
      </div>

      {/* 6. Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0d0d]/90 text-stone-300 gap-3 backdrop-blur-sm">
          <div className="relative flex size-12 items-center justify-center">
            <span className="absolute size-12 rounded-full border-2 border-amber-500/20 animate-ping" />
            <RotateCw className="size-6 text-amber-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium tracking-wider uppercase text-amber-300">
              Loading Photogrammetric Relic...
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              High-fidelity PBR metallic alloy shader initialization
            </p>
          </div>
        </div>
      )}

      {/* 7. Error State */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0d0d] text-stone-300 gap-2 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-400" />
          <h4 className="text-sm font-semibold text-stone-200">Photogrammetry Stream Offline</h4>
          <p className="text-xs text-stone-400 max-w-sm">{error}</p>
        </div>
      )}

      {/* 8. WebXR / AR Model-Viewer Container */}
      {isClient && modelViewerLoaded && (
        <model-viewer
          ref={modelViewerRef}
          src={finalModelUrl}
          ios-src={iosSrc}
          alt={finalTitle}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          auto-rotate
          auto-rotate-delay="2500"
          rotation-per-second="18deg"
          shadow-intensity="1"
          shadow-softness="0.8"
          environment-image="neutral"
          exposure="1.0"
          touch-action="pan-y"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#0d0d0d",
            outline: "none",
          }}
        >
          {/* Slotted AR Button */}
          <button
            slot="ar-button"
            className="absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-600/90 to-amber-500/90 px-4 py-2 font-medium text-stone-950 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md transition hover:scale-105 hover:from-amber-500 hover:to-amber-400 active:scale-95"
          >
            <Smartphone className="size-4 text-stone-950" />
            <span>📱 AR Tabletop Demo</span>
          </button>

          {/* Slotted Interactive Hotspot Pins */}
          {finalHotspots.map((hotspot) => {
            const isSelected = selectedHotspot?.name === hotspot.name;
            return (
              <button
                key={hotspot.name}
                slot={`hotspot-${hotspot.name}`}
                data-position={hotspot.position}
                data-normal={hotspot.normal || "0 0 1"}
                onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
                className="group/pin relative flex size-7 cursor-pointer items-center justify-center p-0 bg-transparent border-none outline-none transition-transform hover:scale-125 focus:scale-125 pointer-events-auto"
                aria-label={hotspot.label}
              >
                {/* Outer Ping */}
                <span
                  className={`absolute size-5 rounded-full ${
                    isSelected ? "bg-amber-400/80 animate-ping" : "bg-amber-400/40"
                  }`}
                />

                {/* Core Pin Center */}
                <span
                  className={`relative flex size-4 items-center justify-center rounded-full border shadow-xl transition-all ${
                    isSelected
                      ? "bg-amber-300 border-white text-stone-950 scale-110"
                      : "bg-amber-500 border-stone-900 text-stone-950 hover:bg-amber-400"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-stone-950" />
                </span>

                {/* Hover Label Preview */}
                {!isSelected && (
                  <span className="pointer-events-none absolute bottom-full mb-1.5 whitespace-nowrap rounded-md bg-stone-900/95 px-2 py-0.5 text-[10px] font-medium text-stone-200 opacity-0 shadow-lg border border-stone-800 backdrop-blur-md transition-opacity group-hover/pin:opacity-100">
                    {hotspot.label}
                  </span>
                )}
              </button>
            );
          })}
        </model-viewer>
      )}
    </div>
  );
}

export class Artifact3DErrorBoundary extends React.Component<
  { children: React.ReactNode; artifactName?: string | null | undefined },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; artifactName?: string | null | undefined }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn("Artifact3DErrorBoundary captured error safely:", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="relative h-[480px] w-full flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-[#0d0d0d] p-6 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <AlertCircle className="size-6" />
          </div>
          <h4 className="text-sm font-semibold text-stone-100">
            {this.props.artifactName || "3D Relic"}
          </h4>
          <p className="mt-1 text-xs text-stone-400">
            3D rendering is currently unsupported or unavailable on this device.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
