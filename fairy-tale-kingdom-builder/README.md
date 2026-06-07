# Fairy Tale Kingdom Builder 🪄

A gamified, browser-based English-learning web app for kids (~10 yrs, intermediate English), themed around a classic Prince & Princess fairy tale. Built to run in modern desktop and tablet browsers — no app-store download required.

## Tech Stack

- **React 18 + Vite** — fast, responsive SPA
- **Tailwind CSS** — pastel/glassmorphism fairy-tale UI, custom cursors, sparkle effects
- **Zustand (+ persist)** — game state: daily timer loop, Mana/Light Runes, kingdom inventory, tier
- **Framer Motion** — slide/scale transitions, particle + rune animations
- **Web Audio API** — layered "magic whispers" difficulty noise + reward chimes
- **Web Speech API** — `SpeechRecognition` for pronunciation, `SpeechSynthesis` for the talking mirror
- **HTML5 Drag & Drop** — Kingdom Builder grid placement
- **localStorage** — saved kingdom layout and progress

## Run it

```bash
cd fairy-tale-kingdom-builder
npm install
npm run dev      # open http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

> Speech recognition uses `webkitSpeechRecognition` — best in Chrome/Edge. Safari and
> mic-denied cases automatically fall back to a word-bubble answer cloud so play never stops.

## Core Mechanics

### Daily 40-minute loop

Four 10-minute modules unlock **in order**: Listening → Speaking → Reading → Writing.
A countdown drives each block; finishing the tasks (or the timer) locks the module and
animates the next into focus. The timer is client-side here (swap `tick`/`secondsLeft`
in `store/useGameStore.js` for a server-synced value in production).

### Light Rune Inventory (sticky side-dock)

`components/RuneDock.jsx` tracks **Mana Points** and **Light Runes** in real time. Correct
answers fire a CSS/Framer particle burst toward the counters.

### Kingdom Builder

`components/KingdomBuilder.jsx` — an 8×6 CSS grid. Spend Mana in the **Royal Bazaar** modal
to unlock assets, then drag them onto the grid (HTML5 DnD). Click to rotate, double-click to
remove. Layout persists via Zustand + localStorage.

## Week 1 — "The Mirror, Mirror on the Wall"

Content lives in `src/data/content.js` (data-driven, so new weeks/days are config-only).

| Module    | Days 1–3                          | Days 4–6                                  |
| --------- | --------------------------------- | ----------------------------------------- |
| Listening | Match the object/outfit clip      | Prepositions of place (under/behind/on)   |
| Speaking  | Read sentences aloud              | Open-ended conversation answers           |
| Reading   | 3D storybook + multiple choice    | Comprehension safe-path map               |
| Writing   | Spell adjectives                  | Full-sentence build (caps/punct/keyword)  |

Difficulty scales daily via rising "magic whispers" audio (`whisperLevel`).

## Day 7 Raid — "Shattering the Talking Mirror"

`components/Day7Raid.jsx` — a full-screen state that re-skins the UI to an icy dark-purple
aesthetic, with a Mirror HP bar and 4 stages:

1. **Listening** – rapid-fire audio riddles against a draining timer bar
2. **Reading** – rune text maze: pick the mirror's structural weakness
3. **Writing** – type learned sentences to fire Light Runes at the mirror
4. **Speaking** – live negotiation; full-sentence answers deplete the final HP

**Victory** → confetti, **+500 Mana**, weekly cycle reset, and promotion to
**Tier 2 · Sky Castle Academy**.

## Project structure

```
src/
  store/useGameStore.js     # Zustand store (+persist)
  data/content.js           # Week 1 content + bazaar assets + raid data
  hooks/useCountdown.js     # per-module 10-min timer
  utils/audio.js            # Web Audio whispers, TTS, chimes
  utils/speech.js           # SpeechRecognition + scoring
  components/
    TopBar, RuneDock, ModuleShell, KingdomBuilder, RoyalBazaar, Day7Raid, Confetti
    modules/ Listening|Speaking|Reading|Writing + ModuleFrame
```
