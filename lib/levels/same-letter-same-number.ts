// Level 3 — one name, one number. Twin boxes with the same sticker ALWAYS
// hold the same number inside one puzzle. This is the rule that makes every
// later level work; the workbook asks WHY, and so do we.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { boxesFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["a", "x", "m", "n"] as const;

function generate(rng: Rng): Problem {
  const L = rng.pick(LETTERS);
  const v = rng.int(3, 10); // doubles she knows cold
  const w = 2 * rng.int(3, 9); // an even total for the halving flip

  const dq = decoys(
    rng,
    "Should I give the second box a different sticker?",
    "Should I open only one of the boxes?",
  );

  return {
    promptText: `TWIN boxes! Two boxes wear the SAME sticker: ${L}. Today ${L} = ${v}.`,
    figure: boxesFigure(["□", "+", "□"], L),
    steps: [
      choiceStep(
        rng,
        "twins",
        `Two boxes, same sticker "${L}". What do we know for sure?`,
        "They hold the SAME number — same name, same number",
        ["The second box holds a bigger number", "They can hold whatever they like"],
        "One name means one number. Boxes with matching stickers are twins — always equal inside.",
        dq,
      ),
      numStep(
        "double",
        `${L} = ${v}, so ${L} + ${L} = ?`,
        2 * v,
        "Both twins hold the same number — so it's a double!",
        dq,
        { value: v },
      ),
      numStep(
        "half",
        `NEW puzzle: ${L} + ${L} = ${w}. What is ${L} now?`,
        w / 2,
        "Two matching boxes share the total equally — half each.",
        dq,
      ),
    ],
    finalAsk: `${L} = ${v}. What is ${L} + ${L}?`,
    finalAnswers: [{ label: `${L} + ${L}`, value: 2 * v }],
    data: { v, w },
  };
}

export const sameLetterSameNumber: Framework = {
  id: "same-letter-same-number",
  title: "Twin Boxes",
  emoji: "👯",
  family: FAM.box,
  blurb: "Same sticker, same number — always.",
  generate,
  invariant: (d) => d.w % 2 === 0 && d.w >= 6 && d.v >= 3 && d.v <= 10,
};
