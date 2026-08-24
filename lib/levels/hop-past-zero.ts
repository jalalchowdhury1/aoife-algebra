// Level 7 — crossing zero, both ways. The revelation: you CAN take away more
// than you have — the frog just keeps hopping past 0 into the cold numbers.
// Trip 1: warm start, big cold hop (2 − 5). Trip 2: cold start, warm hop back.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { fmt, numlineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const a = rng.int(1, 4); // trip 1: a − b, lands cold
  const b = a + rng.int(2, 6); // lands between −2 and −6
  const r1 = a - b;
  const c = -rng.int(2, 6); // trip 2: c + d, lands warm
  const d = Math.abs(c) + rng.int(1, 5);
  const r2 = c + d;
  if (r1 < -6 || r2 > 6) return generate(rng);

  const dq = decoys(
    rng,
    "Should the frog stop at 0 and rest?",
    "Should I swap the two numbers around?",
  );

  return {
    promptText: `Two frog trips! Trip 1: start at ${a}, take away ${b} — MORE than it has! Trip 2: start down at ${fmt(c)} and hop ${d} back up.`,
    figure: numlineFigure(-6, 6, { pos: a }),
    steps: [
      choiceStep(
        rng,
        "dir1",
        `Trip 1: ${a} − ${b}. Which way does the frog hop?`,
        `Left — taking away is ${b} cold hops`,
        ["Right — numbers always grow", "Nowhere — you can't take that many"],
        "Minus hops go LEFT. And zero isn't a wall — the frog can hop right past it!",
        dq,
        { pos: a },
      ),
      numStep(
        "land1",
        `Hop it! Start at ${a}, hop ${b} left. ${a} − ${b} = ?`,
        r1,
        "Count the hops one at a time — when you reach 0, KEEP GOING into the cold numbers.",
        dq,
        { pos: r1, hops: [{ from: a, to: r1, cold: true }] },
      ),
      choiceStep(
        rng,
        "dir2",
        `Trip 2: ${fmt(c)} + ${d}. Which way now?`,
        `Right — adding is ${d} warm hops`,
        ["Left — it starts on the cold side", "Straight to 0, then stop"],
        "Plus hops go RIGHT, wherever you start. Cold start, warm hops — up it climbs!",
        dq,
        { pos: c },
      ),
      numStep(
        "land2",
        `Start at ${fmt(c)}, hop ${d} right. ${fmt(c)} + ${d} = ?`,
        r2,
        "Count up one hop at a time — past 0 and out into the warm numbers.",
        dq,
        { pos: r2, hops: [{ from: c, to: r2 }] },
      ),
    ],
    finalAsk: "Where does the frog land?",
    finalAnswers: [
      { label: `${a} − ${b}`, value: r1 },
      { label: `${fmt(c)} + ${d}`, value: r2 },
    ],
    data: { a, b, c, d, r1, r2 },
  };
}

export const hopPastZero: Framework = {
  id: "hop-past-zero",
  title: "Hop Past Zero",
  emoji: "🐸",
  family: FAM.zero,
  blurb: "Zero isn't a wall — the frog hops right past it!",
  generate,
  invariant: (d) =>
    d.r1 === d.a - d.b && d.r2 === d.c + d.d && d.r1 < 0 && d.r2 > 0 && d.r1 >= -6 && d.r2 <= 6,
};
