# Dharohar — India Heritage Discovery Platform

Built for **Smart India Hackathon 2026**: a multilingual, accessible, community-driven
platform that unifies fragmented cultural information about India's heritage.

> **Demo data notice.** Every heritage record, reel, trail, contribution and preservation
> report in this build is labelled `demo`. Production records carry `verified` origin plus
> citations from government, academic and museum sources. The UI badges the difference on
> every card and detail page.

## Stack

This project runs on the Lovable stack (a Next.js + NestJS + Docker monorepo is not
available here), mapped onto equivalent capabilities:

| Requirement in the brief                  | Implementation here                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| React + TypeScript + Tailwind + shadcn/ui | TanStack Start (React 19, SSR), Tailwind v4, shadcn/ui                             |
| REST API / NestJS services                | TanStack server functions + server routes (`/api/public/*` for external callers)   |
| PostgreSQL + PostGIS                      | Lovable Cloud Postgres (PostGIS + pgvector available) — phase 2                    |
| Redis cache/queues                        | Query-layer caching now; durable jobs via scheduled server routes — phase 2        |
| S3 object storage                         | Lovable Cloud storage with signed upload URLs — phase 2                            |
| LLM provider                              | Lovable AI Gateway behind the `heritage-assistant` abstraction                     |
| MapLibre                                  | Provider-agnostic map component (`india-map.tsx`) with accessible list alternative |

## Pages

| Route             | Purpose                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Hero search, India heritage map, featured categories, cultural regions, reels, trails, CTA                                                     |
| `/explore`        | Advanced filters: state, category, era, language, UNESCO/intangible, accessibility, sort                                                       |
| `/heritage/$slug` | Verified description, multilingual content, gallery, 360° placeholder, reel, map, trails, preservation, citations, community stories, artisans |
| `/trails`         | GIS trails: nearby sites, travel mode, duration, saved itineraries, local services                                                             |
| `/assistant`      | Text + voice input, source-cited answers, confidence flags, suggested prompts, disclaimer                                                      |
| `/reels`          | Sanskriti Reels with per-language captions, save/share/report                                                                                  |
| `/archive`        | Citizen Archive upload flow, consent handling, submission status and moderator feedback                                                        |
| `/preservation`   | Condition map: safe / needs attention / at risk / under restoration + field reports                                                            |
| `/quiz`           | Quizzes, streaks, badges, leaderboard                                                                                                          |
| `/profile`        | Saved sites, itineraries, uploads, badges, language, notifications, DPDP privacy controls                                                      |
| `/admin`          | Moderation queue, AI-reel review, reports, preservation confirmations, audit log                                                               |

## Architecture

```text
src/
  routes/                 # file-based routes (pages + future /api/* server routes)
  components/
    layout/               # header, footer, page header
    heritage/             # cards, chips, map, search, language selector, sources
    ui/                   # shadcn/ui primitives
  lib/
    i18n.tsx              # locale provider + dictionaries (en, hi, ta, bn)
    heritage-data.ts      # demo dataset + geo helpers (Haversine ≈ PostGIS ST_Distance)
    heritage-assistant.ts # AI service abstraction (retrieval → answer → citations)
    register-pwa.ts       # guarded service-worker registration
```

Data model already expressed in types: `HeritageSite`, `HeritageCategory`, `CulturalRegion`,
`VerifiedSource`, `CommunityStory`, `Artisan`, `Reel`, `Trail`/`TrailStop`, `Contribution`,
`QuizQuestion`, `Badge`, `PreservationReport`, `ModerationStatus`, `PreservationStatus`.
These map 1:1 onto the Postgres tables in phase 2.

## Languages

English, Hindi, Tamil, Bengali, Gujarati and Marathi ship with UI strings; the first four
also carry per-record content. Adding one of the remaining scheduled languages means adding
a dictionary in `src/lib/i18n.tsx` and locale keys on records — no component changes.
Missing translations fall back to English.

## Accessibility

Skip link, semantic landmarks, single H1 per page, labelled inputs, focus-visible outlines,
`aria-live` result counts, an accessible list alternative for every map, and
accessibility metadata (wheelchair, audio guide, sign language) on each record.

## PWA / offline

`vite-plugin-pwa` (`generateSW`) with network-first navigations and cache-first images/fonts,
plus `public/manifest.webmanifest`. Registration is guarded: it never runs in dev, in an
iframe, or on Lovable preview hosts, and `?sw=off` unregisters. Offline behaviour is
observable in the published app only.

## Phase 2 (backend)

1. Enable Lovable Cloud; create tables above with RLS + explicit grants; enable PostGIS and pgvector.
2. Auth with roles `visitor / user / contributor / expert / moderator / admin` in a separate
   `user_roles` table with a `has_role()` security-definer function.
3. Server functions for catalog, search (vector + full-text fallback), trails, uploads
   (signed URLs), moderation, preservation, quiz, notifications and audit logs.
4. Replace `answerQuestion` internals with Lovable AI Gateway RAG over verified records only,
   keeping the same return shape (`text`, `confidence`, `sources`, `retrieved`).
5. Seed migration with literal INSERTs for demo content across states and categories.

## Local assets & environment setup

- **Environment variables.** Copy `.env.example` to `.env` and fill in real values
  (NVIDIA API key for the Bharti assistant, JWT secret, database URL). `.env` is
  git-ignored and must never be committed.
- **Videos.** Demo reels live in `public/videos/` but are excluded from this
  repository (individual files exceed GitHub's 100 MB limit). The site renders
  without them; to restore locally, place the `.mp4` files back into
  `public/videos/`.
- **Staging folders.** Root-level asset folders (`Craft & Handlooms/`,
  `Festival Images/`, `food/`, `directory/`, …) are script input material; the
  `scripts/` pipeline re-downloads them from Wikimedia and public endpoints.
