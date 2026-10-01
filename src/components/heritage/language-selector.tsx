import { Languages } from "lucide-react";
import { LANGUAGE_META, LOCALES, useI18n, type Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={compact ? "icon" : "sm"} aria-label={t("common.language")}>
          <Languages className="size-4" aria-hidden />
          {!compact && <span className="ml-1.5">{LANGUAGE_META[locale].native}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
        {LOCALES.map((code: Locale) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => setLocale(code)}
            className={code === locale ? "font-semibold text-primary" : ""}
          >
            <span className="flex-1">{LANGUAGE_META[code].native}</span>
            <span className="text-xs text-muted-foreground">{LANGUAGE_META[code].label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
