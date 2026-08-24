// Level 4 — turning words into code. Includes the classic trap taught head-on:
// "7 less than n" is n − 7, NOT 7 − n. The wrong order is offered, chosen by
// half the world, and explained.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { chips, lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const a = rng.int(2, 9); // "a more than x"
  const b = rng.int(2, 9); // "b less than n"
  const v = rng.int(3, 12); // x's value for the use-it step
  const w = rng.int(b + 2, b + 10); // n's value — keeps n − b ≥ 2

  const dq = decoys(
    rng,
    "Should I write the words out in fancier letters?",
    "Should I turn the letters into numbers by counting the alphabet?",
  );

  return {
    promptText: `Secret code time! Maths code says things the short way. Crack these two: "${a} more than x" and "${b} less than n".`,
    figure: lineFigure({
      chips: chips([`"${a} more than x"`]),
      caption: "say it in code",
    }),
    steps: [
      choiceStep(
        rng,
        "start",
        `"${a} more than x" — what does the code start with?`,
        "The mystery number x",
        [`The ${a}`, "An equals sign"],
        "The words talk ABOUT the mystery box — start with the box, then follow the words.",
        dq,
      ),
      choiceStep(
        rng,
        "more",
        `So "${a} more than x" in code is…`,
        `x + ${a}`,
        [`x − ${a}`, `${a}x`],
        "MORE THAN means the pile grows — that's a +.",
        dq,
        {
          chips: chips(["x", "+", String(a)]),
          caption: `"${a} more than x" ✓`,
        },
      ),
      choiceStep(
        rng,
        "less",
        `Tricky one! "${b} less than n" in code is…`,
        `n − ${b}`,
        [`${b} − n`, `n + ${b}`],
        `Start with n, then take ${b} away from IT. The other order takes n away from the wrong thing!`,
        dq,
        {
          chips: chips(["n", "−", String(b)]),
          caption: `"${b} less than n" ✓ — n first!`,
        },
      ),
      numStep(
        "use",
        `Use your code! If x = ${v}, then x + ${a} = ?`,
        v + a,
        "Swap the letter for its number, then work the code out.",
        dq,
      ),
    ],
    finalAsk: `x = ${v} and n = ${w}. Work the two codes out:`,
    finalAnswers: [
      { label: `x + ${a}`, value: v + a },
      { label: `n − ${b}`, value: w - b },
    ],
    data: { a, b, v, w },
  };
}

export const wordsToCode: Framework = {
  id: "words-to-code",
  title: "Words into Code",
  emoji: "🔤",
  family: FAM.code,
  blurb: '"5 more than x" → x + 5. Watch out for "less than"!',
  generate,
  invariant: (d) => d.w - d.b >= 2 && d.v + d.a <= 21 && d.a >= 2 && d.b >= 2,
};
