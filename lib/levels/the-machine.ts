// Level 19 — function machines, forward and back. A card goes in, the rule
// turns it into exactly ONE card out. Running it backwards is Two Locks in
// disguise — undo the +b, then undo the ×k.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { machineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const k = rng.int(2, 4);
  const b = rng.int(1, 6);
  const start = rng.int(1, 3);
  const ins = [start, start + rng.int(1, 2), start + rng.int(3, 5)];
  const outs = ins.map((i) => i * k + b);
  const rIn = rng.int(4, 7); // the reverse card
  const rOut = rIn * k + b;
  const rule = `× ${k} then + ${b}`;

  const dq = decoys(
    rng,
    "Should I shake the machine until a card falls out?",
    "Should I feed two cards in at once?",
  );

  return {
    promptText: `This machine's rule: ${rule}. Every card that goes in comes out changed — the SAME way, every time. Feed it!`,
    figure: machineFigure(rule, ins),
    steps: [
      numStep(
        "in1",
        `In goes ${ins[0]}: ${ins[0]} × ${k} + ${b} = ?`,
        outs[0],
        "Times first (build the bag), then add the extra on.",
        dq,
        { outs: [outs[0], null, null], glow: 0 },
      ),
      numStep(
        "in2",
        `In goes ${ins[1]}: ${ins[1]} × ${k} + ${b} = ?`,
        outs[1],
        "Same rule, same order — times, then add.",
        dq,
        { outs: [outs[0], outs[1], null], glow: 1 },
      ),
      numStep(
        "in3",
        `In goes ${ins[2]}: ${ins[2]} × ${k} + ${b} = ?`,
        outs[2],
        "The machine never changes its mind — times, then add.",
        dq,
        { outs, glow: 2 },
      ),
      choiceStep(
        rng,
        "reverse",
        `A card came OUT reading ${rOut}. To find what went IN, we run the machine BACKWARDS. What do we undo first?`,
        `The + ${b} — it happened last`,
        [`The × ${k} — it happened first`, "Nothing — read the card again"],
        "Socks and shoes! Going backwards, the LAST thing the machine did comes undone first.",
        dq,
        { outs },
      ),
      numStep(
        "undo",
        `So: (${rOut} − ${b}) ÷ ${k} = ?`,
        rIn,
        "Take the add-on off, then share by the times number — two locks, opened in order.",
        dq,
        { outs },
      ),
    ],
    finalAsk: `Rule: ${rule}. Run it both ways:`,
    finalAnswers: [
      { label: `in ${ins[2] + 1} → out?`, value: (ins[2] + 1) * k + b },
      { label: `out ${rOut} → in?`, value: rIn },
    ],
    data: { k, b, i1: ins[0], i2: ins[1], i3: ins[2], rIn, rOut },
  };
}

export const theMachine: Framework = {
  id: "the-machine",
  title: "The Number Machine",
  emoji: "🤖",
  family: FAM.machine,
  blurb: "One card in, one card out — the same rule every time.",
  generate,
  invariant: (d) =>
    d.rOut === d.rIn * d.k + d.b && d.i1 < d.i2 && d.i2 < d.i3 && d.k >= 2 &&
    d.i3 * d.k + d.b <= 40,
};
