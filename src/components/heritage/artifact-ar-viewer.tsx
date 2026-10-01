import React, { useEffect } from "react";

interface ArtifactViewerProps {
  modelSrc: string; // e.g., '/models/harappan-seal.glb'
  iosSrc?: string; // e.g., '/models/harappan-seal.usdz'
  altText: string;
}

export function ArtifactARViewer({ modelSrc, iosSrc, altText }: ArtifactViewerProps) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-stone-900/40">
      <model-viewer
        src={modelSrc}
        ios-src={iosSrc}
        alt={altText}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: "100%", height: "100%" }}
      >
        <button
          slot="ar-button"
          className="absolute right-4 bottom-4 flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 font-medium text-white shadow-lg transition hover:bg-amber-500"
        >
          <span>📱 View in AR</span>
        </button>
      </model-viewer>
    </div>
  );
}
