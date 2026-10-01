import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { TRAILS, getSite, type Trail } from "./heritage-data";

export interface OfflineTrailStop {
  siteSlug: string;
  siteTitle: string;
  lat: number;
  lng: number;
  period: string;
  image: string;
  summary: string;
}

export interface OfflineTrailPack {
  trailId: string;
  name: string;
  region: string;
  distanceKm: number;
  durationHours: number;
  savedAt: string;
  stops: OfflineTrailStop[];
}

const STORAGE_KEY = "dharohar.offline_trails";
const MEDIA_CACHE = "dharohar-v1-media";

/**
 * Reads offline trail packs from localStorage (SSR-safe)
 */
export function getOfflineTrailPacks(): OfflineTrailPack[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineTrailPack[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a trail with its itinerary, stop coordinates, and media into offline storage
 */
export async function saveTrailForOffline(trailId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const trail = TRAILS.find((t) => t.id === trailId);
  if (!trail) {
    toast.error("Trail not found");
    return false;
  }

  try {
    // 1. Compile complete offline itinerary
    const stops: OfflineTrailStop[] = trail.stops.map((stop) => {
      const site = getSite(stop.siteSlug);
      return {
        siteSlug: stop.siteSlug,
        siteTitle: site?.name || site?.title || stop.siteSlug,
        lat: site?.lat || 0,
        lng: site?.lng || 0,
        period: site?.period || "Ancient",
        image: site?.image || "/dharohar-logo.svg",
        summary: site?.summary.en || site?.significance || "",
      };
    });

    const pack: OfflineTrailPack = {
      trailId: trail.id,
      name: trail.name.en || trail.id,
      region: trail.region,
      distanceKm: trail.distanceKm,
      durationHours: trail.durationHours,
      savedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      stops,
    };

    // 2. Persist metadata in localStorage
    const existing = getOfflineTrailPacks();
    const updated = existing.filter((p) => p.trailId !== trailId).concat(pack);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 3. Cache stop images in CacheStorage if available
    if ("caches" in window) {
      try {
        const cache = await window.caches.open(MEDIA_CACHE);
        const imageUrls = stops
          .map((s) => s.image)
          .filter((img) => img && typeof img === "string" && !img.startsWith("data:"));

        await Promise.allSettled(
          imageUrls.map(async (url) => {
            const match = await cache.match(url);
            if (!match) {
              const res = await fetch(url, { mode: "no-cors" });
              if (res) await cache.put(url, res);
            }
          })
        );
      } catch (cacheErr) {
        console.warn("[OfflineTrails] CacheStorage error:", cacheErr);
      }
    }

    toast.success(`Trail "${trail.name.en}" saved for offline use!`, {
      description: `${stops.length} stop dossiers & GIS coordinates cached for field guidance.`,
      className: "border-amber-500/40 text-stone-100 bg-stone-900",
    });

    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new Event("dharohar:offline_trails_updated"));
    return true;
  } catch (err) {
    console.error("Failed to save trail offline:", err);
    toast.error("Could not complete offline caching.");
    return false;
  }
}

/**
 * Removes a trail from offline cache
 */
export function removeTrailFromOffline(trailId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = getOfflineTrailPacks();
    const trail = existing.find((p) => p.trailId === trailId);
    const updated = existing.filter((p) => p.trailId !== trailId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast.info(`Removed "${trail?.name || trailId}" from offline packs`, {
      description: "Local storage freed.",
    });

    window.dispatchEvent(new Event("dharohar:offline_trails_updated"));
    return true;
  } catch {
    return false;
  }
}

/**
 * React hook to manage offline trails state
 */
export function useOfflineTrails() {
  const [offlinePacks, setOfflinePacks] = useState<OfflineTrailPack[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(() => {
    setOfflinePacks(getOfflineTrailPacks());
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("dharohar:offline_trails_updated", handleUpdate);
    return () => window.removeEventListener("dharohar:offline_trails_updated", handleUpdate);
  }, [refresh]);

  const isOfflineSaved = useCallback(
    (trailId: string) => offlinePacks.some((p) => p.trailId === trailId),
    [offlinePacks]
  );

  const toggleOffline = async (trailId: string) => {
    setIsSaving(true);
    if (isOfflineSaved(trailId)) {
      removeTrailFromOffline(trailId);
    } else {
      await saveTrailForOffline(trailId);
    }
    refresh();
    setIsSaving(false);
  };

  return {
    offlinePacks,
    offlineTrailIds: offlinePacks.map((p) => p.trailId),
    isOfflineSaved,
    toggleOffline,
    isSaving,
    refresh,
  };
}
