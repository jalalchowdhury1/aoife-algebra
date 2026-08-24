// Level 21 — the capstone. A real story → her own code → cracked → checked
// back against the story. Every tool in the app gets used, mixed at random:
// story shapes kx + b = c, x + a = c and kx = c.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { chips, lineFigure } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";
import type { Step } from "../types";

const KIDS = ["Ben", "Mia", "Leo", "Zara"] as const;
const THINGS = [
  ["box of crayons", "boxes of crayons", "loose crayons", "crayons"],
  ["pack of stickers", "packs of stickers", "spare stickers", "stickers"],
  ["bag of shells", "bags of shells", "loose shells", "shells"],
  ["jar of buttons", "jars of buttons", "spare buttons", "buttons"],
] as const;

function generate(rng: Rng): Problem {
  const shape = rng.int(0, 2); // 0: kx + b = c   1: x + a = c   2: kx = c
  const kid = rng.pick(KIDS);
  const [one, many, loose, plain] = rng.pick(THINGS);
  const k = rng.int(2, 4);
  const h = rng.int(3, 8);
  const a = rng.int(2, 9);
  const b = rng.int(1, 5);
  const dq = decoys(
    rng,
    "Should I count the words in the story?",
    "Should I pick my favourite number from the story?",
  );

  let story: string, eq: string, wrongs: string[], solve: Step[], c: number;

  if (shape === 0) {
    c = k * h + b;
    story = `${kid} has ${k} ${many} — the SAME number in each — plus ${b} ${loose}. That's ${c} ${plain} altogether. How many in each ${one.split(" ")[0]}?`;
    eq = `${k}x + ${b} = ${c}`;
    wrongs = [`${k}x − ${b} = ${c}`, `x + ${k} + ${b} = ${c}`];
    solve = [
      numStep(
        "undo1",
        `Socks and shoes — the + ${b} came last, off it comes: ${c} − ${b} = ?`,
        k * h,
        "Undo the loose extras first, on both sides of the code.",
        dq,
        { chips: chips([`${k}x`, "=", String(k * h)]) },
      ),
      numStep(
        "undo2",
        `${k} matching boxes make ${k * h}. One box: ${k * h} ÷ ${k} = ?`,
        h,
        "Matching boxes share fairly — sharing undoes the hidden times.",
        dq,
        { chips: [], done: `x = ${h}` },
      ),
      numStep(
        "check",
        `Check the story: ${k} × ${h} + ${b} = ?`,
        c,
        "Rebuild the whole story with your answer inside — it must land on the story's total.",
        dq,
        { chips: [], done: `x = ${h} ✓ the story adds up` },
      ),
    ];
  } else if (shape === 1) {
    c = h + a;
    story = `${kid} had some ${plain} — a mystery number! Then ${kid} got ${a} more, and now has ${c}. How many did ${kid} START with?`;
    eq = `x + ${a} = ${c}`;
    wrongs = [`x − ${a} = ${c}`, `${a}x = ${c}`];
    solve = [
      numStep(
        "undo1",
        `Take the new ones back off: ${c} − ${a} = ?`,
        h,
        "The start plus the new ones made the total — remove the new ones and the start remains.",
        dq,
        { chips: [], done: `x = ${h}` },
      ),
      numStep(
        "check",
        `Check the story: ${h} + ${a} = ?`,
        c,
        "Start with your answer, add the new ones — the story's total must appear.",
        dq,
        { chips: [], done: `x = ${h} ✓ the story adds up` },
      ),
    ];
  } else {
    c = k * h;
    story = `${kid} shared ${c} ${plain} into ${k} ${many}, exactly the same in each. How many ${plain} in each ${one.split(" ")[0]}?`;
    eq = `${k}x = ${c}`;
    wrongs = [`x + ${k} = ${c}`, `x ÷ ${k} = ${c}`];
    solve = [
      numStep(
        "undo1",
        `${k} equal shares of ${c}: ${c} ÷ ${k} = ?`,
        h,
        "Equal shares — deal them out round and round, or use the times table backwards.",
        dq,
        { chips: [], done: `x = ${h}` },
      ),
      numStep(
        "check",
        `Check the story: ${k} × ${h} = ?`,
        c,
        "All the equal shares together must rebuild the story's total.",
        dq,
        { chips: [], done: `x = ${h} ✓ the story adds up` },
      ),
    ];
  }

  return {
    promptText: `📖 ${story}`,
    figure: lineFigure({ chips: chips(["📖", "→", "code", "→", "✓"]), caption: "story → code → crack → check" }),
    steps: [
      choiceStep(
        rng,
        "code",
        "Call the mystery number x. Which code matches the story?",
        eq,
        wrongs,
        "Read the story one piece at a time: what happened to the mystery number, and what did it all come to?",
        dq,
        { chips: chips(eq.split(" ")), caption: "the story, in code" },
      ),
      ...solve,
    ],
    finalAsk: `${story} (Call it x!)`,
    finalAnswers: [{ label: "x", value: h }],
    data: { shape, k, h, a, b, c },
  };
}

export const detectiveCases: Framework = {
  id: "detective-cases",
  title: "Detective Cases",
  emoji: "🕵️",
  family: FAM.machine,
  blurb: "Real stories → your own code → cracked and checked.",
  generate,
  invariant: (d) =>
    (d.shape === 0 ? d.c === d.k * d.h + d.b : d.shape === 1 ? d.c === d.h + d.a : d.c === d.k * d.h) &&
    d.h >= 3 &&
    d.c <= 41,
};
