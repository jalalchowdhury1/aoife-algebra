# AGENTS.md — Mystery Numbers (aoife-algebra)

> **Single source of truth for anyone (human or AI) touching this repo.** Read it fully
> before changing code or "fixing" anything. If something here is wrong, fix *this* file.
> README.md is Jalal's plain-English doc — leave it alone unless asked.

The sixth sibling in Aoife's set: `aoife-math` drills operations, `aoife-frameworks`
teaches word-problem reasoning, `aoife-columns` teaches the written column algorithm,
`aoife-order` teaches the order of operations, `aoife-puzzles` builds her WISC-style
puzzle profile — and **this app teaches PRE-ALGEBRA**: variables, expressions,
negative numbers, like terms, distribute/factor, one- and two-step equations,
function machines and word problems.

There is **no backend, no database, no API, no auth, no accounts, no timer**. Static
client-side site; progress lives in `localStorage["aoife-algebra-progress"]`.

---

## 1. What this is

**Next.js 16 (App Router) + React 19 + Tailwind v4**, static, deploys to **Vercel**
(`aoife-algebra.vercel.app`). Same pink/purple **Bubblegum Sans** look and the same
5-pill ladder as the siblings: **👀 Watch → 🤝 Together → 🧭 Lead → 🦋 Solo** +
**🔁 Practice** (five fresh solo problems in a row). The engine (`lib/engine/`) is
copied from `aoife-order` with exactly one extension: **the Numpad has a − key**
(negative answers exist from World 3 on) and entries may carry a leading minus.

Origin note: built 2026-08-23 from a purchased pre-algebra workbook Jalal supplied.
The workbook's mission list shaped the CURRICULUM ONLY — every problem here is
generated, every teaching script and metaphor is original, and none of the book's
text, art or branding appears in this repo (its licence forbids re-posting it, and
generated problems are better anyway: she gets hundreds per level, not four).

## 2. THE IDEA — do not water this down

Algebra is normally introduced as "a letter stands for a number", which is exactly
backwards for a six-year-old: it makes the letter the mysterious thing. This app
rests on bridges from things she has ALREADY mastered in the sibling apps:

> **A variable is a mystery box wearing a name sticker.** She has solved ◻ puzzles
> in Borrow & Carry for weeks. `x` is that same box with a name tag — nothing new.
>
> **Bags and piles carry over from Which First?**: `3(x + 4)` is three bags each
> holding one x-box and 4 marbles. Distribution is tipping the bags out; factoring
> is packing them back. Like terms: you count x-BOXES together, but loose marbles
> never climb into boxes.
>
> **Negative numbers are the frog's line**: warm numbers right of 0, cold numbers
> left. Adding cold drags you left; subtracting cold is the DOUBLE FLIP (turn
> around + walk backwards = forward). The × sign rule is DISCOVERED via the
> pattern staircase, never decreed.
>
> **Equations are a level scale**: the only legal moves keep it level. Two-step
> equations are socks and shoes: last lock on, first lock off.

Design laws inherited from the siblings, all enforced here:
- **Concrete before symbols.** Level 1 has no letters at all.
- **See it happen, never memorise it.** Every rule arrives with its WHY.
- **Never suddenly difficult.** One new idea per level; everything else in the
  level is already mastered. All arithmetic stays inside her known times tables.
- **Win-heavy.** She should be right most of the time or she disengages (the
  aoife-puzzles lesson).

## 3. The ladder — 21 levels, 6 worlds

