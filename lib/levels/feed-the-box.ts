// Level 11 — evaluating: feed the box its number and the code comes alive.
// The order comes straight from Which First?: the squished × builds its bag
// BEFORE the + gathers. A cold second act keeps World 3 warm in her hands.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { chips, fmt, lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

const LETTERS = ["a", "x", "n"] as const;

function generate(rng: Rng): Problem {
  const L = rng.pick(LETTERS);
  const k = rng.int(2, 4);
  const v = rng.int(2, 6);
  const c = rng.int(1, 9);
  const w = -rng.int(1, 5); // the cold act: m = w
  const t = rng.int(Math.abs(w) + 1, Math.abs(w) + 6); // m + t stays warm

  const dq = decoys(
    rng,
    "Should I feed the box two numbers at once?",
    "Should I do the + before the hidden ×?",
  );

  return {
    promptText: `Feed the box! ${L} = ${v}. Drop the number in and the code ${k}${L} + ${c} comes alive.`,
    figure: lineFigure({
      chips: [{ t: String(k) }, { t: "×" }, { t: L, box: true }, { t: "+" }, { t: String(c) }],
      caption: `${L} = ${v}`,
    }),
    steps: [
      choiceStep(
        rng,
        "meaning",
        `First, remember: ${k}${L} means…`,
        `${k} × ${L}`,
        [`${k} + ${L}`, `${L} − ${k}`],
        "Squished together with no sign — that's the hidden times.",
        dq,
      ),
      choiceStep(
        rng,
        "which",
        `Box fed: ${k} × ${v} + ${c}. Which bit do we work out FIRST?`,
        `${k} × ${v}`,
        [`${v} + ${c}`],
        "× builds a bag, + can only gather bags already built — just like Which First?",
        dq,
        {
          chips: chips([String(k), "×", String(v), "+", String(c)], [0, 2]),
          caption: "the box ate its number!",
        },
      ),
      numStep(
        "build",
        `Build it: ${k} × ${v} = ?`,
        k * v,
        `Count up in ${v}s — one count each time.`,
        dq,
        {
          chips: chips([String(k * v), "+", String(c)], [0, 0]),
        },
      ),
      numStep(
        "gather",
        `Gather: ${k * v} + ${c} = ?`,
        k * v + c,
        "The bag is built — add on the loose extra.",
        dq,
        {
          chips: [],
          done: `${k}${L} + ${c} = ${k * v + c} when ${L} = ${v}`,
        },
      ),
      numStep(
        "cold",
        `One more, with a COLD box: m = ${fmt(w)}. What is m + ${t}?`,
        w + t,
        "The box hands over its cold number — then it's a frog job: start cold, hop warm.",
        dq,
      ),
    ],
    finalAsk: `${L} = ${v} and m = ${fmt(w)}. Feed the boxes:`,
    finalAnswers: [
      { label: `${k}${L} + ${c}`, value: k * v + c },
      { label: `m + ${t}`, value: w + t },
    ],
    data: { k, v, c, w, t },
  };
}

export const feedTheBox: Framework = {
  id: "feed-the-box",
  title: "Feed the Box",
  emoji: "🍽️",
  family: FAM.shop,
  blurb: "Drop the number in and the code comes alive — × builds first!",
  generate,
  invariant: (d) =>
    d.k * d.v + d.c <= 40 && d.w + d.t >= 1 && d.w + d.t <= 6 && d.k >= 2 && d.w <= -1,
};
