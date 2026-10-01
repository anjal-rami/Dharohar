import React, { useState, useEffect, useRef } from "react";
import { askBharti } from "@/lib/assistant-server";

export function BhartiAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(
    "नमस्ते! I am Bharti, your ASI digital heritage docent. Ask me anything about India's monuments."
  );
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cross-browser speech input safety (Chromium & WebKit)
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.lang = "hi-IN";
      rec.onresult = (e: any) => {
        const transcript = e.results[0]?.[0]?.transcript ?? "";
        setQuery(transcript);
        setIsListening(false);
        if (transcript.trim()) {
          handleAsk(transcript.trim());
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim() || isLoading) return;
    setIsLoading(true);
    try {
      // Detect if query is primarily Devanagari or English
      const isHindi = /[\u0900-\u097F]/.test(textToAsk);
      const answer = await askBharti({
        data: {
          question: textToAsk,
          locale: isHindi ? "hi" : "en",
        },
      });
      // Strip markdown bold asterisks for clean voice & display
      const cleanText = answer.text.replace(/\*\*/g, "");
      setResponse(cleanText);
      speakAloud(cleanText);
    } catch (err) {
      setResponse("Bharti docent service is briefly reconnecting. Please ask again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is active in Chrome and Edge. Please type your query.");
      return;
    }
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
    }
  };

  const speakAloud = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) => v.lang.includes("hi-IN") || v.lang.includes("en-IN")
    );
    if (targetVoice) utterance.voice = targetVoice;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 border rounded-2xl bg-card shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-sm">Bharti — Indic Voice Docent</span>
        </div>
        <button
          type="button"
          onClick={() => (isSpeaking ? window.speechSynthesis.cancel() : speakAloud(response))}
          className="text-xs px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 flex items-center gap-1.5 transition cursor-pointer"
        >
          {isSpeaking ? "⏹ Stop Audio" : "🔊 Listen"}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleAsk(query.trim());
            }
          }}
          placeholder="Speak or type in Hindi/English..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
        />
        <button
          type="button"
          onClick={startVoiceInput}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isListening ? "Listening..." : "🎙️ Speak"}
        </button>
        <button
          type="button"
          onClick={() => query.trim() && handleAsk(query.trim())}
          disabled={isLoading || !query.trim()}
          className="px-3 py-2 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition cursor-pointer"
        >
          {isLoading ? "Searching..." : "Ask"}
        </button>
      </div>

      <div className="p-3 bg-muted/40 rounded-xl text-sm leading-relaxed border">
        {response}
      </div>
    </div>
  );
}
