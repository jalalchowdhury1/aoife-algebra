// Level 6 — meet the numbers below zero. Warm numbers right, cold numbers
// left, 0 is home. Bigger = further right (so ANY warm number beats any cold
// one), opposites are mirror hops across 0, and distance is never cold.
// Her first ever negative number — and her first go on the − key.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { fmt, numlineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const p = rng.int(1, 5); // a warm number
  const q = -rng.int(1, 5); // a cold number (compare vs p)
  const lo = -rng.int(3, 6); // two colds to compare with each other
  const hi = lo + rng.int(1, Math.abs(lo) - 1 > 0 ? Math.abs(lo) - 1 : 1); // still cold, but higher
  const dist = -rng.int(2, 6); // "how far from 0"

  const dq = decoys(
    rng,
    "Should I warm the cold numbers up first?",
    "Should I fold the line in half?",
  );

  return {
    promptText: `Meet the numbers BELOW zero! The frog's line runs both ways: warm numbers right of 0, cold numbers (with a −) left of 0.`,
    figure: numlineFigure(-6, 6, { pos: 0 }),
    steps: [
      choiceStep(
        rng,
        "side",
        "Which side of 0 do the COLD numbers live?",
        "Left of 0 — they wear a −",
        ["Right of 0 — past the warm ones", "Hiding underneath 0"],
        "Look at the line: the minus numbers sit BEFORE zero, on the left.",
        dq,
        { stars: [-3, -1], pos: 0 },
      ),
      choiceStep(
        rng,
        "bigger",
        `Which is BIGGER: ${fmt(q)} or ${fmt(p)}?`,
        fmt(p),
        [fmt(q)],
        "Bigger means further RIGHT on the line. A warm number always beats a cold one.",
        dq,
        { stars: [q, p], pos: 0 },
      ),
      choiceStep(
        rng,
        "smaller",
        `Both cold now! Which is SMALLER: ${fmt(lo)} or ${fmt(hi)}?`,
        fmt(lo),
        [fmt(hi)],
        "Smaller means further LEFT. Deeper below zero is colder AND smaller!",
        dq,
        { stars: [lo, hi], pos: 0 },
      ),
      numStep(
        "opposite",
        `What is the OPPOSITE of ${p}? (Same distance from 0 — other side. You'll need the − key!)`,
        -p,
        "Hop straight across 0: the same number of steps, but on the cold side. Tap − then the number.",
        dq,
        { stars: [p, -p], pos: 0 },
      ),
      numStep(
        "distance",
        `How many STEPS from 0 is ${fmt(dist)}? (Counting steps is never cold!)`,
        Math.abs(dist),
        "Count the hops back to 0 one at a time — steps are always a warm count.",
        dq,
        { stars: [dist, 0], pos: dist },
      ),
    ],
    finalAsk: "Two frog jobs to finish:",
    finalAnswers: [
      { label: `opposite of ${p}`, value: -p },
      { label: `steps from 0 to ${fmt(dist)}`, value: Math.abs(dist) },
    ],
    data: { p, q, lo, hi, dist },
  };
}

export const belowZero: Framework = {
  id: "below-zero",
  title: "Below Zero",
  emoji: "❄️",
  family: FAM.zero,
  blurb: "Warm numbers right, cold numbers left, 0 is home.",
  generate,
  invariant: (d) =>
    d.p >= 1 && d.q <= -1 && d.lo < d.hi && d.hi <= -1 && d.dist <= -2 && d.lo >= -6,
};
