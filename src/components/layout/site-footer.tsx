import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img
              src="/dharohar-logo.svg"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-lg"
              aria-hidden
            />
            <p className="font-display text-xl font-semibold">{t("brand.name")}</p>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            A heritage discovery platform built for Smart India Hackathon 2026 — multilingual,
            community-verified and accessibility-first.
          </p>
          <p className="mt-4 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
            All records in this prototype are labelled <strong>demo data</strong>. Production
            records carry verified citations from government, academic and museum sources.
          </p>
        </div>

        <nav aria-label="Discover" className="space-y-2 text-sm">
          <p className="font-semibold">Discover</p>
          <Link to="/explore" className="block text-muted-foreground hover:text-foreground">
            {t("nav.explore")}
          </Link>
          <Link to="/trails" className="block text-muted-foreground hover:text-foreground">
            {t("nav.trails")}
          </Link>
          <Link to="/reels" className="block text-muted-foreground hover:text-foreground">
            {t("nav.reels")}
          </Link>
          <Link to="/quiz" className="block text-muted-foreground hover:text-foreground">
            {t("nav.quiz")}
          </Link>
          <Link to="/bazaar" className="block text-muted-foreground hover:text-foreground">
            {t("nav.bazaar")}
          </Link>
        </nav>

        <nav aria-label="Participate" className="space-y-2 text-sm">
          <p className="font-semibold">Participate</p>
          <Link to="/archive" className="block text-muted-foreground hover:text-foreground">
            {t("nav.archive")}
          </Link>
          <Link to="/preservation" className="block text-muted-foreground hover:text-foreground">
            {t("nav.preservation")}
          </Link>
          <Link to="/assistant" className="block text-muted-foreground hover:text-foreground">
            {t("nav.assistant")}
          </Link>
          <Link to="/admin" className="block text-muted-foreground hover:text-foreground">
            {t("nav.admin")}
          </Link>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Privacy by design · consent-based contributions · DPDP-aligned data handling
      </div>
    </footer>
  );
}
