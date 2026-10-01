import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BADGES, CONTRIBUTIONS, HERITAGE_SITES, TRAILS } from "@/lib/heritage-data";
import { useAuth } from "@/lib/auth";
import { LANGUAGE_META, LOCALES, useI18n } from "@/lib/i18n";
import { STORE_KEYS, useLocalState, type QuizStats, type SavedStore } from "@/lib/use-local-state";
import { PageHeader } from "@/components/layout/page-header";
import { HeritageCard } from "@/components/heritage/heritage-card";
import { TrailCard } from "@/components/heritage/trail-card";
import { ModerationChip } from "@/components/heritage/chips";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Dharohar profile — saved heritage and badges" },
      {
        name: "description",
        content:
          "Manage saved heritage sites, trails, uploads, badges, preferred language and notification settings.",
      },
      { property: "og:title", content: "Your Dharohar profile" },
      {
        property: "og:description",
        content: "Saved records, contributions, achievements and privacy controls in one place.",
      },
    ],
  }),
  component: Profile,
});

/** Consecutive quiz days ending today (or yesterday if today is unplayed). */
function computeDayStreak(dates: string[]): number {
  const set = new Set(dates);
  const day = 86_400_000;
  let cursor = Date.now();
  if (!set.has(new Date().toISOString().slice(0, 10))) cursor -= day;
  let streak = 0;
  while (set.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1;
    cursor -= day;
  }
  return streak;
}

function Profile() {
  const { t, locale, setLocale } = useI18n();
  const { user, ready, signOut } = useAuth();
  const [notifs, setNotifs] = useState({ moderation: true, preservation: true, weekly: false });
  const [savedStore] = useLocalState<SavedStore>(STORE_KEYS.saved, { sites: [], trails: [] });
  const [quizStats] = useLocalState<QuizStats>(STORE_KEYS.quiz, {
    playedDates: [],
    bestScore: 0,
    perfectRuns: 0,
  });

  const savedSites = HERITAGE_SITES.filter((s) => savedStore.sites.includes(s.slug));
  const savedTrails = TRAILS.filter((tr) => savedStore.trails.includes(tr.id));
  const myUploads = CONTRIBUTIONS.slice(0, 3);
  const streak = computeDayStreak(quizStats.playedDates);

  if (ready && !user) {
    return (
      <>
        <PageHeader kicker={t("nav.profile")} title={t("profile.title")} />
        <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-lg font-semibold">You're browsing as a guest</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with a demo account to see your saved sites, itineraries, quiz streak and badges
            here.
          </p>
          <Button asChild className="mt-6">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        kicker={`Registered user · ${user?.role ?? "visitor"}`}
        title={t("profile.title")}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary font-display text-2xl text-primary-foreground">
            {user?.name[0] ?? "?"}
          </span>
          <div>
            <p className="text-lg font-semibold">{user?.name ?? "Guest"}</p>
            <p className="text-sm text-muted-foreground">
              {user?.state} · {user?.points.toLocaleString("en-IN")} points · {streak}-day streak ·
              role: {user?.role}
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Tabs defaultValue="saved">
          <TabsList className="flex-wrap">
            <TabsTrigger value="saved">Saved sites</TabsTrigger>
            <TabsTrigger value="trails">Itineraries</TabsTrigger>
            <TabsTrigger value="uploads">My uploads</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-6">
            {savedSites.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nothing saved yet — open any heritage record and tap Save.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {savedSites.map((site) => (
                  <HeritageCard key={site.id} site={site} />
                ))}
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Saved records are cached for offline reading when the app is installed.
            </p>
          </TabsContent>

          <TabsContent value="trails" className="mt-6">
            {savedTrails.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No itineraries yet — save one from the Trails page.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {savedTrails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="uploads" className="mt-6">
            <ul className="space-y-3">
              {myUploads.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{c.title}</p>
                    <ModerationChip status={c.status} className="ml-auto" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.type} · {c.state} · {c.submittedAt}
                  </p>
                  {c.feedback && <p className="mt-2 text-xs">{c.feedback}</p>}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {BADGES.map((badge) => {
                const earned = badge.id === "b5" ? quizStats.perfectRuns > 0 : badge.earned;
                return (
                  <li
                    key={badge.id}
                    className={`rounded-2xl border p-4 text-center ${earned ? "border-primary/40 bg-accent" : "border-border opacity-60"}`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {badge.icon}
                    </span>
                    <p className="mt-2 text-sm font-semibold">{badge.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{badge.requirement}</p>
                  </li>
                );
              })}
            </ul>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Preferred language</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCALES.map((code) => (
                  <Button
                    key={code}
                    variant={locale === code ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setLocale(code);
                      toast.success(`Language set to ${LANGUAGE_META[code].label}`);
                    }}
                  >
                    {LANGUAGE_META[code].native}
                  </Button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Content falls back to English when a translation is not yet verified.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Notifications</h2>
              <div className="mt-3 space-y-3">
                {(
                  [
                    ["moderation", "Moderation updates on my uploads"],
                    ["preservation", "Preservation alerts in my state"],
                    ["weekly", "Weekly heritage digest"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <Label htmlFor={key} className="text-sm font-normal">
                      {label}
                    </Label>
                    <Switch
                      id={key}
                      checked={notifs[key]}
                      onCheckedChange={(v) => setNotifs((prev) => ({ ...prev, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold">Privacy & data</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You can withdraw consent for any contribution, export your data, or delete your
                account. Deletion removes personal data and anonymises published contributions while
                retaining the cultural record.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Export requested — you'll get an email.")}
                >
                  Export my data
                </Button>
                <Button variant="outline" onClick={() => toast("Consent settings updated.")}>
                  Manage consent
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => toast.error("Account deletion needs email confirmation (demo).")}
                >
                  Delete account
                </Button>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
