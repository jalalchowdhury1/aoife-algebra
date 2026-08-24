// Level 10 — times and share with cold numbers. The sign rule is DISCOVERED,
// not decreed: 3 × (−2) is three cold hops (obviously cold), and then the
// pattern staircase climbs right past zero to show why cold × cold is WARM.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { fmt, numlineFigure, par } from "../model";
import type { Hop } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const k = rng.int(2, 3); // hops
  const m = rng.int(2, 4); // hop size — k × m ≤ 12
  const km = k * m;
  const hops: Hop[] = Array.from({ length: k }, (_, i) => ({
    from: -i * m,
    to: -(i + 1) * m,
    cold: true,
  }));

  const dq = decoys(
    rng,
    "Should I count the minus signs and add them up?",
    "Should I do the warm version and keep that answer?",
  );

  return {
    promptText: `Times with cold numbers! ${k} × ${par(-m)} means ${k} cold hops of ${m}. Then a pattern shows us the strangest rule in maths…`,
    figure: numlineFigure(-12, 3, { pos: 0 }),
    steps: [
      numStep(
        "warm",
        `Warm-up (all warm): ${k} × ${m} = ?`,
        km,
        `Count up in ${m}s, ${k} times — a plain times-table fact.`,
        dq,
        { pos: 0 },
      ),
      numStep(
        "cold",
        `Now ${k} × ${par(-m)}: ${k} cold hops of ${m}, starting at 0. Where do you land?`,
        -km,
        "Each hop is cold — leftward. Same size as the warm answer, other side of zero.",
        dq,
        { pos: -km, hops },
      ),
      choiceStep(
        rng,
        "stairs",
        `Pattern staircase! 2 × ${par(-m)} = ${fmt(-2 * m)}, then 1 × ${par(-m)} = ${fmt(-m)}, then 0 × ${par(-m)} = 0 … each answer climbs UP by ${m}. Keep climbing: ${par(-1)} × ${par(-m)} = ?`,
        fmt(m),
        [fmt(-m), "0"],
        "Don't stop at zero — the staircase keeps climbing by the same amount, up into the warm numbers!",
        dq,
        { pos: 0, stars: [-2 * m, -m, 0] },
      ),
      choiceStep(
        rng,
        "rule",
        "So the sign rule: MATCHING signs (warm×warm or cold×cold) make…",
        "Warm (+)",
        ["Cold (−)", "Zero"],
        "The staircase showed it: cold × cold lands warm. Only a MIX of signs makes cold.",
        dq,
      ),
      numStep(
        "both",
        `Try it: ${par(-k)} × ${par(-m)} = ?`,
        km,
        "Matching signs — so the answer is warm. The number part is a plain times fact.",
        dq,
      ),
      numStep(
        "share",
        `Share works the same way: ${fmt(-km)} ÷ ${k} = ?`,
        -m,
        "Mixed signs — one cold, one warm — so the answer is cold. Share the number part fairly.",
        dq,
      ),
    ],
    finalAsk: "Sign-rule finale:",
    finalAnswers: [
      { label: `${k} × ${par(-m)}`, value: -km },
      { label: `${par(-k)} × ${par(-m)}`, value: km },
    ],
    data: { k, m, km },
  };
}

export const coldTimes: Framework = {
  id: "cold-times",
  title: "Cold Times",
  emoji: "🌡️",
  family: FAM.zero,
  blurb: "Matching signs make warm, mixed signs make cold — and WHY.",
  generate,
  invariant: (d) => d.km === d.k * d.m && d.km <= 12 && d.k >= 2 && d.m >= 2,
};
