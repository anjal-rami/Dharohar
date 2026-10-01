import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Flag, Mic, MicOff, Send, Sparkles, Upload, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { ASSISTANT_SUGGESTIONS } from "@/lib/heritage-data";
import type { AssistantAnswer } from "@/lib/heritage-assistant";
import { askBharti } from "@/lib/assistant-server";
import { LANGUAGE_META, localized, useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/layout/page-header";
import { SourceCard } from "@/components/heritage/source-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Bharti — AI heritage assistant with citations | Dharohar" },
      {
        name: "description",
        content:
          "Ask Bharti about Indian heritage in English, Hindi, Tamil, Bengali, Gujarati or Marathi. Every answer is grounded in verified records and shows its sources.",
      },
      { property: "og:title", content: "Bharti — AI heritage assistant | Dharohar" },
      {
        property: "og:description",
        content: "Multilingual, source-cited question answering over verified cultural records.",
      },
    ],
  }),
  component: Assistant,
});

type Turn = { role: "user" | "assistant"; text: string; answer?: AssistantAnswer };

const CONFIDENCE_META = {
  high: {
    label: "High confidence",
    style: "bg-status-safe/15 text-status-safe border-status-safe/35",
  },
  medium: {
    label: "Medium confidence",
    style: "bg-status-attention/16 text-status-attention border-status-attention/35",
  },
  low: {
    label: "Needs verification",
    style: "bg-secondary text-muted-foreground border-border",
  },
} as const;

/** Minimal typings for the vendor-prefixed Web Speech API. */
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function createRecognizer(locale: string): SpeechRecognitionLike | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognizer = new Ctor();
  recognizer.lang = locale;
  recognizer.interimResults = true;
  recognizer.continuous = false;
  return recognizer;
}

const SPEECH_LOCALE: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  mr: "mr-IN",
};

