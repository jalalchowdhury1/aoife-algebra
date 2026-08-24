// Level 15 — one-step equations. Shape A on the balance scale: x + a = c,
// and the ONLY legal move is one that keeps the scale level — so whatever
// leaves the left pan leaves the right pan too. Shape B (n − a = c) is her
// old detective add-back, now wearing a letter.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { balanceFigure, boxesFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["x", "n", "m", "a"] as const;

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: L + a = c (balance)   1: L − a = c (add back)
  const L = rng.pick(LETTERS);
  const a = rng.int(2, 9);
  const h = rng.int(3, 12);
  const c = shape === 0 ? h + a : h - a;
  if (shape === 1 && c < 1) return generate(rng);
  const eq = shape === 0 ? `${L} + ${a} = ${c}` : `${L} − ${a} = ${c}`;

  const dq = decoys(
    rng,
    "Should I tip everything off the scale and start again?",
    "Should I lean on one side of the scale?",
  );

  if (shape === 0) {
    return {
      promptText: `The scale is perfectly LEVEL: the ${L}-box and ${a} together weigh the same as ${c}. Find the box — but the scale must STAY level!`,
      figure: balanceFigure(L, {
        left: [{ label: L, box: true }, { label: String(a) }],
        right: [{ label: String(c) }],
      }),
      steps: [
        choiceStep(
          rng,
          "move",
          `We want the ${L}-box ALONE on the left. What's the legal move?`,
          `Take ${a} off BOTH sides`,
          [`Take ${a} off just the left side`, `Add ${a} more to the left side`],
          "Whatever leaves one pan must leave the other, or the scale tips and the = stops being true.",
          dq,
          {
            left: [{ label: L, box: true }, { label: String(a), crossed: true }],
            right: [{ label: `${c} − ${a}` }],
            caption: `${a} off BOTH sides`,
          },
        ),
        numStep(
          "solve",
          `The right side is now ${c} − ${a} = ?`,
          h,
          "A plain take-away — count back from the total.",
          dq,
          {
            left: [{ label: L, box: true }],
            right: [{ label: String(h) }],
            caption: "the box stands alone!",
            done: h,
          },
        ),
        numStep(
          "check",
          `Check it! Put ${h} back in: ${h} + ${a} = ?`,
          c,
          "Rebuild the original line with your number inside — a true line means the case is cracked.",
          dq,
          {
            left: [{ label: L, box: true }],
            right: [{ label: String(h) }],
            caption: `✓ ${h} + ${a} = ${c} — the case is cracked!`,
            done: h,
          },
        ),
      ],
      finalAsk: `Crack it: ${eq}. What is ${L}?`,
      finalAnswers: [{ label: L, value: h }],
      data: { shape, a, c, h },
    };
  }

  return {
    promptText: `Detective case: ${eq}. The ${L}-box LOST ${a} and landed on ${c} — your add-back flip, now with a name sticker!`,
    figure: boxesFigure(["□", "−", String(a), "=", String(c)], L),
    steps: [
      choiceStep(
        rng,
        "move",
        `${L} lost ${a} and landed on ${c}. How do we rebuild ${L}?`,
        `Add the ${a} back onto ${c}`,
        [`Take ${a} away from ${c}`, `Swap ${L} for a different letter`],
        "It went DOWN when it lost some — put them back ON to climb back up to the box's number.",
        dq,
      ),
      numStep(
        "solve",
        `${c} + ${a} = ?`,
        h,
        "Count back up from where it landed.",
        dq,
        { value: h },
      ),
      numStep(
        "check",
        `Check it! ${h} − ${a} = ?`,
        c,
        "Run the original line with your number inside — it must come out true.",
        dq,
        { value: h, check: true },
      ),
    ],
    finalAsk: `Crack it: ${eq}. What is ${L}?`,
    finalAnswers: [{ label: L, value: h }],
    data: { shape, a, c, h },
  };
}

export const keepItLevel: Framework = {
  id: "keep-it-level",
  title: "Keep It Level",
  emoji: "⚖️",
  family: FAM.crack,
  blurb: "Whatever leaves one side leaves the other — the scale stays level.",
  generate,
  invariant: (d) =>
    (d.shape === 0 ? d.h + d.a === d.c : d.h - d.a === d.c) && d.h >= 3 && d.c >= 1,
};
