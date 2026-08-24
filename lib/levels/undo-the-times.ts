// Level 16 — undoing a times. kx = c: k IDENTICAL boxes weigh c together, so
// share c fairly to weigh ONE box. And x ÷ k = q backwards: the box was
// shared into k equal cups, so times back up to rebuild it.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { balanceFigure, boxesFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["x", "a", "n", "y"] as const;

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: kL = c   1: L ÷ k = q
  const L = rng.pick(LETTERS);
  const k = rng.int(2, shape === 0 ? 5 : 4);
  let h = shape === 0 ? rng.int(3, 9) : k * rng.int(2, 6);
  if (shape === 0 && h === k) h += 1; // the times-table hint names k — never let it equal the answer
  const c = shape === 0 ? k * h : 0;
  const q = shape === 1 ? h / k : 0;
  const eq = shape === 0 ? `${k}${L} = ${c}` : `${L} ÷ ${k} = ${q}`;

  const dq = decoys(
    rng,
    "Should I open just one box and copy it?",
    "Should I weigh the scale itself?",
  );

  if (shape === 0) {
    return {
      promptText: `${eq}: remember, ${k}${L} is the hidden times — ${k} IDENTICAL ${L}-boxes together weigh ${c}.`,
      figure: balanceFigure(L, {
        left: Array.from({ length: k }, () => ({ label: L, box: true })),
        right: [{ label: String(c) }],
        caption: `${k} matching boxes`,
      }),
      steps: [
        choiceStep(
          rng,
          "move",
          `${k} matching boxes weigh ${c} together. How do we find ONE box?`,
          `Share ${c} into ${k} equal parts`,
          [`Take ${k} away from ${c}`, `Add ${k} more boxes`],
          "The boxes are twins — equal shares. Sharing undoes the hidden times.",
          dq,
        ),
        numStep(
          "solve",
          `${c} ÷ ${k} = ?`,
          h,
          `Think of your ${k} times table — what times ${k} lands on the total?`,
          dq,
          {
            left: [{ label: L, box: true }],
            right: [{ label: String(h) }],
            caption: "one box, found!",
            done: h,
          },
        ),
        numStep(
          "check",
          `Check: ${k} × ${h} = ?`,
          c,
          "Put all the twins back on — together they must weigh the original total.",
          dq,
          {
            left: [{ label: L, box: true }],
            right: [{ label: String(h) }],
            caption: `✓ ${k} × ${h} = ${c}`,
            done: h,
          },
        ),
      ],
      finalAsk: `Crack it: ${eq}. What is ${L}?`,
      finalAnswers: [{ label: L, value: h }],
      data: { shape, k, c, h, q },
    };
  }

  return {
    promptText: `${eq}: the ${L}-box was SHARED into ${k} equal cups, and each cup got ${q}. Rebuild the box!`,
    figure: boxesFigure(["□", "÷", String(k), "=", String(q)], L),
    steps: [
      choiceStep(
        rng,
        "move",
        `Shared into ${k} cups, ${q} each. How do we rebuild the whole box?`,
        `Times back up: ${k} × ${q}`,
        [`Share ${q} into ${k} again`, `Add ${k} onto ${q}`],
        "Sharing broke it into equal cups — timesing the cups back together rebuilds the whole thing.",
        dq,
      ),
      numStep(
        "solve",
        `${k} × ${q} = ?`,
        h,
        "All the equal cups poured back together — a times-table fact.",
        dq,
        { value: h },
      ),
      numStep(
        "check",
        `Check: ${h} ÷ ${k} = ?`,
        q,
        "Share your answer back out — every cup must get what it got before.",
        dq,
        { value: h, check: true },
      ),
    ],
    finalAsk: `Crack it: ${eq}. What is ${L}?`,
    finalAnswers: [{ label: L, value: h }],
    data: { shape, k, c, h, q },
  };
}

export const undoTheTimes: Framework = {
  id: "undo-the-times",
  title: "Undo the Times",
  emoji: "🍰",
  family: FAM.crack,
  blurb: "3 matching boxes weigh 21 — share fairly to find one box.",
  generate,
  invariant: (d) =>
    d.shape === 0 ? d.c === d.k * d.h && d.h >= 3 : d.h === d.k * d.q && d.q >= 2,
};
