import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, ThumbsUp, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { STATES } from "@/lib/heritage-data";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/layout/page-header";
import { uploadMediaFile } from "@/lib/upload-server";
import { HeritageImage } from "@/components/heritage/heritage-image";
import {
  getArchiveItems,
  submitArchiveItem,
  voteArchiveItem,
  type ArchiveSubmission,
} from "@/lib/archive-server";

export const Route = createFileRoute("/archive")({
  loader: async () => {
    try {
      const res = await getArchiveItems();
      return { initialItems: res.items };
    } catch {
      return { initialItems: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Citizen Archive — contribute heritage records | Dharohar" },
      {
        name: "description",
        content:
          "Upload photographs, oral histories, documents and living traditions. Track submission status and peer verification.",
      },
      { property: "og:title", content: "Citizen Archive — contribute heritage records" },
      {
        property: "og:description",
        content:
          "Community contributions verified by peers and experts before publication, with attribution.",
      },
    ],
  }),
  component: Archive,
});

export type TriageStatus = "COMMUNITY_CURATING" | "ESCALATED_ASI_REVIEW" | "ASI_SEALED";

export function getVerificationWorkflowBadge(endorsements: number, isAsiSealed: boolean) {
  if (isAsiSealed) {
    return (
      <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-3 py-1 text-[11px] font-bold text-stone-950 shadow-lg backdrop-blur-md border border-amber-300">
        <ShieldCheck className="h-3.5 w-3.5 fill-current" />
        ✓ ASI Digitally Sealed Record
      </span>
    );
  }

  if (endorsements >= 20) {
    return (
      <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-300 shadow backdrop-blur-md border border-amber-500/40">
        <span>⏳</span>
        <span>Escalated: In ASI Archivist Queue</span>
      </span>
    );
  }

  return (
    <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full bg-stone-850/90 px-2.5 py-1 text-[11px] font-medium text-stone-300 shadow backdrop-blur-md border border-stone-700">
      <span>{endorsements}/20 Endorsements to Escalate</span>
    </span>
  );
}

const STEPS = [
  "Contributor submits local media, regional metadata, and cultural provenance",
  "Media uploaded and sanitized through the local media storage service",
  "Submission enters the Community Peer Review queue for grassroots endorsement",
  "Reaching 20 community endorsements automatically escalates the record to the ASI Archivist Triage Queue",
  "Accredited ASI / Ministry archivists review documentation and apply the Official Digital Seal",
];

