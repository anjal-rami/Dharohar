import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Rotate3d,
  Compass,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  Sparkles,
  Layers,
  MapPin,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Default images from assets + base64 panoramas
import heroHeritage from "@/assets/hero-heritage.jpg";
import hillTemple from "@/assets/hill-temple.jpg";
import performanceImg from "@/assets/performance.jpg";
import raniKiVavImg from "@/assets/rani-ki-vav.jpg";
import modheraSunTempleImg from "@/assets/modhera-sun-temple.jpg";

interface Tour360ViewerProps {
  initialSite?: string;
  customImage?: string;
  panoramaUrl?: string;
  title?: string;
}

const PRESET_TOURS = [
  {
    id: "ajanta",
    name: "Ajanta Caves",
    location: "Chhatrapati Sambhaji Nagar, Maharashtra",
    tag: "UNESCO World Heritage Site",
    image: heroHeritage,
    aspect: "16:9",
  },
  {
    id: "rani",
    name: "Rani ki Vav (Queen's Stepwell)",
    location: "Patan, Gujarat",
    tag: "Subterranean Stepwell • UNESCO",
    image: "/images/monuments/rani_ki_vav.jpg",
    aspect: "2.65:1",
  },
  {
    id: "modhera",
    name: "Modhera Sun Temple",
    location: "Modhera, Gujarat",
    tag: "11th-Century Solar Temple",
    image: modheraSunTempleImg,
    aspect: "1.66:1",
  },
];

