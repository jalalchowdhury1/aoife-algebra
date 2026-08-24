// Level 9 — subtracting a cold number: the double flip. Minus says TURN
// AROUND; the cold number says walk BACKWARDS. Turned around AND walking
// backwards, the frog moves forward — warm! So a − (−b) = a + b.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { fmt, numlineFigure, par } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const a = rng.int(1, 4); // warm start
  const b = rng.int(2, 6 - a); // a − (−b) = a + b ≤ 6
  const r1 = a + b;
  const c = -rng.int(3, 6); // cold start
  const d = rng.int(2, Math.abs(c) - 1); // warms up but stays cold — subtle and honest
  const r2 = c + d;
  const dq = decoys(
    rng,
    "Should the frog close its eyes for this one?",
    "Should I turn the page upside down?",
  );

  return {
    promptText: `The DOUBLE FLIP! ${a} − ${par(-b)}: minus says turn around… and the cold number says walk backwards. Both at once?!`,
    figure: numlineFigure(-6, 6, { pos: a }),
    steps: [
      choiceStep(
        rng,
        "flip",
        `${a} − ${par(-b)}: minus a MINUS. What really happens?`,
        `The two flips cancel — it's really ${a} + ${b}`,
        [`It's the same as ${a} − ${b}`, "Everything turns cold"],
        "Turn around (minus)… then walk backwards (cold). Two flips and you're moving FORWARD — taking away cold warms you up!",
        dq,
        { pos: a },
      ),
      numStep(
        "land1",
        `So ${a} − ${par(-b)} = ${a} + ${b} = ?`,
        r1,
        "After the double flip it's a plain warm add — hop right.",
        dq,
        { pos: r1, hops: [{ from: a, to: r1 }] },
      ),
      numStep(
        "land2",
        `Again, starting cold: ${fmt(c)} − ${par(-d)} = ${fmt(c)} + ${d} = ?`,
        r2,
        "Double flip first, then hop right — it warms up even if it stays below zero.",
        dq,
        { pos: r2, hops: [{ from: c, to: r2 }] },
      ),
    ],
    finalAsk: "Double-flip these:",
    finalAnswers: [
      { label: `${a} − ${par(-b)}`, value: r1 },
      { label: `${fmt(c)} − ${par(-d)}`, value: r2 },
    ],
    data: { a, b, c, d, r1, r2 },
  };
}

export const theDoubleFlip: Framework = {
  id: "the-double-flip",
  title: "The Double Flip",
  emoji: "🔄",
  family: FAM.zero,
  blurb: "Taking away cold warms you up: 3 − (−4) = 3 + 4.",
  generate,
  invariant: (d) =>
    d.r1 === d.a + d.b && d.r2 === d.c + d.d && d.r1 > 0 && d.r1 <= 6 && d.r2 < 0,
};
