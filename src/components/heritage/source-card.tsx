import { BookOpen, ExternalLink } from "lucide-react";
import type { VerifiedSource } from "@/lib/heritage-data";

const KIND_LABEL: Record<VerifiedSource["kind"], string> = {
  government: "Government",
  academic: "Academic",
  museum: "Museum",
  community: "Community",
};

export function SourceCard({ source }: { source: VerifiedSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted"
    >
      <BookOpen className="mt-0.5 size-4 shrink-0 text-indigo-ink" aria-hidden />
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm leading-snug font-medium">{source.title}</p>
        <p className="text-xs text-muted-foreground">
          {source.publisher} · {source.year} · {KIND_LABEL[source.kind]}
        </p>
      </div>
      <ExternalLink
        className="mt-0.5 ml-auto size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </a>
  );
}
