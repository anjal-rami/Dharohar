import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Flag,
  Heart,
  Maximize2,
  Pause,
  Play,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Reel } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function ReelCard({ reel, className }: { reel: Reel; className?: string }) {
  const { locale, t } = useI18n();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [likes, setLikes] = React.useState(reel.likes);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(reel.durationSec);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const modalVideoRef = React.useRef<HTMLVideoElement>(null);

  const toggleInlinePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!reel.videoSrc) {
      toast.info("Playback preview is a placeholder for this community-submitted archive.");
      return;
    }

    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser blocks unmuted playback, try muted
          videoRef.current!.muted = true;
          setIsMuted(true);
          videoRef.current!.play().then(() => setIsPlaying(true));
        });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      toast.success(t("common.saved"));
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Reel link copied to clipboard!");
    } else {
      toast.success("Share link ready (demo).");
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reel.videoSrc) {
      toast.info("Playback preview is a placeholder for this community-submitted archive.");
      return;
    }
    // Pause inline video before opening modal
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setIsModalOpen(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <article
        className={cn(
          "group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-border bg-foreground/90 shadow-heritage transition-all duration-300 hover:shadow-xl",
          className,
        )}
      >
        {/* Video or Static Poster */}
        {reel.videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={reel.videoSrc}
              poster={reel.poster}
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || reel.durationSec)}
              className="absolute inset-0 size-full object-cover"
              onClick={toggleInlinePlay}
            />
            {/* Center Play button overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={toggleInlinePlay}
                aria-label="Play video"
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 group-hover:bg-black/20"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 group-hover:scale-110">
                  <Play className="ml-1 size-7 fill-current" />
                </div>
              </button>
            )}
          </>
        ) : (
          <img
            src={reel.poster}
            alt=""
            loading="lazy"
            width={1200}
            height={800}
            className="absolute inset-0 size-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset["fallbackApplied"]) return;
              target.dataset["fallbackApplied"] = "true";
              target.src = "/assets/hero-heritage.jpg";
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />

        {/* Top Badges & Controls */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-3">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
              {isPlaying && duration ? formatTime(currentTime) : `${reel.durationSec}s`}
            </span>
            {reel.videoSrc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur">
                HD Reel
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {reel.videoSrc && (
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                  className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={openModal}
                  title="Expand to Fullscreen Player"
                  className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <Maximize2 className="size-3.5" />
                </button>
              </>
            )}

            {reel.aiAssisted && (
              <span
                className={cn(
                  "hidden items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur sm:inline-flex",
                  reel.reviewed
                    ? "bg-white/15 text-white"
                    : "bg-status-attention text-marigold-foreground",
                )}
              >
                <Sparkles className="size-3" aria-hidden />
                {reel.reviewed ? "AI script" : "Review"}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Details & Controls */}
        <div className="absolute inset-x-0 bottom-0 z-20 space-y-2 p-4 text-white">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug drop-shadow-sm md:text-lg">
            {localized(reel.title, locale)}
          </h3>
          <p className="line-clamp-2 text-xs text-white/85 drop-shadow-sm md:text-sm">
            {localized(reel.caption, locale)}
          </p>
          <p className="text-[11px] font-medium text-white/70">{reel.narrator}</p>

          {/* Scrubber indicator if playing */}
          {reel.videoSrc && isPlaying && duration > 0 && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-primary transition-all duration-150"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={
                reel.videoSrc
                  ? toggleInlinePlay
                  : () =>
                      toast.info(
                        "Playback preview is a placeholder for this community-submitted archive.",
                      )
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-transform active:scale-95 hover:bg-white/95"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3.5 fill-current" aria-hidden /> Pause
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" aria-hidden /> Play
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLike}
              aria-label={t("common.save")}
              className={cn(
                "inline-flex items-center gap-1 rounded-full p-2 text-xs font-medium backdrop-blur transition-colors",
                hasLiked ? "bg-rose-500/80 text-white" : "bg-white/15 text-white hover:bg-white/25",
              )}
            >
              <Heart className={cn("size-3.5", hasLiked && "fill-current")} aria-hidden />
              {likes > 0 && <span className="text-[11px]">{likes}</span>}
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label={t("common.share")}
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25"
            >
              <Share2 className="size-3.5" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => toast("Report sent to moderators for review.")}
              aria-label={t("common.report")}
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25"
            >
              <Flag className="size-3.5" aria-hidden />
            </button>

            <Link
              to="/heritage/$slug"
              params={{ slug: reel.siteSlug }}
              className="ml-auto text-xs font-semibold text-white/95 underline-offset-4 hover:underline"
            >
              Record →
            </Link>
          </div>
        </div>
      </article>

      {/* Fullscreen Reel Player Modal */}
      {reel.videoSrc && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md border-0 bg-black/95 p-0 text-white shadow-2xl sm:rounded-3xl overflow-hidden">
            <DialogTitle className="sr-only">{localized(reel.title, locale)}</DialogTitle>
            <div className="relative aspect-[9/16] w-full bg-black">
              <video
                ref={modalVideoRef}
                src={reel.videoSrc}
                autoPlay
                controls
                loop
                playsInline
                className="size-full object-contain"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-50 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>

              {/* Reel Info Header Overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 text-white">
                <span className="inline-block rounded-full bg-primary/80 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground backdrop-blur mb-2">
                  {reel.durationSec}s · {reel.narrator}
                </span>
                <h2 className="text-xl font-bold leading-tight drop-shadow">
                  {localized(reel.title, locale)}
                </h2>
                <p className="mt-1 line-clamp-3 text-sm text-white/90 drop-shadow">
                  {localized(reel.caption, locale)}
                </p>
                <div className="pointer-events-auto mt-3 flex items-center gap-3">
                  <Link
                    to="/heritage/$slug"
                    params={{ slug: reel.siteSlug }}
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-white/90"
                  >
                    View Monument Record →
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
