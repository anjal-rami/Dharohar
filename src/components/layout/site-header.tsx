import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  Map,
  Navigation,
  Box,
  Eye,
  Landmark,
  ShoppingBag,
  PlaySquare,
  Trophy,
  Bot,
  ShieldAlert,
  Headphones,
  ShieldCheck,
  LogIn,
  ChevronRight,
  Sparkles,
  Volume2,
  Check,
} from "lucide-react";
import { canModerate, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/heritage/language-selector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function SiteHeader() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Handle ESC key to close drawer & trap scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  // Audio Guide Voice Test
  const handleTestAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Namaste! Audio narrator is active for Dharohar Heritage Trails. Explore sacred sites, 3D artifacts, and seasonal bazaars."
      );
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
      toast.success("Playing sample audio narration", {
        description: `Speed: ${speechRate}x · Voice Guide Active`,
      });
    } else {
      toast.info("Web Speech API is not supported in this browser environment.");
    }
  };

  const isRouteActive = (to: string) => {
    if (to === "/" && pathname === "/") return true;
    if (to !== "/" && pathname.startsWith(to)) return true;
    return false;
  };

  const explorationNav: NavItem[] = [
    {
      to: "/explore",
      label: "Interactive GIS Map",
      sublabel: "Spatial monuments & regional geo-layers",
      icon: Map,
    },
    {
      to: "/trails",
      label: "Heritage Trails",
      sublabel: "Curated itineraries & offline routes",
      icon: Navigation,
      badge: "Offline Ready",
    },
    {
      to: "/heritage/brihadisvara-temple-thanjavur",
      label: "3D Artifacts & Relics",
      sublabel: "Interactive WebGL cultural models",
      icon: Box,
    },
    {
      to: "/heritage/brihadisvara-temple-thanjavur#panorama-tour",
      label: "360° Virtual Tours",
      sublabel: "Equirectangular panoramic walkthroughs",
      icon: Eye,
      badge: "Virtual",
    },
  ];

  const communityNav: NavItem[] = [
    {
      to: "/archive",
      label: "Citizen Archive",
      sublabel: "Oral histories, folklore & photo records",
      icon: Landmark,
    },
    {
      to: "/bazaar",
      label: "Local Artisan Bazaar",
      sublabel: "Seasonal crafts, sweets & direct WhatsApp",
      icon: ShoppingBag,
      badge: "Festival Live",
    },
    {
      to: "/reels",
      label: "Heritage Shorts / Reels",
      sublabel: "Vertical shorts with Indic speech narration",
      icon: PlaySquare,
    },
    {
      to: "/quiz",
      label: "National Quizzes & Ranks",
      sublabel: "Daily heritage trivia, streaks & badges",
      icon: Trophy,
    },
  ];

  const assistanceNav: NavItem[] = [
    {
      to: "/assistant",
      label: "AI Assistant (\"Bharti\")",
      sublabel: "Multilingual cultural AI guide & epigraphy",
      icon: Bot,
    },
    {
      to: "/preservation",
      label: "Preservation & Alerts",
      sublabel: "Crowd risk reporting & conservation alerts",
      icon: ShieldAlert,
    },
    ...(canModerate(user)
      ? [
          {
            to: "/admin",
            label: "ASI / Admin Moderation Cell",
            sublabel: "Jury passkey & citizen archive approvals",
            icon: ShieldCheck,
            badge: "Admin",
          },
        ]
      : [
          {
            to: "/admin",
            label: "ASI Moderation Login",
            sublabel: "Officer passkey authentication gate",
            icon: ShieldCheck,
          },
        ]),
  ];

  return (
    <>
      {/* Sleek, Uncluttered Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Top-Left: Hamburger Button & Dharohar Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/70 text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 shadow-sm"
              aria-label="Open Navigation Menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="size-5" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={() => setDrawerOpen(false)}
            >
              <img
                src="/dharohar-logo.svg"
                alt="Dharohar"
                width={36}
                height={36}
                className="size-9 rounded-xl shadow-sm"
              />
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold tracking-tight text-foreground">
                  {t("brand.name")}
                </span>
                <span className="hidden text-[11px] text-muted-foreground sm:block">
                  {t("brand.tagline")}
                </span>
              </span>
            </Link>
          </div>

          {/* Top-Right: Essential Actions Only (Language, Profile/Login) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector compact />

            {user ? (
              <Button asChild size="sm" variant="outline" className="gap-2 rounded-xl border-border bg-card/60">
                <Link to="/profile">
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {user.name[0]}
                  </span>
                  <span className="hidden sm:inline-block font-medium">{user.name.split(" ")[0]}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5 rounded-xl shadow-sm">
                <Link to="/login">
                  <LogIn className="size-4" aria-hidden />
                  <span className="hidden sm:inline-block">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Animated Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Accessible Slide-Over Navigation Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Drawer"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 sm:w-88 max-w-[85vw] flex-col border-r border-stone-800 bg-stone-900/95 text-stone-200 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 px-5 py-4">
          <Link
            to="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2.5"
          >
            <img
              src="/dharohar-logo.svg"
              alt="Dharohar"
              width={32}
              height={32}
              className="size-8 rounded-lg"
            />
            <div>
              <span className="font-display text-base font-bold tracking-tight text-stone-100">
                Dharohar
              </span>
              <span className="block text-[10px] font-medium text-amber-400">
                Living Heritage Portal
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg border border-stone-800 bg-stone-800/60 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition"
            aria-label="Close Navigation Drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Section 1: Core Exploration */}
          <div>
            <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
              <span>Core Exploration</span>
              <span className="text-[10px] text-stone-500 font-mono">01</span>
            </div>
            <div className="space-y-1">
              {explorationNav.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
                      active
                        ? "text-amber-300 bg-amber-500/10 border-l-2 border-amber-500 font-medium"
                        : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100 border-l-2 border-transparent"
                    )}
                  >
                    <Icon className={cn("size-4 mt-0.5 shrink-0 transition-colors", active ? "text-amber-400" : "text-stone-400 group-hover:text-stone-200")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Community & Culture */}
          <div>
            <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
              <span>Community & Culture</span>
              <span className="text-[10px] text-stone-500 font-mono">02</span>
            </div>
            <div className="space-y-1">
              {communityNav.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
                      active
                        ? "text-amber-300 bg-amber-500/10 border-l-2 border-amber-500 font-medium"
                        : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100 border-l-2 border-transparent"
                    )}
                  >
                    <Icon className={cn("size-4 mt-0.5 shrink-0 transition-colors", active ? "text-amber-400" : "text-stone-400 group-hover:text-stone-200")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: Assistance & Governance */}
          <div>
            <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
              <span>Assistance & Governance</span>
              <span className="text-[10px] text-stone-500 font-mono">03</span>
            </div>
            <div className="space-y-1">
              {assistanceNav.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
                      active
                        ? "text-amber-300 bg-amber-500/10 border-l-2 border-amber-500 font-medium"
                        : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100 border-l-2 border-transparent"
                    )}
                  >
                    <Icon className={cn("size-4 mt-0.5 shrink-0 transition-colors", active ? "text-amber-400" : "text-stone-400 group-hover:text-stone-200")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* Interactive Audio Guide Narrator Settings Trigger */}
              <div className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3 mt-2">
                <button
                  type="button"
                  onClick={() => setAudioSettingsOpen((v) => !v)}
                  className="flex w-full items-center justify-between text-xs font-medium text-stone-300 hover:text-stone-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <Headphones className="size-4 text-amber-400" />
                    <span>Audio Guide Narrator</span>
                  </span>
                  <span className="text-[10px] text-amber-400">
                    {audioSettingsOpen ? "Close ▲" : "Settings ▼"}
                  </span>
                </button>

                {audioSettingsOpen && (
                  <div className="mt-3 space-y-2 border-t border-stone-800 pt-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-400">Narrator Status</span>
                      <button
                        type="button"
                        onClick={() => setSpeechEnabled(!speechEnabled)}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                          speechEnabled
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {speechEnabled ? "Active" : "Muted"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-400">Pacing</span>
                      <div className="flex gap-1">
                        {[0.8, 1.0, 1.2].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setSpeechRate(rate)}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                              speechRate === rate
                                ? "bg-amber-500 text-stone-950 font-bold"
                                : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTestAudio}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-stone-800 px-2 py-1.5 text-[11px] font-medium text-stone-200 hover:bg-stone-700 hover:text-white transition"
                    >
                      <Volume2 className="size-3 text-amber-400" />
                      <span>Test Narration Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-stone-800/80 bg-stone-950/70 p-4">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid size-8 place-items-center rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 shrink-0">
                  {user.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-stone-400 truncate">{user.role}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost" className="text-xs text-amber-400 hover:text-amber-300">
                <Link to="/profile" onClick={() => setDrawerOpen(false)}>
                  Profile →
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Join Citizen Heritage Club</span>
                <span className="text-[10px] text-amber-400 font-medium">Free Access</span>
              </div>
              <Button
                asChild
                size="sm"
                className="w-full justify-center gap-1.5 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold"
              >
                <Link to="/login" onClick={() => setDrawerOpen(false)}>
                  <LogIn className="size-3.5" />
                  Sign In to Track Streaks
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-[10px] text-stone-500 border-t border-stone-800/60 pt-2.5">
            <span>SIH 2026 · Ministry Cell</span>
            <span>DPDP Aligned</span>
          </div>
        </div>
      </aside>
    </>
  );
}
