// Level 20 — rule detective. The machine's rule is HIDDEN; only the table
// shows. The climb between outputs gives away the ×, and the leftover at
// in = 1 gives away the +. Real function-finding, gently.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { machineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const k = rng.int(2, 4);
  let b = rng.int(1, 5);
  if (b === k) b += 1; // b = k would make the swapped-rule decoy collide with the answer
  const ins = [1, 2, 3];
  const outs = ins.map((i) => i * k + b);
  const p = rng.int(5, 9); // predict
  const rule = `× ${k} then + ${b}`;

  const dq = decoys(
    rng,
    "Should I ask the machine politely for its rule?",
    "Should I only look at the first card?",
  );

  return {
    promptText: `Rule detective! This machine is hiding its rule — but the table can't lie. In: 1, 2, 3 … Out: ${outs.join(", ")}.`,
    figure: machineFigure(null, ins, { outs }),
    steps: [
      numStep(
        "climb",
        `Each In grows by 1. How much does each Out CLIMB? (${outs[1]} − ${outs[0]})`,
        k,
        "Line the outs up and look at the jump between neighbours — the climb is the same every time.",
        dq,
        { outs },
      ),
      choiceStep(
        rng,
        "times",
        `A climb like that means the rule STARTS with…`,
        `× ${k}`,
        [`+ ${k}`, `× ${k + 1}`],
        "One more In means one more GROUP goes out — the climb size IS the times number.",
        dq,
        { outs },
      ),
      numStep(
        "extra",
        `But × ${k} alone would send 1 → ${k}. The machine sent 1 → ${outs[0]}. How much EXTRA does it add?`,
        b,
        "Compare what plain times would give with what actually came out — the gap is the add-on.",
        dq,
        { outs },
      ),
      choiceStep(
        rng,
        "rule",
        "So the hidden rule is…",
        rule,
        [`× ${b} then + ${k}`, `+ ${k + b} only`],
        "Times number from the climb, add-on from the leftover — say them in order.",
        dq,
        { outs, ruleText: rule },
      ),
      numStep(
        "predict",
        `PREDICT: in goes ${p}. ${p} × ${k} + ${b} = ?`,
        p * k + b,
        "Use the rule you uncovered — times first, then the add-on.",
        dq,
        { outs, ruleText: rule },
      ),
    ],
    finalAsk: `The table reads 1, 2, 3 → ${outs.join(", ")}. Crack the rule, then predict:`,
    finalAnswers: [{ label: `in ${p + 1} → out?`, value: (p + 1) * k + b }],
    data: { k, b, p },
  };
}

export const findTheRule: Framework = {
  id: "find-the-rule",
  title: "Find the Rule",
  emoji: "🔍",
  family: FAM.machine,
  blurb: "The machine hides its rule — the table gives it away.",
  generate,
  invariant: (d) => d.k >= 2 && d.k <= 4 && d.b >= 1 && d.b <= 5 && (d.p + 1) * d.k + d.b <= 45,
};