export function Tour360Viewer({
  initialSite = "ajanta",
  customImage,
  panoramaUrl,
  title,
}: Tour360ViewerProps) {
  const [selectedTour, setSelectedTour] = useState(initialSite);
  const [mode, setMode] = useState<"sphere" | "cyl" | "pan">("sphere");
  const [fov, setFov] = useState(75);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customImgSrc, setCustomImgSrc] = useState<string | null>(customImage || panoramaUrl || null);
  const [panPosition, setPanPosition] = useState(0);
  const [panZoom, setPanZoom] = useState(1.0);

  useEffect(() => {
    if (customImage || panoramaUrl) {
      setCustomImgSrc(customImage || panoramaUrl || null);
    }
  }, [customImage, panoramaUrl]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const canvas2dRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const cylMeshRef = useRef<THREE.Mesh | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startAngleRef = useRef({ lon: 0, lat: 0 });
  const targetAngleRef = useRef({ lon: 0, lat: 0 });
  const currentAngleRef = useRef({ lon: 0, lat: 0 });

  // 2D Pan tracking
  const panXRef = useRef(0);
  const targetPanXRef = useRef(0);

  // Get active image URL
  const activeImageSrc =
    customImgSrc || PRESET_TOURS.find((t) => t.id === selectedTour)?.image || heroHeritage;

  const currentTourData = PRESET_TOURS.find((t) => t.id === selectedTour);

  // ----------------------------------------------------
  // Initialize & Update Three.js 3D Viewport
  // ----------------------------------------------------
  useEffect(() => {
    if (mode === "pan") return;
    if (!canvas3dRef.current || !containerRef.current) return;

    let isMounted = true;
    let loadedTexture: THREE.Texture | null = null;
    let sphereGeo: THREE.SphereGeometry | null = null;
    let sphereMat: THREE.MeshBasicMaterial | null = null;
    let cylGeo: THREE.CylinderGeometry | null = null;
    let cylMat: THREE.MeshBasicMaterial | null = null;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 1100);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas3dRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Load texture with unmount safety
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(activeImageSrc, (texture: THREE.Texture) => {
      if (!isMounted) {
        texture.dispose();
        return;
      }
      loadedTexture = texture;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      // 1. Sphere Geometry for 360° inverted projection
      sphereGeo = new THREE.SphereGeometry(500, 64, 32);
      sphereGeo.scale(-1, 1, 1);
      sphereMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.visible = mode === "sphere";
      scene.add(sphereMesh);
      sphereMeshRef.current = sphereMesh;

      // 2. Cylinder Geometry for 3D Curved Arc projection
      cylGeo = new THREE.CylinderGeometry(
        500,
        500,
        500 * (720 / 1280) * 2.2,
        64,
        1,
        true,
        Math.PI * 0.65,
        Math.PI * 0.7,
      );
      cylGeo.scale(-1, 1, 1);
      cylMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      cylMesh.visible = mode === "cyl";
      scene.add(cylMesh);
      cylMeshRef.current = cylMesh;
    });

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current) {
        targetAngleRef.current.lon += 0.12;
      }

      currentAngleRef.current.lon +=
        (targetAngleRef.current.lon - currentAngleRef.current.lon) * 0.1;
      currentAngleRef.current.lat +=
        (targetAngleRef.current.lat - currentAngleRef.current.lat) * 0.1;

      setYaw(Math.round(((currentAngleRef.current.lon % 360) + 360) % 360));
      setPitch(Math.round(currentAngleRef.current.lat));

      const phi = THREE.MathUtils.degToRad(90 - currentAngleRef.current.lat);
      const theta = THREE.MathUtils.degToRad(currentAngleRef.current.lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);
    };

    animate();

    // Responsive Canvas Resize via ResizeObserver (AGENTS.md Rule 7)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Comprehensive memory disposal on unmount or tour change
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      // Dispose geometries
      try {
        sphereGeo?.dispose();
        cylGeo?.dispose();
      } catch {}

      // Dispose materials
      try {
        sphereMat?.dispose();
        cylMat?.dispose();
      } catch {}

      // Dispose texture
      try {
        loadedTexture?.dispose();
      } catch {}

      // Clear scene meshes
      if (sphereMeshRef.current) {
        scene.remove(sphereMeshRef.current);
        sphereMeshRef.current = null;
      }
      if (cylMeshRef.current) {
        scene.remove(cylMeshRef.current);
        cylMeshRef.current = null;
      }

      // Dispose renderer & force WebGL context release
      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch {}

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [selectedTour, activeImageSrc, mode]);

  // Update mesh visibility when mode changes
  useEffect(() => {
    if (sphereMeshRef.current) sphereMeshRef.current.visible = mode === "sphere";
    if (cylMeshRef.current) cylMeshRef.current.visible = mode === "cyl";
  }, [mode]);

  // Update camera FOV
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // ----------------------------------------------------
  // 3D Pointer & Drag Event Handlers
  // ----------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startMouseRef.current = { x: e.clientX, y: e.clientY };
    startAngleRef.current = { ...targetAngleRef.current };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = (startMouseRef.current.x - e.clientX) * 0.18;
    const deltaY = (e.clientY - startMouseRef.current.y) * 0.18;

    targetAngleRef.current.lon = startAngleRef.current.lon + deltaX;
    targetAngleRef.current.lat = Math.max(-85, Math.min(85, startAngleRef.current.lat + deltaY));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (mode === "pan") {
      setPanZoom((z) => Math.max(1.0, Math.min(3.5, z - e.deltaY * 0.002)));
    } else {
      setFov((f) => Math.max(30, Math.min(105, f + e.deltaY * 0.05)));
    }
  };

  // ----------------------------------------------------
  // 2D Pan Explorer Logic
  // ----------------------------------------------------
  useEffect(() => {
    if (mode !== "pan") return;
    if (!canvas2dRef.current || !containerRef.current) return;

    const canvas = canvas2dRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = activeImageSrc;

    let animId: number;

    const renderPan = () => {
      animId = requestAnimationFrame(renderPan);
      if (!img.complete || !img.naturalWidth) return;

      const canvasW = containerRef.current?.clientWidth || 800;
      const canvasH = containerRef.current?.clientHeight || 500;
      canvas.width = canvasW;
      canvas.height = canvasH;

      const baseHeight = canvasH * panZoom;
      const baseWidth = img.width * (canvasH / img.height) * panZoom;
      const minPanX = canvasW - baseWidth;

      if (autoRotate && !isDraggingRef.current) {
        targetPanXRef.current -= 1.2;
        if (targetPanXRef.current <= minPanX) targetPanXRef.current = 0;
      }

      panXRef.current += (targetPanXRef.current - panXRef.current) * 0.12;

      ctx.fillStyle = "#0a0c10";
      ctx.fillRect(0, 0, canvasW, canvasH);

      const drawY = (canvasH - baseHeight) / 2;
      ctx.drawImage(img, panXRef.current, drawY, baseWidth, baseHeight);

      const panRange = Math.abs(minPanX);
      const percent =
        panRange > 0
          ? Math.round(Math.max(0, Math.min(100, (-panXRef.current / panRange) * 100)))
          : 0;
      setPanPosition(percent);
    };

    img.onload = () => {
      const canvasW = containerRef.current?.clientWidth || 800;
      const canvasH = containerRef.current?.clientHeight || 500;
      targetPanXRef.current = (canvasW - img.width * (canvasH / img.height)) / 2;
      panXRef.current = targetPanXRef.current;
      renderPan();
    };

    return () => cancelAnimationFrame(animId);
  }, [mode, activeImageSrc, panZoom, autoRotate]);

  // Reset View
  const handleReset = () => {
    targetAngleRef.current = { lon: 0, lat: 0 };
    setFov(75);
    setPanZoom(1.0);
    targetPanXRef.current = 0;
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Handle Custom Image Upload
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomImgSrc(event.target.result as string);
        setSelectedTour("custom");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Tour Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-foreground">
              {title || currentTourData?.name || "360° Heritage Virtual Tour"}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {currentTourData?.tag || "360° Interactive"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="size-3.5 text-primary" />
            <span>{currentTourData?.location || "India Cultural Site"}</span>
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_TOURS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTour(t.id);
                setCustomImgSrc(null);
                handleReset();
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedTour === t.id && !customImgSrc
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-foreground hover:bg-secondary"
              }`}
            >
              {t.name.split(" ")[0]}
            </button>
          ))}

          {/* Custom Upload Button */}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} />
            <span
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                customImgSrc
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-foreground hover:bg-secondary"
              }`}
            >
              <Upload className="size-3.5" />
              Custom
            </span>
          </label>
        </div>
      </div>

      {/* Main 360° / 3D / 2D Viewport Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-border bg-black shadow-lift select-none"
        style={{ height: "clamp(380px, 52vw, 560px)" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Render 3D Canvas for Sphere & Cyl modes */}
        {mode !== "pan" && (
          <canvas ref={canvas3dRef} className="size-full cursor-grab active:cursor-grabbing" />
        )}

        {/* Render 2D Canvas for Pan mode */}
        {mode === "pan" && (
          <canvas ref={canvas2dRef} className="size-full cursor-grab active:cursor-grabbing" />
        )}

        {/* HUD Overlays (Top-Left) */}
        <div className="absolute top-4 left-4 z-20 space-y-1.5 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Rotate3d className="size-3.5 text-primary animate-spin-slow" />
            <span>
              Mode:{" "}
              {mode === "sphere" ? "360° Sphere" : mode === "cyl" ? "3D Curved Arc" : "Pan & Zoom"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-mono text-white/90 backdrop-blur">
              FOV: {Math.round(fov)}°
            </span>
            <span className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-mono text-white/90 backdrop-blur">
              Pitch: {pitch}° | Yaw: {yaw}°
            </span>
          </div>
        </div>

        {/* Rotating Compass Dial (Top-Right) */}
        <div className="absolute top-4 right-4 z-20 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md backdrop-blur pointer-events-none">
          <div
            className="relative flex size-full items-center justify-center transition-transform duration-75"
            style={{ transform: `rotate(${-yaw}deg)` }}
          >
            <Compass className="size-6 text-primary" />
            <span className="absolute top-0.5 text-[9px] font-bold text-red-500">N</span>
          </div>
        </div>

        {/* Mode Selector Overlay (Bottom-Center) */}
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1 rounded-2xl border border-white/15 bg-black/75 p-1.5 backdrop-blur">
          <button
            type="button"
            onClick={() => setMode("sphere")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "sphere"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            🌐 360° Sphere
          </button>
          <button
            type="button"
            onClick={() => setMode("cyl")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "cyl"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            🏛️ 3D Arc
          </button>
          <button
            type="button"
            onClick={() => setMode("pan")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "pan"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            📜 Pan Explorer
          </button>
        </div>

        {/* Mini-Map Radar Box for 2D Pan mode (Bottom-Right) */}
        {mode === "pan" && (
          <div className="absolute bottom-4 right-4 z-20 h-14 w-36 overflow-hidden rounded-xl border border-white/20 bg-black/80 backdrop-blur pointer-events-none">
            <img
              src={activeImageSrc}
              alt=""
              className="size-full object-cover opacity-40"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset["fallbackApplied"]) return;
                target.dataset["fallbackApplied"] = "true";
                target.src = "/assets/hero-heritage.jpg";
              }}
            />
            <div
              className="absolute top-0 h-full border-2 border-primary bg-primary/20 transition-all"
              style={{
                left: `${panPosition}%`,
                width: `${Math.max(20, 100 / panZoom)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1.5 size-3.5" /> Reset View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className={autoRotate ? "border-primary text-primary" : ""}
          >
            {autoRotate ? (
              <>
                <Pause className="mr-1.5 size-3.5" /> Pause Rotate
              </>
            ) : (
              <>
                <Play className="mr-1.5 size-3.5" /> Auto Rotate
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              mode === "pan"
                ? setPanZoom((z) => Math.min(3.5, z + 0.25))
                : setFov((f) => Math.max(30, f - 10))
            }
          >
            <ZoomIn className="mr-1.5 size-3.5" /> Zoom In
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              mode === "pan"
                ? setPanZoom((z) => Math.max(1.0, z - 0.25))
                : setFov((f) => Math.min(105, f + 10))
            }
          >
            <ZoomOut className="mr-1.5 size-3.5" /> Zoom Out
          </Button>

          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <>
                <Minimize2 className="mr-1.5 size-3.5" /> Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="mr-1.5 size-3.5" /> Fullscreen
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="size-3.5 text-marigold" />
          <span>Drag mouse/touch to look around. Scroll or pinch to zoom.</span>
        </p>
      </div>
    </div>
  );
}
