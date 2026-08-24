// Level 2 — the box gets a name sticker. THE bridge of the whole app:
// a variable is not "a letter that stands for a number" — it is the same
// mystery box she already knows, wearing a name tag.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { boxesFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["n", "x", "a", "m"] as const;

function generate(rng: Rng): Problem {
  const L = rng.pick(LETTERS);
  const v = rng.int(4, 12);
  const b = rng.int(2, 9);
  const d = rng.int(2, Math.min(9, v - 1)); // v − d stays ≥ 1 (no negatives yet)

  const dq = decoys(
    rng,
    "Should I sing the alphabet to find the number?",
    "Should I rub the sticker off first?",
  );

  return {
    promptText: `This box wears a NAME sticker: ${L}. Today the box holds ${v} — so we say ${L} = ${v}.`,
    figure: boxesFigure(["□", "=", String(v)], L, { value: v }),
    steps: [
      choiceStep(
        rng,
        "what",
        `So what IS ${L}, really?`,
        "A mystery box with a name — it holds one number",
        ["Just a letter from the alphabet song", "A spell with no answer"],
        "The sticker is only a NAME. Underneath it's the same mystery box you've always known.",
        dq,
      ),
      numStep(
        "plus",
        `${L} = ${v}. So ${L} + ${b} = ?`,
        v + b,
        "Swap the letter for the number it's holding, then it's an easy add.",
        dq,
      ),
      numStep(
        "minus",
        `And ${L} − ${d} = ?`,
        v - d,
        "Same box, same number inside — swap it in, then take away.",
        dq,
      ),
    ],
    finalAsk: `${L} = ${v}. Work both out:`,
    finalAnswers: [
      { label: `${L} + ${b}`, value: v + b },
      { label: `${L} − ${d}`, value: v - d },
    ],
    data: { v, b, d },
  };
}

export const boxGetsAName: Framework = {
  id: "box-gets-a-name",
  title: "The Box Gets a Name",
  emoji: "🏷️",
  family: FAM.box,
  blurb: "x is just a mystery box wearing a name sticker.",
  generate,
  invariant: (d) => d.v - d.d >= 1 && d.v + d.b <= 21 && d.v >= 4,
};
