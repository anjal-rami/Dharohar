import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Compass,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Smartphone,
  Info,
  Sparkles,
  MapPin,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PanoramaHotspot {
  id: string;
  title: string;
  description: string;
  tag?: string;
  // Spherical coordinates: yaw (-180 to 180 deg) and pitch (-85 to 85 deg)
  yaw: number;
  pitch: number;
}

export interface PanoramaViewerProps {
  panoramaUrl: string;
  fallbackUrl?: string;
  title?: string;
  location?: string;
  hotspots?: PanoramaHotspot[];
  className?: string;
  height?: string | number;
  initialFov?: number;
}

const DEFAULT_HOTSPOTS: PanoramaHotspot[] = [
  {
    id: "spot-1",
    title: "Sanctum Sanctorum (Garbhagriha)",
    description: "Sacred monolithic architectural axis aligned with solar equinox shadows.",
    tag: "Core Architecture",
    yaw: 25,
    pitch: 5,
  },
  {
    id: "spot-2",
    title: "Acoustic Whispering Corridor",
    description: "Vedic resonance gallery designed for harmonic echo damping and chanting.",
    tag: "Acoustic Science",
    yaw: -110,
    pitch: -8,
  },
  {
    id: "spot-3",
    title: "Carved Monolithic Lotus Ceiling",
    description: "Intricately hand-chiseled single-stone inverted lotus medallion.",
    tag: "Relief Inscription",
    yaw: -40,
    pitch: 42,
  },
];

