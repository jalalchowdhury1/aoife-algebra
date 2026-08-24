// lib/model.ts — the display model: figure specs, cumulative figure states, and
// the tiny formatting helpers every level shares. NO level logic lives here.
//
// Figure semantics (inherited from the siblings, DO NOT CHANGE):
//   - `Problem.figure` is the picture as it stands BEFORE any step is answered.
//   - A step's `figState` is a CUMULATIVE snapshot — the whole picture after
//     that step, never a delta.
//   - `figureAt(problem, done)` returns the latest defined snapshot; Solo and
//     Practice always show the bare initial figure (test conditions).
//   - A figure must NEVER show a number she hasn't answered yet — snapshots
//     only appear after their step is done, and the self-test leans on levels'
//     invariants to keep the arithmetic honest.
import type { FigureSpec, Problem } from "./types";

/* --------------------------------- format --------------------------------- */

/** Proper minus sign for display: -3 → "−3". */
export const fmt = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : String(n));

/** Negative numbers after an operator wear hugging brackets: 4 + (−6). */
export const par = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : String(n));

/* ------------------------------ 📦 boxes figure ---------------------------- */
// A pictorial equation: [box] + 4 = 11. The box is drawn as a parcel with an
// optional name sticker; `value` (from a figState) opens it.

export interface BoxesState {
  value?: number; // box opened, showing what was hiding inside
  check?: boolean; // green "both sides match!" tick shown under the equation
}

export interface BoxesSpec extends FigureSpec {
  kind: "boxes";
  letter?: string; // name sticker on the box; undefined = a plain mystery box
  parts: string[]; // display chips; the literal "□" chip renders as the box
  state: BoxesState;
}

export function boxesFigure(parts: string[], letter?: string, state: BoxesState = {}): BoxesSpec {
  return { kind: "boxes", letter, parts, state };
}

/* ----------------------------- ❄️ number line ------------------------------ */

export interface Hop {
  from: number;
  to: number;
  cold?: boolean; // cold hops draw blue (leftward feel), warm hops pink
}

export interface NumLineState {
  pos?: number; // where the frog sits
  hops?: Hop[]; // arcs drawn so far
  stars?: number[]; // highlighted numbers (compares, opposites)
}

export interface NumLineSpec extends FigureSpec {
  kind: "numline";
  min: number;
  max: number;
  state: NumLineState;
}

export function numlineFigure(min: number, max: number, state: NumLineState = {}): NumLineSpec {
  return { kind: "numline", min, max, state };
}

/* ------------------------------ ⚖️ balance --------------------------------- */
// Both pans as chip lists. Snapshots are cumulative: a step that removes
// weights shows them crossed out; the next snapshot shows them gone.

export interface Weight {
  label: string; // "x", "6", "🎁"
  box?: boolean; // render as a mystery box chip
  crossed?: boolean; // struck through (being taken off both sides)
}

export interface BalanceState {
  left: Weight[];
  right: Weight[];
  caption?: string; // short line under the scale ("take 6 off BOTH sides")
  done?: number; // solved: show letter = done in green
}

export interface BalanceSpec extends FigureSpec {
  kind: "balance";
  letter: string;
  state: BalanceState;
}

export function balanceFigure(letter: string, state: BalanceState): BalanceSpec {
  return { kind: "balance", letter, state };
}

/* ------------------------------ 🤖 machine --------------------------------- */

export interface MachineState {
  outs?: (number | null)[]; // filled outputs (null = still empty)
  ruleText?: string; // discovered rule replaces the "?" label
  glow?: number; // column index that just got filled
}

export interface MachineSpec extends FigureSpec {
  kind: "machine";
  ruleText: string | null; // null = hidden rule ("?")
  ins: number[];
  state: MachineState;
}

export function machineFigure(
  ruleText: string | null,
  ins: number[],
  state: MachineState = {},
): MachineSpec {
  return { kind: "machine", ruleText, ins, state };
}

/* ----------------------------- ✏️ working line ----------------------------- */
// A generic one-line working figure: algebra chips with an amber ring on the
// chunk being worked, a glow on what just changed, and a caption.

export interface LineChip {
  t: string;
  ring?: boolean;
  glow?: boolean;
  box?: boolean; // render chip as a mystery box (letter inside)
}

export interface LineState {
  chips: LineChip[];
  caption?: string;
  done?: string; // closing statement, shown green ("3x + 2x = 5x")
}

export interface LineSpec extends FigureSpec {
  kind: "line";
  state: LineState;
}

export function lineFigure(state: LineState): LineSpec {
  return { kind: "line", state };
}

/** Convenience: chips from plain strings; mark `ring` on an inclusive range. */
export function chips(parts: string[], ring?: [number, number]): LineChip[] {
  return parts.map((t, i) => ({
    t,
    ring: ring ? i >= ring[0] && i <= ring[1] : undefined,
  }));
}

/* -------------------------------- figureAt --------------------------------- */

export type FigState = BoxesState | NumLineState | BalanceState | MachineState | LineState;

/** Figure to show after `done` completed steps: the latest defined figState. */
export function figureAt(problem: Problem, done: number): FigureSpec | undefined {
  const fig = problem.figure;
  if (!fig) return fig;
  let state: FigState | undefined;
  for (let i = 0; i < done && i < problem.steps.length; i++) {
    state = problem.steps[i].figState ?? state;
  }
  return state ? { ...fig, state } : fig;
}
