import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  MODERATION_LABEL_KEY,
  PRESERVATION_LABEL_KEY,
  type ModerationStatus,
  type PreservationStatus,
} from "@/lib/heritage-data";
import { BadgeCheck, FlaskConical, ShieldCheck } from "lucide-react";

const PRESERVATION_STYLE: Record<PreservationStatus, string> = {
  safe: "bg-status-safe/12 text-status-safe border-status-safe/30",
  attention: "bg-status-attention/16 text-status-attention border-status-attention/35",
  risk: "bg-status-risk/12 text-status-risk border-status-risk/30",
  restoration: "bg-status-restoration/12 text-status-restoration border-status-restoration/30",
};

export function PreservationChip({
  status,
  className,
}: {
  status: PreservationStatus;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        PRESERVATION_STYLE[status],
        className,
      )}
    >
      <ShieldCheck className="size-3.5" aria-hidden />
      {t(PRESERVATION_LABEL_KEY[status])}
    </span>
  );
}

const MODERATION_STYLE: Record<ModerationStatus, string> = {
  pending: "bg-status-attention/16 text-status-attention border-status-attention/35",
  approved: "bg-status-safe/12 text-status-safe border-status-safe/30",
  changes: "bg-status-restoration/12 text-status-restoration border-status-restoration/30",
  rejected: "bg-status-risk/12 text-status-risk border-status-risk/30",
};

export function ModerationChip({
  status,
  className,
}: {
  status: ModerationStatus;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        MODERATION_STYLE[status],
        className,
      )}
    >
      {t(MODERATION_LABEL_KEY[status])}
    </span>
  );
}

export function VerifiedChip({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-indigo-ink/25 bg-indigo-ink/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-ink",
        className,
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      {t("common.verified")}
    </span>
  );
}

export function DemoChip({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      title="Mock record for the hackathon demo — not a verified production source"
    >
      <FlaskConical className="size-3.5" aria-hidden />
      {t("common.demo")}
    </span>
  );
}
