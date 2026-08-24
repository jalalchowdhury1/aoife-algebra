// Level 13 — the distributive property as bag-tipping. k(x + b) is k bags,
// EVERY bag holding one x-box and b marbles. Tip them all out and you must
// get kx boxes-worth and kb marbles — the k reaches BOTH things inside.
// The minus shape uses IOU notes: k(x − b) is k boxes each with an IOU for b.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { chips, lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: k(x + b)   1: k(x − b)
  const k = rng.int(2, 4);
  const b = rng.int(2, 5);
  const kb = k * b;
  const v = shape === 0 ? rng.int(2, 5) : rng.int(b + 1, b + 5); // check value keeps x − b warm
  const sign = shape === 0 ? "+" : "−";
  const expr = `${k}(x ${sign} ${b})`;
  const spread = `${k}x ${sign} ${kb}`;

  const dq = decoys(
    rng,
    "Should I throw the bags away and keep the brackets?",
    "Should the k only visit the first thing inside?",
  );

  const inside =
    shape === 0 ? `one x-box AND ${b} marbles` : `one x-box AND an IOU note for ${b}`;

  return {
    promptText:
      shape === 0
        ? `${expr} means ${k} bags — and EVERY bag holds ${inside}. Tip them all out!`
        : `${expr} means ${k} bags — every bag holds ${inside} (an IOU means ${b} get taken away later). Tip them out!`,
    figure: lineFigure({
      chips: [
        { t: String(k) },
        { t: "×" },
        { t: "(" },
        { t: "x", box: true },
        { t: sign },
        { t: String(b) },
        { t: ")" },
      ],
      caption: `every bag: ${inside}`,
    }),
    steps: [
      numStep(
        "boxes",
        `Tip out all ${k} bags. How many x-BOXES fall out?`,
        k,
        "One x-box lives in every single bag — count the bags.",
        dq,
      ),
      numStep(
        "marbles",
        shape === 0
          ? `And the marbles: ${k} bags × ${b} marbles each = ?`
          : `And the IOU notes: ${k} bags × ${b} each — how many get taken away altogether?`,
        kb,
        `Count up in ${b}s, once for each bag.`,
        dq,
        {
          chips: chips([`${k}x`, sign, String(kb)], [0, 2]),
          caption: "everything tipped out!",
        },
      ),
      choiceStep(
        rng,
        "spread",
        `So ${expr} = ?`,
        spread,
        [`${k}x ${sign} ${b}`, `${k + b}x`],
        `The ${k} multiplies BOTH things inside the bag — the box AND the ${shape === 0 ? "marbles" : "IOU"}. Forgetting the second one is the oldest mistake in algebra!`,
        dq,
        { chips: [], done: `${expr} = ${spread}` },
      ),
      numStep(
        "check1",
        `Prove it with x = ${v}: ${expr} = ${k} × (${v} ${sign} ${b}) = ?`,
        k * (shape === 0 ? v + b : v - b),
        "Work out what ONE bag is worth first, then times it by the number of bags.",
        dq,
      ),
      numStep(
        "check2",
        `And the tipped-out way: ${spread} with x = ${v} = ?`,
        k * (shape === 0 ? v + b : v - b),
        "Build the bag first, then deal with the loose part — it must land on the same answer.",
        dq,
        { chips: [], done: `${expr} = ${spread} — same both ways ✓` },
      ),
    ],
    finalAsk: `x = ${v}. Show both ways agree:`,
    finalAnswers: [
      { label: expr, value: k * (shape === 0 ? v + b : v - b) },
      { label: spread, value: k * (shape === 0 ? v + b : v - b) },
    ],
    data: { shape, k, b, kb, v },
  };
}

export const shareItOut: Framework = {
  id: "share-it-out",
  title: "Share It Out",
  emoji: "🎒",
  family: FAM.shop,
  blurb: "3(x + 4): three bags, and the 3 reaches EVERYTHING inside.",
  generate,
  invariant: (d) =>
    d.kb === d.k * d.b &&
    (d.shape === 0 ? d.v >= 2 : d.v - d.b >= 1) &&
    d.k * (d.shape === 0 ? d.v + d.b : d.v - d.b) >= 2 &&
    d.k >= 2 &&
    d.k + d.b !== d.k, // decoy sanity
};
