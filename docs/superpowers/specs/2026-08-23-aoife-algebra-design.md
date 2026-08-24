# Mystery Numbers (aoife-algebra) — design

**Date:** 2026-08-23 · **Status:** approved by owner directive ("make this into an app,
learning + practice, fun, never suddenly difficult, the app does it all") — remote-control
session, decisions resolved from established sibling conventions.

## What it is

The sixth Aoife app: a **pre-algebra learning + practice game** covering the full
curriculum of a purchased pre-algebra workbook (variables → expressions → integers →
like terms / distribute / factor → one- and two-step equations → function machines →
word problems). Original content only — the workbook's text, art and branding are NOT
reproduced (its terms forbid re-posting; and generated problems are better anyway).

- Repo `jalalchowdhury1/aoife-algebra` (public), live at **aoife-algebra.vercel.app**.
- Next.js 16 + React 19 + Tailwind v4, static, no backend; progress in
  `localStorage["aoife-algebra-progress"]`. No timer anywhere (house rule).
- Engine copied unchanged from `aoife-order`: 👀 Watch → 🤝 Together → 🧭 Lead →
  🦋 Solo + 🔁 Practice (5-in-a-row). Only changes: `figureAt` now lives in
  `lib/model.ts`, and the Numpad grows a **± key** (negative answers exist from World 3).

## The teaching idea — bridges from apps she has already mastered

1. **A variable is a mystery box with a name sticker.** She has solved mystery-box
   (◻) puzzles in aoife-columns since July. `x` is introduced as *the same box she
   already knows, wearing a name tag*. Never "a letter that stands for a number" first.
2. **Bags and piles carry over** (aoife-order): `3(x + 4)` is three bags each holding
   one box and 4 marbles — tip them out and you must get 3 boxes and 12 marbles.
   Factoring is packing the bags back. Like terms: x-boxes vs loose marbles — you
   can count boxes together, but boxes never merge with marbles.
3. **Integers = a frog on a number line.** Warm hops go right, cold hops go left.
   Subtracting a cold number = turning around twice. The sign rule for × is taught by
   pattern-staircase, not decree.
4. **Equations = a balance scale** (whatever you do, do to BOTH sides), and two-step
   equations = socks-and-shoes (last thing on comes off first).

Design law inherited: **concrete before symbols; see it happen, never memorise it;
a rule always arrives with its WHY.**

## The ladder — 21 levels, 6 worlds

| # | id | world | teaches |
|---|----|-------|---------|
| 1 | whats-in-the-box | 📦 Mystery Box | ◻ + 4 = 11 — find + check, no letters yet |
| 2 | box-gets-a-name | 📦 | the box wears a sticker: n. If n = 7, n + 3 = ? |
| 3 | same-letter-same-number | 📦 | a + a; same letter = same number inside one puzzle |
| 4 | words-to-code | 🔤 Secret Code | "5 more than x" → x + 5; the "7 less than n" trap |
| 5 | the-hidden-times | 🔤 | 2y means 2 × y; 3a + 1 |
| 6 | below-zero | ❄️ Below Zero | number line, comparing, opposites, distance from 0 |
| 7 | hop-past-zero | ❄️ | 2 − 5 = −3; crossing zero both ways |
| 8 | adding-cold | ❄️ | 4 + (−6); the hugging brackets |
| 9 | the-double-flip | ❄️ | 3 − (−4) = 3 + 4 |
| 10 | cold-times | ❄️ | sign rules for × and ÷, taught by pattern staircase |
| 11 | feed-the-box | 🧰 Code Workshop | evaluate 2a + 1 at a = 5 (builder first — aoife-order callback) |
| 12 | matching-pieces | 🧰 | 3x + 2x = 5x; 4x + 3 stays 4x + 3 |
| 13 | share-it-out | 🧰 | 3(x + 4) = 3x + 12 (bags tipped out) |
| 14 | pack-the-bags | 🧰 | 6x + 12 = 6(x + 2), greatest fair bag |
| 15 | keep-it-level | ⚖️ Crack the Case | x + 6 = 14 / n − 5 = 9 on the balance |
| 16 | undo-the-times | ⚖️ | 3a = 21; y ÷ 4 = 3 |
| 17 | two-locks | ⚖️ | 3x + 2 = 17 — socks and shoes |
| 18 | crack-the-bag | ⚖️ | 3(x + 2) = 21 — share out the bags first |
| 19 | the-machine | 🤖 Machines & Cases | function machine forward + one reverse |
| 20 | find-the-rule | 🤖 | discover the rule from a table (climb-by → ×, offset → +) |
| 21 | detective-cases | 🤖 | story → equation → solve → check (capstone mix) |

Nothing is locked; home page rings the first level without a solo pass.

## Deliberate scope cuts (documented, not forgotten)

- **No exponents** (the book touches n² twice). New notation + new idea in one breath
  breaks the gentleness rule. Future extension.
- **No negative outside factor** −2(x + 5): needs cold-times × distribution at once.
  Distribution is fully taught with positive factors; extension slot noted in AGENTS.md.
- **No standalone order-of-operations level** — that is aoife-order's whole job; this
  app leans on it (builder-first) and its planned − ÷ extension stays over there.
- Division rendered **÷** everywhere (never /). Negative numbers always shown with the
  proper minus and hugging brackets after an operator: 4 + (−6).

## Architecture

- `lib/model.ts` — figure spec/state types + `figureAt` (cumulative snapshots, sibling
  semantics), display helpers (`fmt` for −), integer helpers. No level logic.
- `lib/figures/` — five kinds: `boxes` (mystery-box equation), `numline` (frog, hops),
  `balance` (scale with box + weights), `machine` (in → rule → out + table),
  `line` (generic working line of algebra chips with ring/glow/done).
- `lib/levels/shared.ts` — vocabulary + step factories (check-step, decoy pools) so
  wording is identical across levels.
- One file per level, sibling contract `{id,title,emoji,family,blurb,generate,invariant}`.
- `lib/levels/levels.test.ts` — 500 seeds × 21 levels: invariant holds; choice answers
  present + shuffled; decoys never collide with real asks; answers integer and inside
  known ranges; **levels 1–5 never produce a negative answer anywhere** (negatives are
  not met until World 3); hints never contain their step's answer; generators vary.

## Fun layer

Same as siblings: confetti, ⭐ mastery + 🔁 perfect-run badges on tiles, warm
celebration copy, hidden parent-peek (5 taps on title). No streaks, no timers.
