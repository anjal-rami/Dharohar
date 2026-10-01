import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { HERITAGE_SITES, CATEGORY_META } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Multilingual search with suggestions. Ranking is client-side here and
 * intentionally isolated so it can be swapped for a semantic/vector search
 * endpoint (with full-text fallback) without touching the UI.
 */
export function GlobalSearch({
  size = "md",
  className,
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const uniqueSites = Array.from(
      new Map(HERITAGE_SITES.map((item) => [item.slug || item.id, item])).values(),
    );
    return uniqueSites.filter((site) => {
      const haystack = [
        site.title,
        ...Object.values(site.titles),
        ...Object.values(site.summary),
        site.state,
        site.district,
        ...site.tags,
        CATEGORY_META[site.category].label,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).slice(0, 6);
  }, [query]);

  return (
    <div className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/explore", search: { q: query } });
          setOpen(false);
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          {t("common.search")}
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder={t("common.searchPlaceholder")}
          className={cn(
            "w-full rounded-full border border-border bg-card pr-4 pl-11 text-foreground shadow-heritage outline-none placeholder:text-muted-foreground focus-visible:border-primary",
            size === "lg" ? "h-14 text-base" : "h-11 text-sm",
          )}
        />
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          {suggestions.map((site) => (
            <li key={site.id}>
              <Link
                to="/heritage/$slug"
                params={{ slug: site.slug }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted"
              >
                <span aria-hidden>{CATEGORY_META[site.category].icon}</span>
                <span className="min-w-0 flex-1 truncate">{localized(site.titles, locale)}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{site.state}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