function Assistant() {
  const { t, locale } = useI18n();
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  };

  const toggleSpeech = (text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info("Speech synthesis is not supported on this browser.");
      return;
    }
    if (speakingIndex === index) {
      stopSpeech();
      return;
    }
    window.speechSynthesis.cancel();

    // Strip markdown bold and formatting for clean pronunciation
    const clean = text.replace(/<[^>]*>?/gm, "").replace(/\*\*/g, "").replace(/\*/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes(locale.toLowerCase()) ||
        v.lang.includes("hi-IN") ||
        v.lang.includes("en-IN")
    );
    if (targetVoice) utterance.voice = targetVoice;
    utterance.rate = 0.95;
    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      recognizerRef.current?.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const ask = async (question: string) => {
    if (!question.trim() || thinking) return;
    setTurns((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setThinking(true);
    try {
      const answer = await askBharti({ data: { question, locale } });
      setTurns((prev) => [...prev, { role: "assistant", text: answer.text, answer }]);
      window.setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }), 40);
    } catch {
      toast.error("Bharti could not answer just now — please try again.");
    } finally {
      setThinking(false);
    }
  };

  const startVoice = () => {
    if (listening) {
      recognizerRef.current?.stop();
      return;
    }
    const recognizer = createRecognizer(SPEECH_LOCALE[locale] ?? "en-IN");
    if (!recognizer) {
      toast.info("Voice input is not supported in this browser — typing works the same.");
      return;
    }
    recognizerRef.current = recognizer;
    let finalText = "";
    recognizer.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]!;
        transcript += result[0]?.transcript ?? "";
      }
      setInput(transcript);
      finalText = transcript;
    };
    recognizer.onend = () => {
      setListening(false);
      recognizerRef.current = null;
      if (finalText.trim()) ask(finalText.trim());
    };
    recognizer.onerror = () => {
      setListening(false);
      recognizerRef.current = null;
      toast.error("Could not hear you — check microphone permission and try again.");
    };
    setListening(true);
    try {
      recognizer.start();
    } catch {
      setListening(false);
      recognizerRef.current = null;
    }
  };

  return (
    <>
      <PageHeader
        kicker={t("nav.assistant")}
        title={t("assistant.title")}
        subtitle={t("assistant.subtitle")}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="flex min-h-[520px] flex-col rounded-2xl border border-border bg-card">
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {turns.length === 0 && (
              <div className="grid place-items-center py-16 text-center">
                <Sparkles className="size-8 text-primary" aria-hidden />
                <p className="mt-3 font-semibold">{t("assistant.greeting")}</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Answers are retrieved from verified records only. Replies follow your selected
                  language: {LANGUAGE_META[locale].native}.
                </p>
              </div>
            )}

            {turns.map((turn, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[92%] rounded-2xl p-4 text-sm",
                  turn.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "border border-border bg-secondary/60",
                )}
              >
                {turn.role === "assistant" && turn.answer && (
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold">
                      {t("assistant.name")}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        CONFIDENCE_META[turn.answer.confidence].style,
                      )}
                    >
                      {CONFIDENCE_META[turn.answer.confidence].label}
                    </span>
                    {turn.answer.canReport !== false && turn.answer.sources.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toast("Reported — a moderator will review this answer.")}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Flag className="size-3" aria-hidden /> {t("common.report")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleSpeech(turn.text, i)}
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
                      title={speakingIndex === i ? "Stop audio" : "Listen to answer"}
                    >
                      {speakingIndex === i ? (
                        <>
                          <VolumeX className="size-3 text-red-500 animate-pulse" aria-hidden />
                          <span className="text-red-600 dark:text-red-400 font-semibold">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-3 text-primary" aria-hidden />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                <div className="space-y-2 whitespace-pre-line">
                  {turn.text.split("\n\n").map((p, j) => (
                    <p key={j} dangerouslySetInnerHTML={{ __html: boldify(p) }} />
                  ))}
                </div>

                {/* Suggestions chips if available */}
                {turn.answer?.suggestions && turn.answer.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5">
                    <p className="text-xs font-semibold text-muted-foreground">Suggested topics:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {turn.answer.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => ask(sug)}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:border-primary/50"
                        >
                          <Sparkles className="size-3 text-primary" aria-hidden />
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citizen Archive link button for unknown terms */}
                {turn.answer?.status === "unknown_term" && (
                  <div className="mt-3 border-t border-border/50 pt-2.5">
                    <Link
                      to="/archive"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Upload className="size-3" aria-hidden />
                      Contribute to Citizen Archive →
                    </Link>
                  </div>
                )}

                {turn.answer && turn.answer.sources.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <p className="text-xs font-semibold">{t("common.sources")}</p>
                    {turn.answer.sources.slice(0, 4).map((s) => (
                      <SourceCard key={s.id + s.siteSlug} source={s} />
                    ))}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {turn.answer.retrieved.map((site) => (
                        <Link
                          key={site.id}
                          to="/heritage/$slug"
                          params={{ slug: site.slug }}
                          className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium hover:bg-muted"
                        >
                          {site.title} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="max-w-[60%] space-y-2 rounded-2xl border border-border bg-secondary/60 p-4">
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
              </div>
            )}
          </div>

          <form
            className="flex items-end gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label htmlFor="ask" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="ask"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Which crafts in Gujarat are GI-tagged?"
              className="flex-1 resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus-visible:border-primary"
            />
            <Button
              type="button"
              variant={listening ? "secondary" : "outline"}
              size="icon"
              onClick={startVoice}
              aria-label={listening ? "Stop voice input" : "Voice input"}
              aria-pressed={listening}
            >
              {listening ? (
                <MicOff className="size-4 animate-pulse text-primary" />
              ) : (
                <Mic className="size-4" />
              )}
            </Button>
            <Button type="submit" size="icon" aria-label="Send question" disabled={thinking}>
              <Send className="size-4" />
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-status-attention/40 bg-status-attention/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-status-attention" aria-hidden />
              Disclaimer
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{t("assistant.disclaimer")}</p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Suggested prompts</h2>
            <ul className="mt-3 space-y-2">
              {ASSISTANT_SUGGESTIONS.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => ask(localized(s, locale))}
                    className="w-full rounded-xl border border-border p-3 text-left text-sm hover:bg-muted"
                  >
                    {localized(s, locale)}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <h2 className="text-sm font-semibold text-foreground">How Bharti answers</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4">
              <li>Retrieve the closest verified records (semantic search, full-text fallback).</li>
              <li>Compose the answer strictly from retrieved content — never outside facts.</li>
              <li>Attach citations and a confidence flag.</li>
              <li>Refuse rather than guess when nothing relevant is retrieved.</li>
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}

/** Renders the **bold** markers used in composed answers. */
function boldify(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
