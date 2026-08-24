// Level 12 — like terms. 3x + 2x: three x-boxes and two more x-boxes — count
// the BOXES, keep the sticker. And the trap the whole world falls into:
// 4x + 3 does NOT make 7x, because loose marbles never climb into boxes.
import type { Framework, Problem } from "../types";
import type { Rng } from "../rng";
import { lineFigure } from "../model";
import type { LineChip } from "../model";
import { FAM, choiceStep, decoys, numStep } from "./shared";

function generate(rng: Rng): Problem {
  const j = rng.int(2, 5);
  let k = rng.int(2, 5);
  if (j + k === j * k) k += 1; // j=k=2 would make the ${j*k}x decoy collide with the answer
  const c = rng.int(2, 9); // the loose marbles in the trap
  const p = rng.int(5, 9); // px − qx
  const q = rng.int(2, p - 2);
  const v = rng.int(2, 4); // check value

  const boxRow: LineChip[] = [
    ...Array.from({ length: j }, () => ({ t: "x", box: true })),
    { t: "+" },
    ...Array.from({ length: k }, () => ({ t: "x", box: true })),
  ];

  const dq = decoys(
    rng,
    "Should I squish the marbles into a box?",
    "Should I peel the stickers off and mix everything?",
  );

  return {
    promptText: `${j}x + ${k}x: that's ${j} x-boxes, and ${k} MORE x-boxes. Matching boxes count together!`,
    figure: lineFigure({ chips: boxRow, caption: `${j}x + ${k}x` }),
    steps: [
      numStep(
        "count",
        `Count the x-boxes: ${j} boxes and ${k} more make…?`,
        j + k,
        "Just count boxes — every single one wears the same sticker.",
        dq,
        { chips: boxRow.map((ch) => ({ ...ch, ring: ch.box })), caption: "count them all!" },
      ),
      choiceStep(
        rng,
        "combine",
        `So ${j}x + ${k}x = ?`,
        `${j + k}x`,
        [`${j + k}`, `${j * k}x`],
        "Count the BOXES, keep the sticker. The x never disappears and never multiplies itself.",
        dq,
        { chips: [], done: `${j}x + ${k}x = ${j + k}x` },
      ),
      choiceStep(
        rng,
        "trap",
        `Careful now! ${j}x + ${c}: ${j} x-boxes and ${c} LOOSE marbles. Can they squish into one thing?`,
        "No — boxes and loose marbles stay separate",
        [`Yes — it makes ${j + c}x`, "Yes — the marbles climb into the boxes"],
        `A loose marble is NOT an x-box. ${j}x + ${c} is already as short as it can get.`,
        dq,
      ),
      numStep(
        "takeaway",
        `Take-away works too: ${p}x − ${q}x. How many x-boxes are LEFT?`,
        p - q,
        "Start with the bigger pile of boxes and hand some over — count what remains.",
        dq,
      ),
      numStep(
        "check",
        `Prove it! With x = ${v}: ${j}x + ${k}x = ?`,
        (j + k) * v,
        `Feed every box its ${v}, then add the two bags up.`,
        dq,
      ),
      numStep(
        "check2",
        `And ${j + k}x with x = ${v} = ?`,
        (j + k) * v,
        "Feed the counted boxes the same number — it MUST match, that's the whole point!",
        dq,
        { chips: [], done: `${j}x + ${k}x = ${j + k}x — same answer both ways ✓` },
      ),
    ],
    finalAsk: `x = ${v}. Show both ways agree:`,
    finalAnswers: [
      { label: `${j}x + ${k}x`, value: (j + k) * v },
      { label: `${j + k}x`, value: (j + k) * v },
    ],
    data: { j, k, c, p, q, v },
  };
}

export const matchingPieces: Framework = {
  id: "matching-pieces",
  title: "Matching Pieces",
  emoji: "🧩",
  family: FAM.shop,
  blurb: "Count the boxes, keep the sticker — marbles stay out!",
  generate,
  invariant: (d) =>
    d.p - d.q >= 2 && (d.j + d.k) * d.v <= 40 && d.j >= 2 && d.k >= 2 && d.j + d.k !== d.j * d.k,
};