| # | id | world | teaches |
|---|----|-------|---------|
| 1 | whats-in-the-box | 📦 Mystery Box | ◻ + 4 = 11 — find + check, no letters |
| 2 | box-gets-a-name | 📦 | the box wears a sticker: n = 7, n + 3 = ? |
| 3 | same-letter-same-number | 📦 | twins: same sticker, same number |
| 4 | words-to-code | 🔤 Secret Code | "5 more than x" → x + 5; the "less than" trap |
| 5 | the-hidden-times | 🔤 | 2y = 2 × y, the squished ×; 3a + 1 |
| 6 | below-zero | ❄️ Below Zero | the line both ways, compare, opposites, distance |
| 7 | hop-past-zero | ❄️ | 2 − 5 = −3, crossing zero both directions |
| 8 | adding-cold | ❄️ | 4 + (−6); hugging brackets |
| 9 | the-double-flip | ❄️ | 3 − (−4) = 3 + 4 |
| 10 | cold-times | ❄️ | ×/÷ sign rules via the pattern staircase |
| 11 | feed-the-box | 🧰 Code Workshop | evaluate 2a + 1 at a = 5; builder first |
| 12 | matching-pieces | 🧰 | 3x + 2x = 5x; 4x + 3 stays put |
| 13 | share-it-out | 🧰 | k(x ± b) = kx ± kb, bags tipped out |
| 14 | pack-the-bags | 🧰 | gx + gb = g(x + b) |
| 15 | keep-it-level | ⚖️ Crack the Case | x + 6 = 14 / n − 5 = 9 |
| 16 | undo-the-times | ⚖️ | 3a = 21; y ÷ 4 = 3 |
| 17 | two-locks | ⚖️ | kx ± b = c, socks and shoes |
| 18 | crack-the-bag | ⚖️ | k(x ± b) = c, share first |
| 19 | the-machine | 🤖 Machines & Cases | function machine forward + one reverse |
| 20 | find-the-rule | 🤖 | discover ×k + b from a table |
| 21 | detective-cases | 🤖 | story → equation → solve → check (capstone) |

Nothing is ever locked; the home page rings the first level without a solo pass.

### Deliberate scope cuts (do not "complete" these casually)
- **No exponents** (n²). New notation + new idea at once breaks the gentleness law.
- **No negative outside factor** −2(x + 5) — needs cold-times × distribution in one
  breath. Distribution is fully taught with positive factors. When she's fluent in
  Worlds 3+4, add it as a level after `share-it-out` reusing the IOU-note metaphor.
- **No standalone order-of-operations content** — that is `aoife-order`'s whole job.
  This app only leans on "× builds before + gathers" (level 11 recalls it).
- **÷ is always the ÷ symbol**, never `/`. Negatives always render with a proper
  minus (−3, never -3) and wear hugging brackets after an operator: 4 + (−6).

## 4. Architecture

```
app/page.tsx            home: worlds → level tiles, hidden parent peek (5 taps on title)
app/f/[id]/page.tsx     level page → StageEngine
lib/types.ts            Framework / Problem / Step contract (identical to siblings)
lib/model.ts            figure specs + cumulative figState semantics + figureAt + fmt/par
lib/rng.ts              seeded rng (mulberry-ish), tests always pass explicit seeds
lib/progress.ts         localStorage progress (key aoife-algebra-progress)
lib/engine/             StageEngine, StageRunner, PracticeRunner, Numpad(−), ChoicePad
lib/figures/            Boxes, NumberLine, Balance, Machine, AlgLine + Figure dispatcher
lib/levels/shared.ts    FAM, decoys(), choiceStep(), numStep() — ALL wording lives here-ish
lib/levels/<id>.ts      one file per level: { id,title,emoji,family,blurb,generate,invariant }
lib/levels/levels.test.ts  the 500-seed generator contract (see §6)
docs/superpowers/specs/    the original design doc
```

- Levels hand-script their steps (there is no generic solver here — the maths per
  level is too varied); `shared.ts` factories keep wording consistent.
- **figState semantics (DO NOT CHANGE):** a step's `figState` is a CUMULATIVE
  snapshot shown only after that step is ANSWERED; `figureAt` carries the latest
  one forward; Solo and Practice always show the bare initial figure.
- A figure must never display a number she hasn't answered yet — that is why every
  reveal lives on a figState and never on the base figure.

## 5. How to run / test / deploy