export function ArchiveFeed({ initialItems = [] }: { initialItems?: ArchiveSubmission[] }) {
  const [items, setItems] = useState<ArchiveSubmission[]>(initialItems);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [category, setCategory] = useState<ArchiveSubmission["category"]>("living_culture");
  const [state, setState] = useState("Gujarat");
  const [description, setDescription] = useState("");

  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; title: string } | null>(
    null,
  );

  // Close modal when pressing the 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    } else {
      getArchiveItems()
        .then((res) => {
          if (res.success && res.items) {
            setItems(res.items);
          }
        })
        .catch(() => {});
    }
  }, [initialItems]);

  // Handle Real File Upload + Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an artifact photograph or recording");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 1. Upload file to server
      const uploadRes = await uploadMediaFile({ data: formData });
      if (!uploadRes.success || !uploadRes.fileUrl) {
        throw new Error(uploadRes.error || "Upload failed");
      }

      // 2. Submit archive entry
      const subRes = await submitArchiveItem({
        data: {
          title,
          contributorName,
          category,
          state,
          description,
          mediaUrl: uploadRes.fileUrl,
        },
      });

      if (subRes.success && subRes.item) {
        const newItem = subRes.item;
        setItems((prev) => [newItem, ...prev]);
        toast.success("Artifact submitted for community peer verification!");
        // Reset form
        setTitle("");
        setContributorName("");
        setDescription("");
        setSelectedFile(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  // Handle Community Upvoting
  const handleUpvote = async (id: string) => {
    try {
      const res = await voteArchiveItem({ data: { id, direction: "up" } });
      if (res.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  upvotes: res.upvotes ?? item.upvotes + 1,
                  verifiedByCommunity: res.verifiedByCommunity ?? item.verifiedByCommunity,
                }
              : item,
          ),
        );
        toast.success("Endorsement recorded! Record escalates to ASI Archivist Queue at 20 endorsements.");
      }
    } catch {
      toast.error("Could not record vote");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Upload Form Section */}
      <section className="mb-12 rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold text-stone-100">Contribute Local Heritage</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Artifact or Tradition Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500"
          />
          <input
            type="text"
            required
            placeholder="Contributor / Folk Artist Name"
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ArchiveSubmission["category"])}
            className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500"
          >
            <option value="oral_tradition">Oral Tradition & Folk Lore</option>
            <option value="living_culture">Living Craft & Ritual</option>
            <option value="photo">Historic Photograph</option>
            <option value="document">Manuscript & Document</option>
          </select>
          <input
            type="file"
            required
            accept="image/*,video/*,audio/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-600 file:px-3 file:py-1 file:text-xs file:text-white"
          />
          <textarea
            required
            placeholder="Cultural provenance, history, and community context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500 md:col-span-2"
          />
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-50 md:col-span-2"
          >
            {uploading ? "Processing File..." : "Submit to Citizen Archive"}
          </button>
        </form>
      </section>

      {/* Community Verification Feed */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-100">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Community-Verified Heritage Archive
          </h2>
          <span className="text-xs text-stone-400">Crowd-endorsed cultural records</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-lg transition hover:border-amber-500/40"
            >
              <div>
                <div
                  onClick={() => setFullscreenImage({ url: item.mediaUrl, title: item.title })}
                  className="group relative h-48 w-full cursor-zoom-in overflow-hidden bg-stone-900"
                >
                  <HeritageImage
                    src={item.mediaUrl}
                    alt={item.title}
                    fallbackText={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    containerClassName="h-full w-full"
                    loading="lazy"
                  />

                  {/* Hover overlay hint */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-stone-950/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-md border border-stone-700 bg-stone-900/80 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                      Click to view full screen
                    </span>
                  </div>

                  {getVerificationWorkflowBadge(
                    item.upvotes,
                    Boolean(item.isVerifiedByAdmin || (item.verifiedBy && item.status === "approved")),
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-stone-100">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-amber-400/90">
                    Contributed by {item.contributorName} • {item.state}
                  </p>
                  <p className="mt-3 line-clamp-3 text-xs text-stone-400">{item.description}</p>
                  {item.moderationNotes && item.verifiedBy && (
                    <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-300/90">
                      <span className="font-semibold text-amber-400">Official Provenance Seal:</span>{" "}
                      {item.moderationNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Endorsement Action Bar */}
              <div className="flex items-center justify-between border-t border-stone-800/80 bg-stone-900/30 px-5 py-3">
                <span className="text-xs text-stone-400">
                  <strong className="text-stone-200">{item.upvotes}</strong> community endorsements
                </span>
                <button
                  type="button"
                  onClick={() => handleUpvote(item.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-amber-400 transition hover:bg-stone-700 hover:text-amber-300 active:scale-95"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Verify / Endorse
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full-Screen Image Lightbox Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 rounded-full bg-stone-800/80 p-2 text-stone-300 transition hover:bg-stone-700 hover:text-white cursor-pointer"
            aria-label="Close full screen view"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] max-w-5xl flex-col items-center"
          >
            <img
              src={fullscreenImage.url}
              alt={fullscreenImage.title}
              className="max-h-[80vh] w-auto rounded-xl border border-stone-800 object-contain shadow-2xl"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset["fallbackApplied"]) return;
                target.dataset["fallbackApplied"] = "true";
                target.src = "/assets/hero-heritage.jpg";
              }}
            />
            <p className="mt-3 text-sm font-medium tracking-wide text-stone-300">
              {fullscreenImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Archive() {
  const { initialItems } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        kicker={t("nav.archive")}
        title={t("archive.title")}
        subtitle={t("archive.subtitle")}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <ArchiveFeed initialItems={initialItems} />

        <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
            <h2 className="text-base font-semibold text-stone-100">Verification workflow</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-500 text-xs font-bold text-stone-950">
                    {i + 1}
                  </span>
                  <span className="text-stone-300">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-stone-100">
              <CheckCircle2 className="size-5 text-amber-500" aria-hidden />
              What makes a strong contribution
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-stone-300">
              <li>Name the person or community the knowledge originates from.</li>
              <li>Include the date and regional provenance of the recording or photograph.</li>
              <li>
                Avoid unverified claims; attribute to a living folk artist or local custodian.
              </li>
              <li>Upload the highest-resolution original media you have.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
