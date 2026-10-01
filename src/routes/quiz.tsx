import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { BADGES, QUIZ_QUESTIONS } from "@/lib/heritage-data";
import { localized, useI18n } from "@/lib/i18n";
import { STORE_KEYS, useLocalState, type QuizStats } from "@/lib/use-local-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  getLeaderboard,
  submitQuizScore,
  type LeaderboardEntry,
} from "@/lib/quiz-server";

export const Route = createFileRoute("/quiz")({
  loader: async () => {
    try {
      const res = await getLeaderboard();
      return { initialLeaderboard: res.leaderboard };
    } catch {
      return { initialLeaderboard: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Culture quiz, badges and leaderboard — Dharohar" },
      {
        name: "description",
        content:
          "Learn Indian heritage through quizzes with streaks, achievement badges and a community leaderboard.",
      },
      { property: "og:title", content: "Culture quiz, badges and leaderboard" },
      {
        property: "og:description",
        content: "Gamified heritage learning across monuments, crafts, music and manuscripts.",
      },
    ],
  }),
  component: Quiz,
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Consecutive quiz days ending today (or yesterday, if today is unplayed). */
function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  const day = 86_400_000;
  let cursor = Date.now();
  if (!set.has(today())) cursor -= day;
  let streak = 0;
  while (set.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1;
    cursor -= day;
  }
  return streak;
}

function Quiz() {
  const { initialLeaderboard } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard ?? []);
  const [stats, setStats] = useLocalState<QuizStats>(STORE_KEYS.quiz, {
    playedDates: [],
    bestScore: 0,
    perfectRuns: 0,
  });

  const streak = computeStreak(stats.playedDates);
  const question = QUIZ_QUESTIONS[index]!;
  const progress = Math.round((index / QUIZ_QUESTIONS.length) * 100);

  useEffect(() => {
    getLeaderboard()
      .then((res) => {
        if (res?.leaderboard) setLeaderboard(res.leaderboard);
      })
      .catch((err) => console.error("Failed to fetch leaderboard:", err));
  }, []);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answerIndex) {
      setScore((s) => s + 1);
      toast.success("Correct! +100 points");
    } else {
      toast.error("Not quite — read the explanation.");
    }
  };

  const next = async () => {
    if (index + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true);
      const calculatedStreak = stats.playedDates.includes(today()) ? streak : streak + 1;
      const calculatedXp = score * 100;

      setStats((prev) => ({
        playedDates: prev.playedDates.includes(today())
          ? prev.playedDates
          : [...prev.playedDates, today()],
        bestScore: Math.max(prev.bestScore, score),
        perfectRuns: score === QUIZ_QUESTIONS.length ? prev.perfectRuns + 1 : prev.perfectRuns,
      }));

      setIsSubmitting(true);
      try {
        const currentUserId = user?.id || "guest-user";
        const currentUserName = user?.name || "You";

        const res = await submitQuizScore({
          data: {
            userId: currentUserId,
            userName: currentUserName,
            earnedXp: calculatedXp,
            streakDays: calculatedStreak,
          },
        });

        if (res?.leaderboard) {
          setLeaderboard(res.leaderboard);
          toast.success(`Score submitted! +${calculatedXp} XP (Rank #${res.rank})`);
        }
      } catch (err) {
        console.error("Failed to submit quiz score:", err);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <>
      <PageHeader kicker={t("nav.quiz")} title={t("quiz.title")} subtitle={t("quiz.subtitle")} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-5">
          {done ? (
            <div className="py-10 text-center">
              <Trophy className="mx-auto size-10 text-marigold" aria-hidden />
              <h2 className="mt-3 text-2xl font-semibold">
                {score} / {QUIZ_QUESTIONS.length} correct
              </h2>
              <p className="mt-2 text-muted-foreground">
                {score === QUIZ_QUESTIONS.length
                  ? "Perfect run — badge unlocked."
                  : "Solid attempt. Revisit the linked records and try again."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Best so far: {Math.max(stats.bestScore, score)}/{QUIZ_QUESTIONS.length} · {streak}
                -day streak
              </p>
              <Button className="mt-5" onClick={restart}>
                Play again
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground">
                  {index + 1}/{QUIZ_QUESTIONS.length}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold md:text-2xl">
                {localized(question.prompt, locale)}
              </h2>

              <ul className="mt-5 space-y-2.5">
                {question.options.map((option, i) => {
                  const isAnswer = i === question.answerIndex;
                  const revealed = picked !== null;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => choose(i)}
                        disabled={revealed}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
                          !revealed && "border-border hover:bg-muted",
                          revealed && isAnswer && "border-status-safe bg-status-safe/10",
                          revealed &&
                            !isAnswer &&
                            picked === i &&
                            "border-status-risk bg-status-risk/10",
                          revealed && !isAnswer && picked !== i && "border-border opacity-60",
                        )}
                      >
                        <span className="flex-1">{option}</span>
                        {revealed && isAnswer && (
                          <Check className="size-4 text-status-safe" aria-hidden />
                        )}
                        {revealed && !isAnswer && picked === i && (
                          <X className="size-4 text-status-risk" aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {picked !== null && (
                <div className="mt-5 rounded-xl border border-border bg-secondary/60 p-4 text-sm">
                  {localized(question.explanation, locale)}
                </div>
              )}

              <Button
                className="mt-5 w-full"
                disabled={picked === null || isSubmitting}
                onClick={next}
              >
                {isSubmitting
                  ? "Submitting score..."
                  : index + 1 === QUIZ_QUESTIONS.length
                    ? "See results"
                    : "Next question"}
              </Button>
            </>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border surface-heritage p-4">
            <div className="flex items-center gap-3">
              <Flame className="size-6 text-primary" aria-hidden />
              <div>
                <p className="font-display text-2xl font-semibold">{streak}-day streak</p>
                <p className="text-xs text-muted-foreground">Keep it alive with one quiz a day</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Badges</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {BADGES.map((badge) => {
                const earned = badge.id === "b5" ? stats.perfectRuns > 0 : badge.earned;
                return (
                  <li
                    key={badge.id}
                    className={cn(
                      "rounded-xl border p-3 text-center",
                      earned ? "border-primary/40 bg-accent" : "border-border opacity-60",
                    )}
                  >
                    <span className="text-2xl" aria-hidden>
                      {badge.icon}
                    </span>
                    <p className="mt-1 text-xs font-semibold">{badge.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{badge.requirement}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Leaderboard</h2>
            <ol className="mt-3 space-y-2">
              {leaderboard.length === 0 ? (
                <li className="py-4 text-center text-xs text-muted-foreground">
                  Loading leaderboard...
                </li>
              ) : (
                leaderboard.map((row, idx) => {
                  const isCurrent =
                    row.userId === (user?.id || "guest-user") ||
                    row.userName === (user?.name || "You");
                  return (
                    <li
                      key={row.userId}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        isCurrent
                          ? "border border-primary/30 bg-accent font-semibold"
                          : "bg-muted/50",
                      )}
                    >
                      <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div className="flex flex-1 flex-col truncate">
                        <span className="truncate">{row.userName}</span>
                        <span className="text-[10px] text-muted-foreground">{row.badgeTitle}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {row.streakDays}d streak
                      </span>
                      <span className="tabular-nums font-semibold text-primary">
                        {row.totalXp.toLocaleString("en-IN")} XP
                      </span>
                    </li>
                  );
                })
              )}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}

