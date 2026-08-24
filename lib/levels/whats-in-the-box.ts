// Level 1 — the mystery box, NO letters yet.
//
// She has solved ◻ puzzles in Borrow & Carry for weeks. This level is pure
// confidence: find what's hiding, put it back, watch the check come true.
// Two shapes: ◻ + a = c (take a off) and ◻ − a = c (add it back — her
// detective flip from the columns app).
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { boxesFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 1); // 0: □ + a = c   1: □ − a = c
  const a = rng.int(2, 9);
  const h = rng.int(3, 12); // what's hiding
  const c = shape === 0 ? h + a : h - a;
  // shape 1 must stay above zero — negatives don't exist until World 3
  if (shape === 1 && c < 1) return generate(rng);

  const sign = shape === 0 ? "+" : "−";
  const eq = `□ ${sign} ${a} = ${c}`;
  const dq = decoys(
    rng,
    "Should I peek under the box?",
    "Should I move the box to the other side of the room?",
  );

  return {
    promptText:
      shape === 0
        ? `Shhh — this box is HIDING a number! The line is true: the box and ${a} together make ${c}.`
        : `Shhh — this box is HIDING a number! It lost ${a}, and landed on ${c}.`,
    figure: boxesFigure(["□", sign, String(a), "=", String(c)]),
    steps: [
      choiceStep(
        rng,
        "how",
        shape === 0
          ? `The box plus ${a} makes ${c}. How do we find what's hiding?`
          : `The box LOST ${a} and landed on ${c}. How do we rebuild it?`,
        shape === 0 ? `Take the ${a} away from ${c}` : `Add the ${a} back onto ${c}`,
        shape === 0
          ? [`Add ${a} more onto ${c}`, "Guess a number and hope"]
          : [`Take ${a} away from ${c}`, "Guess a number and hope"],
        shape === 0
          ? "The box and the extra make the total TOGETHER. Take the extra off and only the box is left."
          : "It went DOWN when it lost some — so put them back ON to climb back up. Detective flip!",
        dq,
      ),
      numStep(
        "find",
        shape === 0 ? `So: ${c} − ${a} = what's in the box?` : `So: ${c} + ${a} = what's in the box?`,
        h,
        shape === 0
          ? "Start at the big total and count backwards."
          : "Start at where it landed and count back up.",
        dq,
        { value: h },
      ),
      numStep(
        "check",
        `Check it! Put it back in the box: ${h} ${sign} ${a} = ?`,
        c,
        "Work the line out with your number inside — a true line means you cracked it.",
        dq,
        { value: h, check: true },
      ),
    ],
    finalAsk: `${eq} — what is hiding in the box?`,
    finalAnswers: [{ label: "in the box", value: h }],
    data: { shape, a, c, h },
  };
}

export const whatsInTheBox: Framework = {
  id: "whats-in-the-box",
  title: "What's in the Box?",
  emoji: "📦",
  family: FAM.box,
  blurb: "A box is hiding a number. Find it, put it back, prove it!",
  generate,
  invariant: (d) =>
    (d.shape === 0 ? d.h + d.a === d.c : d.h - d.a === d.c) && d.h >= 3 && d.c >= 1 && d.a >= 2,
};
