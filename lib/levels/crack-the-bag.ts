// Level 18 — equations with brackets: k(x + b) = c. k identical BAGS weigh c
// together, so share first to weigh one bag, then open it. Share-first is the
// clean route she can always trust with these shapes.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { balanceFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: k(x + b) = c   1: k(x − b) = c
  const k = rng.int(2, 4);
  const b = rng.int(1, 5);
  const h = shape === 0 ? rng.int(2, 7) : rng.int(b + 2, b + 7); // keeps x − b ≥ 2
  const bag = shape === 0 ? h + b : h - b;
  const c = k * bag;
  const sign = shape === 0 ? "+" : "−";
  const eq = `${k}(x ${sign} ${b}) = ${c}`;

  const bagRow = Array.from({ length: k }, () => ({ label: "🎒" }));
  const dq = decoys(
    rng,
    "Should I rip the bags open straight away?",
    "Should I weigh the smallest bag twice?",
  );

  return {
    promptText: `${eq}: ${k} IDENTICAL bags together weigh ${c} — and every bag holds one x-box ${sign === "+" ? "and" : "minus"} ${b}. Share first, then open!`,
    figure: balanceFigure("x", {
      left: bagRow,
      right: [{ label: String(c) }],
      caption: `every 🎒 holds x ${sign} ${b}`,
    }),
    steps: [
      choiceStep(
        rng,
        "route",
        `${k} matching bags weigh ${c}. What's the smart first move?`,
        `Share ${c} between the ${k} bags`,
        [`Open one bag and guess the rest`, `Take ${b} off the total first`],
        `The bags are identical twins — share the total fairly and you know what ONE whole bag weighs. (The ${sign}${b} lives INSIDE the bag — deal with the bag first!)`,
        dq,
      ),
      numStep(
        "share",
        `One bag: ${c} ÷ ${k} = ?`,
        bag,
        "Equal bags means equal shares — a times-table fact backwards.",
        dq,
        {
          left: [{ label: "🎒" }],
          right: [{ label: String(bag) }],
          caption: `one bag weighs that much: x ${sign} ${b} = ${bag}`,
        },
      ),
      numStep(
        "open",
        shape === 0
          ? `Open the bag: x + ${b} = ${bag}, so x = ${bag} − ${b} = ?`
          : `Open the bag: x − ${b} = ${bag}, so x = ${bag} + ${b} = ?`,
        h,
        shape === 0
          ? "One lock left — take the extra off both sides."
          : "One lock left — the add-back flip rebuilds the box.",
        dq,
        {
          left: [{ label: "x", box: true }],
          right: [{ label: String(h) }],
          caption: "bag open, box found!",
          done: h,
        },
      ),
      numStep(
        "check",
        `Check: ${k} × (${h} ${sign} ${b}) = ?`,
        c,
        "Rebuild one bag with your number inside, then times up all the bags.",
        dq,
        {
          left: [{ label: "x", box: true }],
          right: [{ label: String(h) }],
          caption: "✓ every bag agrees",
          done: h,
        },
      ),
    ],
    finalAsk: `Crack it: ${eq}. What is x?`,
    finalAnswers: [{ label: "x", value: h }],
    data: { shape, k, b, h, c },
  };
}

export const crackTheBag: Framework = {
  id: "crack-the-bag",
  title: "Crack the Bag",
  emoji: "👜",
  family: FAM.crack,
  blurb: "3 matching bags make 21 — share first, then open the bag.",
  generate,
  invariant: (d) =>
    d.c === d.k * (d.shape === 0 ? d.h + d.b : d.h - d.b) &&
    (d.shape === 0 || d.h - d.b >= 2) &&
    d.h >= 2 &&
    d.c <= 48,
};
