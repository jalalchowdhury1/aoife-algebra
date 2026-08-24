// Level 5 — the squished-up ×. 2y is secret code for 2 × y: two y-boxes.
// The most important notation lesson in the app; everything after uses it.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { chips, lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["y", "a", "m", "x"] as const;

function generate(rng: Rng): Problem {
  const L = rng.pick(LETTERS);
  const k = rng.int(2, 5); // the squished coefficient
  let c = rng.int(1, 9); // the loose extra
  if (c === k) c += 1; // c = k would make the swapped decoy collide with the answer
  const v = rng.int(2, 6); // the box's number — k × v stays inside her tables

  const dq = decoys(
    rng,
    "Should I un-squish the code by adding a space?",
    "Should I say the letter louder?",
  );

  return {
    promptText: `Some code hides its ×! ${k}${L} is squished-up code. And "${k} groups of ${L}, then ${c} more" has a whole phrase to crack.`,
    figure: lineFigure({
      chips: chips([`${k}${L}`, "+", String(c)]),
      caption: `${L} = ${v}`,
    }),
    steps: [
      choiceStep(
        rng,
        "squish",
        `${k}${L} is squished-up code. What does it really mean?`,
        `${k} × ${L} — ${k} ${L}-boxes`,
        [`${k} + ${L}`, `${L} − ${k}`],
        "A number squished right up against a letter is a hidden ×. No space, no sign — that's times!",
        dq,
      ),
      choiceStep(
        rng,
        "groups",
        `"${k} groups of ${L}, then ${c} more" in code is…`,
        `${k}${L} + ${c}`,
        [`${k} + ${L} + ${c}`, `${c}${L} + ${k}`],
        "GROUPS OF builds bags — that's the hidden ×. The extra comes after, gathered on with a +.",
        dq,
      ),
      numStep(
        "build",
        `${L} = ${v}. Build the bag first: ${k}${L} means ${k} × ${v} = ?`,
        k * v,
        `Count up in ${v}s — one count for each group.`,
        dq,
        {
          chips: chips([String(k * v), "+", String(c)], [0, 0]),
          caption: `${k}${L} became ${k} × ${v}`,
        },
      ),
      numStep(
        "gather",
        `Now gather: ${k * v} + ${c} = ?`,
        k * v + c,
        "The bag is built — tip it into the pile with the loose extra.",
        dq,
        {
          chips: [],
          done: `${k}${L} + ${c} = ${k * v + c} when ${L} = ${v}`,
        },
      ),
    ],
    finalAsk: `${L} = ${v}. What is ${k}${L} + ${c}?`,
    finalAnswers: [{ label: `${k}${L} + ${c}`, value: k * v + c }],
    data: { k, c, v },
  };
}

export const theHiddenTimes: Framework = {
  id: "the-hidden-times",
  title: "The Hidden Times",
  emoji: "🫥",
  family: FAM.code,
  blurb: "2y is squished-up code for 2 × y — two y-boxes!",
  generate,
  invariant: (d) => d.k * d.v <= 30 && d.k >= 2 && d.v >= 2 && d.k * d.v !== d.k && d.k * d.v !== d.v,
};