```bash
npm run dev                      # local dev (Turbopack)
npx vitest run                   # 126 tests — must be green before ANY deploy
npm run lint && npm run build    # both must be clean
vercel --prod --yes              # deploy (GitHub auto-deploy NOT connected)
vercel alias set <deployment-url> aoife-algebra.vercel.app
```

- `npm install` on this Mac needs `--cache ./.npm-cache` (global npm cache has
  root-owned files); or copy `node_modules` from a sibling (identical lockfile
  family). `.npm-cache/` is gitignored.
- Commit straight to `main`. Public repo `jalalchowdhury1/aoife-algebra`.

## 6. The generator contract (self-test — DO NOT BREAK)

`lib/levels/levels.test.ts` runs every level across **500 seeds**:

1. the level's own `invariant(data)` holds for every seed;
2. every answer is an integer with |v| ≤ 150;
3. **negatives are fenced** — levels before `below-zero` never produce a negative
   answer or show one in an ask (she hasn't met them yet);
4. choice steps: answer present, options distinct, and the correct option's
   position VARIES across seeds (no "always tap the top");
5. Lead-stage decoys never collide with a real ask in the same problem;
6. a number-step's hint never contains its own answer;
7. generators actually vary (≥5 distinct data signatures per level).

Several generators carry small nudges purely to keep rule 4/6 honest (e.g.
`matching-pieces` bumps k when j+k = j·k would collide a decoy with the answer;
`undo-the-times` re-rolls h = k because the hint names the k-times table). If you
touch ranges, run the suite — these collisions are exactly what it catches.

## 7. Gotchas / hard rules

- **No timers, ever** (owner rule from aoife-math). No streaks either.
- **Never deploy without the full gate**: vitest → lint → build → play a level in
  a real browser → deploy. A broken level teaches a six-year-old a false lesson
  (see the aoife-puzzles validity incident).
- The engine's Numpad − key: entry state is a plain string that may start with
  "-"; display swaps it for a proper − (renderRich + inline replace). `Number()`
  parses it. Don't "simplify" the sign toggle into a digit.
- Headless Chrome on this Mac wedges after a few `--screenshot` runs
  (`pkill -9 -f headless`); the claude-in-chrome extension can't reach
  `localhost` — use the LAN IP (`ipconfig getifaddr en1`).
- Deploy is CLI-only: `vercel --prod --yes` then alias. Pushing to GitHub does
  NOT deploy (Vercel GitHub App has no access to this repo — same as siblings).
- Watch/Together/Lead generate a NEW random problem per stage visit; Solo asks
  the same problem's finals — that repetition is intentional (siblings do it too).

## 8. State / TODO

- Built + shipped 2026-08-23. 126 vitest green; lint/build clean; Level 1 Watch,
  Below Zero Watch+Together (incl. − key), balance/machine/line figures verified
  in Chrome at desktop size before deploy.
- Aoife has not played it yet — watch her first sessions before tuning ramps.
- Extension slots, in priority order, when she's ready:
  1. negative outside factor level (after `share-it-out`),
  2. exponents-as-repeated-times mini-world,
  3. rules with − offsets in `find-the-rule` (book's Machine B is 3x − 1),
  4. optional Telegram round-summary like aoife-math (lib/telegram + API route).

## Home Screen install (2026-09-27)

Progress is localStorage-only, and Safari wipes a site's storage after 7 days without a
visit. A web app **added to the Home Screen** is exempt from that purge, so the app ships
`app/manifest.ts` (→ `/manifest.webmanifest`, display standalone), `app/apple-icon.png`
(180px, → `<link rel="apple-touch-icon">`), `public/icon-192.png` + `public/icon-512.png`,
and `appleWebApp` + `apple-mobile-web-app-capable` in `app/layout.tsx` metadata. Icons are a
pink-400 → purple-500 gradient with a white glyph. Don't remove these. Caveat: the installed
app has its OWN storage — stars earned in the Safari tab do not carry over to the icon.
