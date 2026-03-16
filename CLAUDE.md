# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `bun run dev` (Vite)
- **Build:** `bun run build`
- **Type check:** `bun run check`
- **Preview prod build:** `bun run preview`
- **Add shadcn component:** `bunx shadcn-svelte@next add <component>`

No test runner is configured.

## Architecture

This is a **SvelteKit + Svelte 5** ear training web app using Tailwind CSS v4, shadcn-svelte UI components, and the `tonal` library for music theory. Audio playback uses `smplr` (SplendidGrandPiano + Soundfont). It targets mobile-first with fullscreen and haptic feedback.

### Core modules (`src/lib/`)

- **`game.svelte.ts`** — Singleton game store (`export const game`) using Svelte 5 runes (`$state`). Manages game config, round generation, scoring, and phase transitions (`config → playing → results`). Three game modes: `interval`, `interval_piano`, `harmony`.
- **`theory.ts`** — Music theory data: intervals, triads, seventh chords, shell voicings. Uses `tonal` to compute semitone values. All data is exported as const arrays (`ALL_INTERVALS`, `ALL_TRIADS`, etc.).
- **`audio.ts`** — Audio engine: lazy-loads instruments via `smplr`, routes through a compressor node. Exposes `playInterval()`, `playIntervalHarmonic()`, `playTriad()`, `playNoteSequence()`. Supports swappable sound presets (grand piano, vibraphone, marimba, etc.).

### Route structure (`src/routes/`)

Each training mode follows a **settings → play** pattern with nested routes:
- `/interval/` (settings) → `/interval/play/` (game)
- `/interval_piano/` (settings) → `/interval_piano/play/` (game)
- `/harmony/play/` (game, settings are on sub-pages)
- `/dyads/`, `/triads/`, `/sevenths/` — harmony config pages that start games via the shared game store
- `/explore/` → `/explore/[semitones]/` — interval reference/explorer
- `/results/` — shared results page after any game

### UI components (`src/lib/components/`)

- `ui/` — shadcn-svelte primitives (button, card, badge, drawer, progress). Added via `bunx shadcn-svelte@next add`.
- `PianoKeyboard.svelte` — Interactive piano for the piano interval mode
- `AnswerButton.svelte`, `ToggleGrid.svelte` — Reusable game UI
- `HomeButton.svelte` — Navigation home button (house icon, top-right)
- `SoundDrawer.svelte` — Global sound preset picker (mounted in layout)

### Styling

Tailwind v4 with OKLCH color tokens defined in `src/app.css`. Dark mode uses the `.dark` class (managed by `mode-watcher`). Theme: Slate & Cyan. shadcn config in `components.json`.
