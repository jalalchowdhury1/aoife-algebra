// Shared step factories + the app's vocabulary. EVERY level assembles its
// script from these so wording stays identical wherever an idea reappears.
//
// Vocabulary (keep it consistent — she learns these words):
//   mystery box   a box hiding ONE number (she knows it as ◻ from Borrow & Carry)
//   name sticker  the letter on a box — x is a box wearing a name tag
//   warm / cold   numbers right / left of zero; warm hops go right, cold go left
//   hugging brackets  the ( ) around a cold number so two signs don't bump
//   bags          k(x + b) is k bags — tipped out or packed up (from Which First?)
//   socks & shoes two-step equations: last thing on comes off first
import type { Rng } from "../rng";
import type { Step, Choice } from "../types";
import type { FigState } from "../model";

export const FAM = {
  box: "📦 The Mystery Box",
  code: "🔤 Secret Code",
  zero: "❄️ Below Zero",
  shop: "🧰 Code Workshop",
  crack: "⚖️ Crack the Case",
  machine: "🤖 Machines & Cases",
} as const;

/* --------------------------------- decoys ---------------------------------- */
// Plausible-but-wrong MOVES for the Lead stage. None may ever equal a real ask
// in the same problem (self-test rule) — they are phrased as musings, real asks
// as instructions, which keeps them apart by construction.

const GENERIC_DECOYS = [
  "Should I just guess a number and hope?",
  "Should I add up every number I can see?",
  "Should I start from the right-hand end?",
  "Do I need to make the numbers bigger first?",
  "Should I write the biggest number I know?",
];

export function decoys(rng: Rng, ...extra: string[]): string[] {
  return rng.shuffle([...GENERIC_DECOYS, ...extra]).slice(0, 3);
}

/* ------------------------------ step factories ------------------------------ */

export function choiceStep(
  rng: Rng,
  id: string,
  ask: string,
  correct: string,
  wrongs: string[],
  hint: string,
  dq: string[],
  figState?: FigState,
): Step {
  const choices: Choice[] = rng.shuffle(
    [correct, ...wrongs].map((label) => ({ label, value: label })),
  );
  return { id, ask, answer: correct, input: "choice", choices, hint, decoyQuestions: dq, figState };
}

export function numStep(
  id: string,
  ask: string,
  answer: number,
  hint: string,
  dq: string[],
  figState?: FigState,
): Step {
  return { id, ask, answer, input: "number", hint, decoyQuestions: dq, figState };
}
