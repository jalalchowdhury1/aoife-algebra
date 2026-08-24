// The generator contract — every level, 500 seeds. These rules are what make
// it safe to hand the app to a six-year-old with nobody sitting next to her:
// a broken or unfair problem teaches a FALSE lesson, so none may ever render.
//
//  1. the level's own invariant holds for every generated problem
//  2. every answer is an integer a young child can enter (|v| ≤ 150)
//  3. NEGATIVES ARE FENCED: levels before Below Zero (index < 5) never show
//     a negative answer anywhere — she has not met them yet
//  4. choice steps: the answer is present, options are distinct, and the
//     correct option's position varies across seeds (no "always tap the top")
//  5. Lead-stage decoys never collide with a real ask in the same problem —
//     picking a decoy must never be punished for being right
//  6. a number-step's hint never contains its own answer
//  7. generators actually vary (no constant problems)
import { describe, expect, it } from "vitest";
import { makeRng } from "../rng";
import { LEVELS } from "./index";
import type { Problem, Step } from "../types";

const SEEDS = Number(process.env.AUDIT_SEEDS ?? 500);
const NO_NEGATIVES_BEFORE = 5; // array index of below-zero — levels 1..5 stay warm

function numericAnswers(p: Problem): number[] {
  const stepNums = p.steps
    .filter((s) => s.input === "number")
    .map((s) => Number(s.answer));
  return [...stepNums, ...p.finalAnswers.map((f) => f.value)];
}

function hintLeaksAnswer(step: Step): boolean {
  if (step.input !== "number") return false;
  const ans = Math.abs(Number(step.answer));
  const clean = step.hint.replace(/−/g, "-");
  return new RegExp(`(?<!\\d)${ans}(?!\\d)`).test(clean);
}

describe("ladder shape", () => {
  it("has exactly 21 levels with unique ids", () => {
    expect(LEVELS.length).toBe(21);
    expect(new Set(LEVELS.map((l) => l.id)).size).toBe(21);
  });
});

for (const [idx, level] of LEVELS.entries()) {
  describe(`${level.id} (level ${idx + 1})`, () => {
    const problems: Problem[] = [];
    for (let seed = 1; seed <= SEEDS; seed++) {
      problems.push(level.generate(makeRng(seed)));
    }

    it("holds its invariant on every seed", () => {
      for (const p of problems) expect(level.invariant(p.data)).toBe(true);
    });

    it("produces sane, enterable answers", () => {
      for (const p of problems) {
        expect(p.steps.length).toBeGreaterThanOrEqual(2);
        expect(p.finalAnswers.length).toBeGreaterThanOrEqual(1);
        expect(p.promptText.length).toBeGreaterThan(10);
        expect(p.figure).toBeDefined();
        for (const v of numericAnswers(p)) {
          expect(Number.isInteger(v)).toBe(true);
          expect(Math.abs(v)).toBeLessThanOrEqual(150);
        }
        const labels = p.finalAnswers.map((f) => f.label);
        expect(new Set(labels).size).toBe(labels.length);
      }
    });

    if (idx < NO_NEGATIVES_BEFORE) {
      it("never shows a negative before Below Zero", () => {
        for (const p of problems) {
          for (const v of numericAnswers(p)) expect(v).toBeGreaterThanOrEqual(0);
          for (const s of p.steps) expect(s.ask).not.toMatch(/−\d|\(-/);
        }
      });
    }

    it("choice steps are honest and shuffled", () => {
      const positions = new Map<string, Set<number>>();
      const seen = new Map<string, number>();
      for (const p of problems) {
        for (const s of p.steps) {
          if (s.input !== "choice" || !s.choices) continue;
          expect(s.choices.length).toBeGreaterThanOrEqual(2);
          const labels = s.choices.map((c) => c.label);
          expect(new Set(labels).size).toBe(labels.length);
          const at = s.choices.findIndex((c) => c.value === s.answer);
          expect(at).toBeGreaterThanOrEqual(0);
          if (!positions.has(s.id)) positions.set(s.id, new Set());
          positions.get(s.id)!.add(at);
          seen.set(s.id, (seen.get(s.id) ?? 0) + 1);
        }
      }
      for (const [id, count] of seen) {
        if (count >= 30) {
          expect(positions.get(id)!.size, `choice step "${id}" never shuffles`).toBeGreaterThanOrEqual(2);
        }
      }
    });

    it("decoys never collide with real asks, hints never leak answers", () => {
      for (const p of problems) {
        const asks = new Set(p.steps.map((s) => s.ask));
        for (const s of p.steps) {
          expect(s.decoyQuestions.length).toBeGreaterThanOrEqual(2);
          expect(new Set(s.decoyQuestions).size).toBe(s.decoyQuestions.length);
          for (const d of s.decoyQuestions) expect(asks.has(d)).toBe(false);
          expect(hintLeaksAnswer(s), `hint leaks answer in step "${s.id}": "${s.hint}"`).toBe(false);
        }
      }
    });

    it("actually varies across seeds", () => {
      const distinct = new Set(problems.map((p) => JSON.stringify(p.data)));
      expect(distinct.size).toBeGreaterThanOrEqual(5);
    });
  });
}
