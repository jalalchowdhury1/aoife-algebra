// Level 8 — adding a COLD number. 4 + (−6): the + says "another hop", the
// (−6) says the hop itself is cold — so it drags you left. The hugging
// brackets are introduced here: just a hug so two signs don't bump.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { fmt, numlineFigure, par } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const a = rng.int(2, 6); // warm start
  const b = a + rng.int(1, 5); // cold add, lands below zero
  const r1 = a - b;
  const c = -rng.int(1, 3); // cold start
  const d = rng.int(1, 6 - Math.abs(c)) + 0; // more cold, stays ≥ −6
  const r2 = c - d;
  if (r1 < -6 || r2 < -6) return generate(rng);

  const dq = decoys(
    rng,
    "Should I take the brackets off and shake them?",
    "Should I warm the number up before adding it?",
  );

  return {
    promptText: `Adding COLD numbers! ${a} + ${par(-b)} — the brackets are just a hug so the two signs don't bump heads.`,
    figure: numlineFigure(-6, 6, { pos: a }),
    steps: [
      choiceStep(
        rng,
        "kind1",
        `${a} + ${par(-b)}: what kind of hop is ADDING a cold number?`,
        `A cold hop — ${b} steps LEFT`,
        [`A warm hop — ${b} steps right`, "No hop — the brackets lock it"],
        "Adding warm hops right; adding COLD drags you left. The hop is as cold as the number you add.",
        dq,
        { pos: a },
      ),
      numStep(
        "land1",
        `Hop it: ${a} + ${par(-b)} = ?`,
        r1,
        "Start at the warm number and count cold hops leftward — past 0 if you must.",
        dq,
        { pos: r1, hops: [{ from: a, to: r1, cold: true }] },
      ),
      choiceStep(
        rng,
        "kind2",
        `${fmt(c)} + ${par(-d)}: already below zero, and adding MORE cold. Which way?`,
        "Left again — colder and colder",
        ["Right — two minuses cancel out", "Back up to 0 first"],
        "ADDING cold always drags left, wherever you stand. (TAKING AWAY cold is a different story — next level!)",
        dq,
        { pos: c },
      ),
      numStep(
        "land2",
        `${fmt(c)} + ${par(-d)} = ?`,
        r2,
        "Start below zero and keep counting leftward — deeper into the cold.",
        dq,
        { pos: r2, hops: [{ from: c, to: r2, cold: true }] },
      ),
    ],
    finalAsk: "Work the cold adds out:",
    finalAnswers: [
      { label: `${a} + ${par(-b)}`, value: r1 },
      { label: `${fmt(c)} + ${par(-d)}`, value: r2 },
    ],
    data: { a, b, c, d, r1, r2 },
  };
}

export const addingCold: Framework = {
  id: "adding-cold",
  title: "Adding Cold",
  emoji: "🧊",
  family: FAM.zero,
  blurb: "Adding a cold number drags you left — brackets are just a hug.",
  generate,
  invariant: (d) =>
    d.r1 === d.a - d.b && d.r2 === d.c - d.d && d.r1 < 0 && d.r2 < d.c && d.r2 >= -6,
};
