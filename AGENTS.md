<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->
<!-- ======================================================== -->
<!-- PONYTAIL AGENTIC EXECUTION RULES                        -->
<!-- ======================================================== -->

## Ponytail Execution & Task Automation Rules

### 1. Loop Lifecycle & Autonomous Execution
- **Atomic Iteration**: Break down every high-level user request into discrete, verifiable subtasks before taking action.
- **Autonomous Step-Through**: Execute tasks sequentially through the Ponytail runner loop without asking for user intervention on routine operations (e.g., file reading, grep searches, minor linting).
- **Termination Invariant**: Do not terminate an execution loop until the primary task deliverable has been tested, validated, or verified against project requirements.

### 2. Context Discovery & Workspace Inspection
- **Inspect Before Modifying**: Never guess file paths, schema definitions, or export signatures. Always inspect the relevant files (`read_file`, `list_dir`, `grep_search`) before generating or editing code.
- **Respect Framework Constraints**: Maintain consistency with the detected framework stack (e.g., TanStack Start SSR, Vite, React 19). Do not introduce invalid route conventions or incompatible runtime exports.
- **Server vs. Client Isolation**: Never import server-only modules (`pg`, `jsonwebtoken`, `bcryptjs`, database pools) into client-facing components or shared route files. Always encapsulate server logic inside server functions or dedicated `.server.ts` modules.

### 3. File Modification & Patch Quality
- **Surgical Edits**: Use targeted replacements or discrete file rewrites. Do not strip existing comments, utility functions, or unrelated configuration blocks.
- **Syntax & Import Validation**: Ensure all imports are resolved from installed packages. If an import fails under current bundling conditions, adjust to the valid package export path immediately.
- **Clean Residuals**: After refactoring or moving routes, proactively clean up stale files, orphan exports, and lingering build artifacts (e.g., clearing generated route trees or Vite caches if required).

### 4. Verification & Self-Correction
- **Active Verification**: After generating or altering code, verify that the application compiles without syntax errors or runtime exceptions.
- **Self-Healing on Crash**: If a server or runtime error occurs during a loop iteration, read the full terminal error trace, pinpoint the root cause (e.g., invalid import, missing dependency, misconfigured route), and apply the fix within the same loop.
- **Explicit Completion**: At the end of the loop, output a concise bulleted summary of files created/edited, errors resolved, and next steps for testing.
<!-- ======================================================== -->
<!-- DHAROHAR / VISIONX DOMAIN & ARCHITECTURE CONSTRAINTS     -->
<!-- ======================================================== -->

## 5. TanStack Start SSR & Hydration Safety Rules
- **No Direct Browser API Calls during SSR**: WebGL, `window`, `document`, `navigator.mediaDevices`, `localStorage`, and Web Speech APIs must NEVER be invoked at the module root or outside of `useEffect` / `typeof window !== 'undefined'` checks.
- **Dynamic Client Isolation**: Any component relying on Canvas/DOM references (e.g., `artifact-3d-viewer.tsx`, `tour-360-viewer.tsx`, `india-maplibre.tsx`) must mount dynamically or guard against hydration mismatches.
- **Route File Discipline**: Do NOT place raw API handlers inside `src/routes/` with non-standard exports. Use `createServerFn` for data querying to avoid corrupting `routeTree.gen.ts`.
- **Server Module Segregation**: Server-only drivers (`pg`, `bcryptjs`, `jsonwebtoken`) must only be imported inside `.server.ts` files or inside the execution context of `createServerFn`.

## 6. Cultural Data Grounding & Anti-Hallucination Policy
- **Verified Sources Only**: All cultural facts, dates, dynasty names, and architectural claims must strictly ground on verified records (ASI, UNESCO, Sahapedia, IGNCA).
- **Anti-Hallucination Fallback**: If a query mentions an unverified entity, mythical claim as historical fact, or unrecognized site, the agent/assistant must return a neutral clarification and guide the user to verified records or the Citizen Archive.
- **Multilingual Integrity**: Never strip Indic phonetic transliterations or localized text strings (`src/lib/i18n.tsx`). Ensure UI prompts maintain tone consistency across all supported regional languages[cite: 1].

## 7. WebGL & Three.js Memory Management Rules
- **Mandatory Lifecycle Cleanup**: Every Three.js scene, renderer, geometry, texture, and animation frame request MUST be explicitly disposed of in the `useEffect` cleanup return callback (`renderer.dispose()`, `controls.dispose()`, `cancelAnimationFrame`).
- **Asset Size Guard**: Ensure 3D models (`.glb`/`.gltf`) and panoramic 360° textures default to compressed or CDN-cached assets to avoid browser out-of-memory (OOM) crashes during live demonstrations.
- **Responsive Canvas Resize**: All WebGL canvases must attach a `ResizeObserver` to their parent container rather than listening directly to window resize events to support modular dashboard layouts.

## 8. SIH Hackathon Presentation & Demo Guardrails
- **Graceful Offline Fallbacks**: If external API endpoints (NVIDIA NIM, external map tiles, or S3 uploads) fail or hit rate limits, the UI must gracefully fall back to local cached mock datasets without throwing an unhandled exception or breaking the page view[cite: 1].
- **Demo State Preservation**: When testing or altering user profiles, streaks, or quiz stats, always provide persistent mock seeds so the application never appears empty or unpopulated during an evaluation session.
