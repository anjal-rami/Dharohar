import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  answerQuestion,
  buildContext,
  greetingAnswer,
  isConversationalGreeting,
  type AssistantAnswer,
} from "@/lib/heritage-assistant";
import { findTempleMatch, BHARTI_TEMPLE_GUARDRAILS } from "@/lib/chatbot-guardrails";
import { LANGUAGE_META, type Locale } from "@/lib/i18n";

const askSchema = z.object({
  question: z.string().trim().min(1).max(500),
  locale: z.string().refine((v): v is Locale => v in LANGUAGE_META),
});

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
// llama-3.3-70b reached end of life 2026-08-26; override with NVIDIA_MODEL if needed.
const NVIDIA_MODEL = process.env["NVIDIA_MODEL"] ?? "nvidia/nemotron-3-super-120b-a12b";
const TIMEOUT_MS = 25_000;

function systemPrompt(locale: Locale) {
  const language = LANGUAGE_META[locale].label;
  return [
    "You are Bharti, an authentic, warm, and knowledgeable AI heritage assistant for the Dharohar / VisionX platform.",
    "- If the user only greets you, respond with a warm cultural greeting (Namaste) and offer assistance.",
    "- NEVER invent, assume, or default to a monument (like Golconda Fort) unless the user explicitly asks about it or the search engine provides a high-confidence match.",
    "- If no specific site is queried or matched, ask clarifying questions to guide the user.",
    "Answer the user's question using ONLY the provided verified records.",
    "Be warm, culturally sensitive, respectful, and factually accurate.",
    "Never guess or invent outside facts, dates, monuments, crafts, or citations.",
    "Name the record titles you used so they can be linked to their citations.",
    "Answer directly — never show your reasoning or planning process.",
    `Reply in ${language}. Keep the answer clear and factual.`,
    "Use **bold** around record titles and key cultural terms (markdown).",
    BHARTI_TEMPLE_GUARDRAILS,
  ].join(" ");
}

/**
 * Server-side Bharti:
 * 1. Checks conversational greetings immediately before running retrieval.
 * 2. Checks query via structured pipeline (normalization, exact match, alias, fuzzy, and clarification).
 * 3. If it's a greeting, clarification, or unknown term, returns the safe, constructive guidance directly to prevent hallucinations.
 * 4. When verified records are retrieved, NVIDIA NIM LLM synthesizes a fluent, cited response strictly from the records.
 * 5. Falls back to deterministic local answer if the API fails, times out, or has no key.
 */
export const askBharti = createServerFn({ method: "POST" })
  .validator((input: unknown) => askSchema.parse(input))
  .handler(async ({ data }): Promise<AssistantAnswer> => {
    // 1. Handle Greetings Directly without Heritage Retrieval
    if (isConversationalGreeting(data.question)) {
      return greetingAnswer(data.locale);
    }

    // 2. Strict Temple Knowledge Base Check: Enforce exact schema without LLM latency or drifting
    const templeMatch = findTempleMatch(data.question);
    if (templeMatch) {
      return answerQuestion(data.question, data.locale);
    }

    const local = answerQuestion(data.question, data.locale);

    // If query is an unknown cultural term, needs clarification, or is a greeting,
    // return the safe, grounded response directly to avoid LLM hallucinations on nonexistent entities.
    if (
      local.status === "clarification_needed" ||
      local.status === "unknown_term" ||
      local.status === "greeting" ||
      local.retrieved.length === 0
    ) {
      return local;
    }

    const apiKey = process.env["NVIDIA_API_KEY"];
    if (!apiKey) return local;

    const context = buildContext(local.retrieved, data.locale);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(NVIDIA_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            { role: "system", content: systemPrompt(data.locale) },
            {
              role: "user",
              content: `Verified records:\n\n${context}\n\nQuestion: ${data.question}`,
            },
          ],
        }),
      });

      if (!response.ok) return local;

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) return local;

      return {
        text,
        confidence: local.confidence,
        status: local.status,
        sources: local.sources,
        retrieved: local.retrieved,
        suggestions: local.suggestions,
        canReport: true,
      };
    } catch {
      return local;
    } finally {
      clearTimeout(timer);
    }
  });
