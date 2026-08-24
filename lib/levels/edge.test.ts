// Edge-case gate — verification channels the other two suites don't use.
//
//  A. GUARDED RNG: every rng.int(min,max) call across every generator branch
//     must have min ≤ max (an inverted range silently misbehaves in makeRng),
//     and pick() must never see an empty array. This fuzzes branches that only
//     rare seeds reach.
//  B. Engine contracts the UI silently depends on:
//     - step ids unique per problem (React keys + recorded-answer rows)
//     - final answers enterable on the numpad (≤5 chars incl. any minus, ≤3 slots)
//     - a choice step's hint never contains its correct option verbatim
//     - Watch stage can display every answer (choice answers resolve to a label)
//  C. The no-negatives fence widened to prompt/finalAsk/labels for levels 1–5.
import { describe, expect, it } from "vitest";
import { makeRng, type Rng } from "../rng";
import { LEVELS } from "./index";
import type { Problem } from "../types";

const SEEDS = Number(process.env.AUDIT_SEEDS ?? 500);
const NO_NEGATIVES_BEFORE = 5;

function guardedRng(seed: number): Rng {
  const base = makeRng(seed);
  return {
    next: base.next,
    int: (min: number, max: number) => {
      if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
        throw new Error(`rng.int(${min}, ${max}) — invalid range`);
      }
      return base.int(min, max);
    },
    pick: <T,>(arr: readonly T[]): T => {
      if (arr.length === 0) throw new Error("rng.pick([]) — empty array");
      return base.pick(arr);
    },
    shuffle: base.shuffle,
  };
}

for (const [idx, level] of LEVELS.entries()) {
  describe(`${level.id} (level ${idx + 1}) — edge gate`, () => {
    const problems: Problem[] = [];

    it("survives the guarded rng on every seed (no invalid ranges on any branch)", () => {
      for (let seed = 1; seed <= SEEDS; seed++) {
        problems.push(level.generate(guardedRng(seed)));
      }
      expect(problems.length).toBe(SEEDS);
    });

    it("step ids are unique within every problem", () => {
      for (const p of problems) {
        const ids = p.steps.map((s) => s.id);
        expect(new Set(ids).size, ids.join(",")).toBe(ids.length);
      }
    });

    it("finals are enterable on the numpad (≤5 chars with minus, ≤3 slots)", () => {
      for (const p of problems) {
        expect(p.finalAnswers.length).toBeLessThanOrEqual(3);
        for (const f of p.finalAnswers) {
          const chars = String(Math.abs(f.value)).length + (f.value < 0 ? 1 : 0);
          expect(chars, `final ${f.value}`).toBeLessThanOrEqual(5);
        }
      }
    });

    it("choice hints never hand over the correct option", () => {
      for (const p of problems) {
        for (const s of p.steps) {
          if (s.input !== "choice") continue;
          expect(
            s.hint.includes(String(s.answer)),
            `step ${s.id}: hint contains the answer label`,
          ).toBe(false);
        }
      }
    });

    it("Watch can display every answer", () => {
      for (const p of problems) {
        for (const s of p.steps) {
          if (s.input === "choice") {
            const c = s.choices!.find((c) => c.value === s.answer);
            expect(c, `step ${s.id} has no displayable answer`).toBeDefined();
            expect(c!.label.length).toBeGreaterThan(0);
          }
        }
      }
    });

    if (idx < NO_NEGATIVES_BEFORE) {
      it("prompt, finalAsk and labels are negative-free before Below Zero", () => {
        for (const p of problems) {
          const texts = [p.promptText, p.finalAsk, ...p.finalAnswers.map((f) => f.label)];
          for (const t of texts) expect(t).not.toMatch(/−\d|\(-|-\d/);
        }
      });
    }
  });
}
