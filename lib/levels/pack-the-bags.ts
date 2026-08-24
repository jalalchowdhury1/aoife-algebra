// Level 14 — factoring: packing the bags back up. gx + C: g x-boxes and C
// loose marbles, packed into identical bags — one x-box each, marbles shared
// fairly. The reverse of Share It Out, and checked by tipping back out.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  let g = rng.int(2, 6); // bag count = x-box count
  const b = rng.int(2, 5); // marbles per bag
  if (g === b) g += 1; // g = b would make the swapped decoy collide with the answer
  const C = g * b;
  const packed = `${g}(x + ${b})`;

  const dq = decoys(
    rng,
    "Should I hide the spare marbles under the table?",
    "Should some bags get more than others?",
  );

  return {
    promptText: `Packing time! ${g}x + ${C}: that's ${g} x-boxes and ${C} loose marbles. Pack them into matching bags — every bag IDENTICAL.`,
    figure: lineFigure({
      chips: [
        { t: `${g}x` },
        { t: "+" },
        { t: String(C) },
      ],
      caption: "pack into identical bags",
    }),
    steps: [
      numStep(
        "bags",
        "Every bag gets exactly ONE x-box. How many bags can we make?",
        g,
        "One box per bag — so count the x-boxes.",
        dq,
      ),
      numStep(
        "share",
        `Now share the ${C} marbles fairly between the bags: ${C} ÷ ${g} = ? marbles each`,
        b,
        "Deal them out one at a time, round and round, until none are left.",
        dq,
      ),
      choiceStep(
        rng,
        "packed",
        `So ${g}x + ${C} packs up into…`,
        packed,
        [`${g}(x + ${C})`, `${b}(x + ${g})`],
        "Bags on the outside, what ONE bag holds on the inside: one x-box and its share of marbles.",
        dq,
        { chips: [], done: `${g}x + ${C} = ${packed}` },
      ),
      numStep(
        "tipcheck",
        `Check by tipping back out! ${packed}: the marbles come to ${g} × ${b} = ?`,
        C,
        "Tip the bags out again — you must get every marble back, none missing, none extra.",
        dq,
        { chips: [], done: `${packed} tips back out to ${g}x + ${C} ✓` },
      ),
    ],
    finalAsk: `x = 2. Show packed and unpacked agree:`,
    finalAnswers: [
      { label: packed, value: g * (2 + b) },
      { label: `${g}x + ${C}`, value: g * 2 + C },
    ],
    data: { g, b, C },
  };
}

export const packTheBags: Framework = {
  id: "pack-the-bags",
  title: "Pack the Bags",
  emoji: "🧳",
  family: FAM.shop,
  blurb: "6x + 12 packs into 6 bags of (x + 2) — fair shares only!",
  generate,
  invariant: (d) => d.C === d.g * d.b && d.g >= 2 && d.b >= 2 && d.C !== d.b && d.g !== d.b,
};