export function PanoramaViewer({
  panoramaUrl,
  fallbackUrl = "/assets/hero-heritage.jpg",
  title = "360° Monument Sanctuary",
  location = "Protected Archaeological Site",
  hotspots,
  className = "",
  height = "520px",
  initialFov = 75,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [gyroActive, setGyroActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fov, setFov] = useState(initialFov);
  const [activeHotspot, setActiveHotspot] = useState<PanoramaHotspot | null>(null);
  const [compassHeading, setCompassHeading] = useState("N");

  // Interaction coordinates (damping/inertia)
  const isUserInteractingRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const fovRef = useRef(initialFov);

  // Gyroscope tracking
  const gyroRef = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);

  // Projected 2D hotspot markers for DOM rendering
  const [projectedHotspots, setProjectedHotspots] = useState<
    Array<{
      hotspot: PanoramaHotspot;
      x: number;
      y: number;
      visible: boolean;
    }>
  >([]);

  const activeHotspotsList = hotspots && hotspots.length > 0 ? hotspots : DEFAULT_HOTSPOTS;

  // Calculate compass cardinal direction from longitude
  const updateCompass = (lon: number) => {
    let normalized = ((-lon % 360) + 360) % 360;
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(normalized / 45) % 8;
    setCompassHeading(directions[index] || "N");
  };

  // 1. Initialise Three.js Scene, Sphere & Controls
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    setLoading(true);
    setError(null);

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    cameraRef.current = camera;

    // Renderer setup with safe WebGL detection and try-catch
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        throw new Error("WebGL context creation returned null or is unsupported.");
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current = renderer;
    } catch (glError) {
      console.warn("WebGL initialization failed for PanoramaViewer:", glError);
      setError("WebGL 3D graphics are unavailable in your current browser session. Showing verified photograph.");
      setLoading(false);
      return;
    }

    // Equirectangular Sphere Geometry (radius 500, inverted with scale -1, 1, 1)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Texture Loader with fallback handling
    const textureLoader = new THREE.TextureLoader();
    let currentTexture: THREE.Texture | null = null;

    const applyTexture = (url: string, isFallback = false) => {
      textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          currentTexture = tex;
          textureRef.current = tex;

          const material = new THREE.MeshBasicMaterial({ map: tex });
          const sphereMesh = new THREE.Mesh(geometry, material);
          sphereMeshRef.current = sphereMesh;
          scene.add(sphereMesh);

          setLoading(false);
          if (isFallback) {
            setError("Live panorama asset unavailable. Loaded high-resolution verified view.");
          }
        },
        undefined,
        (err) => {
          if (!isFallback && fallbackUrl) {
            console.warn("Primary panorama failed, falling back to:", fallbackUrl);
            applyTexture(fallbackUrl, true);
          } else {
            console.error("Panorama texture failed:", err);
            setError("Unable to load panoramic texture.");
            setLoading(false);
          }
        },
      );
    };

    applyTexture(panoramaUrl);

    // 2. Animation & Projection Render Loop
    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      // Auto-rotation when user is idle
      if (autoRotate && !isUserInteractingRef.current && !gyroActive) {
        targetLonRef.current += 0.08;
      }

      // Smooth inertia damping
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.08;
      latRef.current += (targetLatRef.current - latRef.current) * 0.08;

      // Clamp latitude to avoid pole gimbal lock
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      updateCompass(lonRef.current);

      // 3. Project 3D Hotspot Coordinates onto 2D DOM overlay
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);

      const projected = activeHotspotsList.map((spot) => {
        // Convert spherical yaw/pitch to 3D point on radius 480
        const spotPhi = THREE.MathUtils.degToRad(90 - spot.pitch);
        const spotTheta = THREE.MathUtils.degToRad(spot.yaw);

        const spotPos = new THREE.Vector3(
          480 * Math.sin(spotPhi) * Math.cos(spotTheta),
          480 * Math.cos(spotPhi),
          480 * Math.sin(spotPhi) * Math.sin(spotTheta),
        );

        // Check if hotspot is facing the camera view frustum
        const dot = spotPos.clone().normalize().dot(cameraDir);
        const isFacing = dot > 0.45;

        // Project 3D to normalized device coords [-1, 1]
        const projectedVec = spotPos.clone().project(camera);

        const screenX = (projectedVec.x * 0.5 + 0.5) * containerW;
        const screenY = (-projectedVec.y * 0.5 + 0.5) * containerH;

        return {
          hotspot: spot,
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: isFacing && projectedVec.z < 1,
        };
      });

      setProjectedHotspots(projected);
    };

    render();

    // 4. ResizeObserver for parent container
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 5. Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      resizeObserver.disconnect();

      if (geometry) {
        try {
          geometry.dispose();
        } catch {
          // ignore
        }
      }
      if (currentTexture) {
        try {
          currentTexture.dispose();
        } catch {
          // ignore
        }
      }
      if (renderer) {
        try {
          renderer.dispose();
          renderer.forceContextLoss();
        } catch {
          // ignore
        }
      }

      if (sphereMeshRef.current) {
        if (sphereMeshRef.current.material instanceof THREE.Material) {
          try {
            sphereMeshRef.current.material.dispose();
          } catch {
            // ignore
          }
        }
      }
    };
  }, [panoramaUrl, fallbackUrl, autoRotate, gyroActive]);

  // Pointer & Touch Handlers (Smooth click-drag navigation)
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    targetLonRef.current -= deltaX * 0.18;
    targetLatRef.current += deltaY * 0.18;

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    isUserInteractingRef.current = false;
    if (e) {
      try {
        if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    // Resume auto-rotation after 3.5s of inactivity
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 3500);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const camera = cameraRef.current;
    if (!camera) return;

    const newFov = Math.max(30, Math.min(100, fovRef.current + e.deltaY * 0.05));
    fovRef.current = newFov;
    camera.fov = newFov;
    camera.updateProjectionMatrix();
    setFov(Math.round(newFov));
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out") => {
    const camera = cameraRef.current;
    if (!camera) return;

    const step = direction === "in" ? -12 : 12;
    const newFov = Math.max(30, Math.min(100, fovRef.current + step));
    fovRef.current = newFov;
    camera.fov = newFov;
    camera.updateProjectionMatrix();
    setFov(Math.round(newFov));
  };

  // Reset Camera View
  const handleReset = () => {
    targetLonRef.current = 0;
    targetLatRef.current = 0;
    fovRef.current = initialFov;
    if (cameraRef.current) {
      cameraRef.current.fov = initialFov;
      cameraRef.current.updateProjectionMatrix();
    }
    setFov(initialFov);
  };

  // Toggle Fullscreen
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

  // Gyroscope / Device Orientation Toggle
  const toggleGyro = async () => {
    if (gyroActive) {
      setGyroActive(false);
      return;
    }

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // iOS 13+ permission request
      const DOE = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof DOE.requestPermission === "function") {
        try {
          const res = await DOE.requestPermission();
          if (res === "granted") {
            setGyroActive(true);
          }
        } catch {
          // ignore denied
        }
      } else {
        setGyroActive(true);
      }
    }
  };

  // Listen to device orientation when gyroActive is true
  useEffect(() => {
    if (!gyroActive || typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        // Adjust lon/lat based on phone attitude
        targetLonRef.current = e.alpha;
        targetLatRef.current = Math.max(-85, Math.min(85, e.beta - 90));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroActive]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`group relative w-full select-none overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => handlePointerUp()}
      onWheel={handleWheel}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Top Left: Monument Badge & Compass */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5">
        <div className="pointer-events-auto rounded-2xl border border-amber-500/30 bg-stone-900/85 px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-sm font-bold text-stone-100 tracking-tight">{title}</h3>
          </div>
          <p className="mt-0.5 text-[11px] text-stone-400 flex items-center gap-1">
            <MapPin className="size-3 text-amber-500" />
            {location} &bull; 360&deg; Photogrammetric Scan
          </p>
        </div>

        {/* Heading Indicator */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-stone-700/60 bg-stone-900/85 px-3 py-2 text-xs font-mono font-semibold text-amber-400 shadow-md backdrop-blur-md">
          <Compass className="size-3.5" />
          <span>{compassHeading}</span>
        </div>
      </div>

      {/* Top Right: Fullscreen & Controls Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={toggleGyro}
          className={`size-9 rounded-xl border border-stone-700 bg-stone-900/85 text-stone-200 shadow-md backdrop-blur-md hover:bg-stone-800 ${
            gyroActive ? "border-amber-500 text-amber-400" : ""
          }`}
          title="Device Orientation / Gyroscope"
        >
          <Smartphone className="size-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`size-9 rounded-xl border border-stone-700 bg-stone-900/85 text-stone-200 shadow-md backdrop-blur-md hover:bg-stone-800 ${
            autoRotate ? "text-amber-400 border-amber-500/50" : ""
          }`}
          title={autoRotate ? "Pause Auto-Rotation" : "Play Auto-Rotation"}
        >
          {autoRotate ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={toggleFullscreen}
          className="size-9 rounded-xl border border-stone-700 bg-stone-900/85 text-stone-200 shadow-md backdrop-blur-md hover:bg-stone-800"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* Bottom Floating Control Rail */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-stone-700/60 bg-stone-900/85 p-1.5 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleZoom("in")}
          className="flex size-8 items-center justify-center rounded-xl text-stone-300 transition hover:bg-stone-800 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="size-4" />
        </button>

        <span className="px-1 text-[11px] font-mono text-stone-400">{fov}&deg;</span>

        <button
          type="button"
          onClick={() => handleZoom("out")}
          className="flex size-8 items-center justify-center rounded-xl text-stone-300 transition hover:bg-stone-800 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-stone-700" />

        <button
          type="button"
          onClick={handleReset}
          className="flex size-8 items-center justify-center rounded-xl text-stone-300 transition hover:bg-stone-800 hover:text-white"
          title="Reset View Orientation"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      {/* Bottom Right: Interactive Spatial Hotspot Chips */}
      <div className="hidden sm:flex absolute bottom-4 right-4 z-20 items-center gap-2">
        <Badge
          variant="outline"
          className="border-amber-500/40 bg-stone-900/80 text-[11px] text-amber-300 backdrop-blur-md py-1"
        >
          <Sparkles className="size-3 mr-1" />
          {activeHotspotsList.length} Spatial Hotspots
        </Badge>
      </div>

      {/* 2D Projected Hotspot Pins with Glassmorphic Tooltips */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {projectedHotspots.map(({ hotspot, x, y, visible }) => {
          if (!visible) return null;
          const isSelected = activeHotspot?.id === hotspot.id;

          return (
            <div
              key={hotspot.id}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className="pointer-events-auto absolute transition-all duration-75"
            >
              {/* Radar Pulsing Hotspot Marker */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isSelected ? null : hotspot);
                }}
                className={`group relative flex size-9 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-amber-400 bg-amber-500 text-stone-950 scale-110 shadow-lg shadow-amber-500/50"
                    : "border-amber-400/80 bg-stone-900/90 text-amber-400 hover:bg-amber-500 hover:text-stone-950 hover:scale-105"
                } transition-all shadow-md backdrop-blur-md`}
                title={hotspot.title}
              >
                <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                <Info className="size-4 shrink-0 transition-transform group-hover:rotate-12" />
              </button>

              {/* Hotspot Floating Tooltip Card */}
              {isSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-amber-500/40 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 z-30"
                >
                  <div className="flex items-start justify-between gap-2">
                    {hotspot.tag && (
                      <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        {hotspot.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="ml-auto text-stone-400 hover:text-stone-200"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-stone-100 leading-tight">
                    {hotspot.title}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-stone-300">
                    {hotspot.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950/90 text-stone-300 backdrop-blur-sm gap-3">
          <div className="size-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest font-mono text-amber-400">
            Synthesizing 360&deg; Panorama…
          </p>
        </div>
      )}

      {/* Fallback view if WebGL is unavailable or failed */}
      {error && !loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950 p-6 text-center">
          <img
            src={fallbackUrl || panoramaUrl}
            alt={title}
            className="absolute inset-0 size-full object-cover opacity-60"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset["fallbackApplied"]) return;
              target.dataset["fallbackApplied"] = "true";
              target.src = "/assets/hero-heritage.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
          <div className="relative z-10 max-w-md rounded-2xl border border-amber-500/40 bg-stone-900/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Compass className="size-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-100">{title}</h4>
            <p className="mt-1 text-xs text-stone-300">{error}</p>
            <p className="mt-2 text-[11px] text-amber-300/80">
              Viewing verified high-definition photographic capture.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export class PanoramaErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackUrl?: string | null | undefined; title?: string | null | undefined },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackUrl?: string | null | undefined; title?: string | null | undefined }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn("PanoramaErrorBoundary captured error safely:", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="relative h-[520px] w-full select-none overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl">
          <img
            src={this.props.fallbackUrl || "/assets/hero-heritage.jpg"}
            alt={this.props.title || "Monument View"}
            className="size-full object-cover opacity-75"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset["fallbackApplied"]) return;
              target.dataset["fallbackApplied"] = "true";
              target.src = "/assets/hero-heritage.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-amber-500/30 bg-stone-900/90 p-4 shadow-xl backdrop-blur-md">
            <p className="text-xs font-bold text-amber-400">Verified Photographic Dossier</p>
            <p className="text-xs text-stone-300">
              360&deg; interactive tour fallback active. Displaying official photographic scan.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
