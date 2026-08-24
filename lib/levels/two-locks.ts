// Level 17 — two-step equations: socks and shoes. In kx + b = c the ×k lock
// went on the box FIRST and the +b lock went on LAST — so the +b comes off
// first. Last on, first off, exactly like getting undressed.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { balanceFigure } from "../model";
import type { Weight } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["x", "n", "a"] as const;

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: kL + b = c   1: kL − b = c
  const L = rng.pick(LETTERS);
  const k = rng.int(2, 4);
  const h = rng.int(3, 8);
  const b = shape === 0 ? rng.int(1, 9) : rng.int(1, k * h - 1);
  const c = shape === 0 ? k * h + b : k * h - b;
  const sign = shape === 0 ? "+" : "−";
  const eq = `${k}${L} ${sign} ${b} = ${c}`;
  const kh = k * h;

  const boxRow: Weight[] = Array.from({ length: k }, () => ({ label: L, box: true }));
  const dq = decoys(
    rng,
    "Should I pull both locks off at the same time?",
    "Should I put my shoes on before my socks?",
  );

  return {
    promptText: `TWO locks on this case: ${eq}. The ×${k} lock went on the box FIRST, the ${sign}${b} lock went on LAST. Socks and shoes!`,
    figure: balanceFigure(L, {
      left: [...boxRow, { label: `${sign} ${b}` }],
      right: [{ label: String(c) }],
      caption: "two locks to open",
    }),
    steps: [
      choiceStep(
        rng,
        "order",
        "Which lock comes off FIRST?",
        `The ${sign}${b} — it went on last`,
        [`The ×${k} — it looks stronger`, "Both locks at once"],
        "Shoes went on last, shoes come off first. Undo the LAST thing done to the box before the first.",
        dq,
        {
          left: [...boxRow, { label: `${sign} ${b}`, crossed: true }],
          right: [{ label: shape === 0 ? `${c} − ${b}` : `${c} + ${b}` }],
          caption: `undo ${sign}${b} on BOTH sides`,
        },
      ),
      numStep(
        "first",
        shape === 0
          ? `Undo the ${sign}${b} on both sides: ${c} − ${b} = ?`
          : `Undo the ${sign}${b} on both sides: ${c} + ${b} = ?`,
        kh,
        "One lock at a time — the scale stays level while both sides change together.",
        dq,
        {
          left: boxRow,
          right: [{ label: String(kh) }],
          caption: `one lock left: ×${k}`,
        },
      ),
      numStep(
        "second",
        `Now ${k} matching boxes weigh ${kh}. One box: ${kh} ÷ ${k} = ?`,
        h,
        "Twins share fairly — sharing undoes the hidden times.",
        dq,
        {
          left: [{ label: L, box: true }],
          right: [{ label: String(h) }],
          caption: "both locks open!",
          done: h,
        },
      ),
      numStep(
        "check",
        `Check the whole case: ${k} × ${h} ${sign} ${b} = ?`,
        c,
        "Run the original line with your number in the box — a true line closes the case.",
        dq,
        {
          left: [{ label: L, box: true }],
          right: [{ label: String(h) }],
          caption: `✓ the case is closed`,
          done: h,
        },
      ),
    ],
    finalAsk: `Crack it: ${eq}. What is ${L}?`,
    finalAnswers: [{ label: L, value: h }],
    data: { shape, k, h, b, c },
  };
}

export const twoLocks: Framework = {
  id: "two-locks",
  title: "Two Locks",
  emoji: "🔐",
  family: FAM.crack,
  blurb: "Last lock on, first lock off — socks and shoes!",
  generate,
  invariant: (d) =>
    (d.shape === 0 ? d.k * d.h + d.b === d.c : d.k * d.h - d.b === d.c) &&
    d.c >= 1 &&
    d.h >= 3 &&
    d.k >= 2,
};
