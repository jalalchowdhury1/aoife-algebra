// Deep property audit — a second, stricter gate over every level × 500 seeds.
// levels.test.ts checks the teaching contract; THIS file checks display and
// figure integrity: nothing a six-year-old sees may ever contain a template
// accident, an ASCII hyphen-minus, or a frog placed off the drawn line.
import { describe, expect, it } from "vitest";
import { makeRng } from "../rng";
import { LEVELS } from "./index";
import type { Problem } from "../types";
import type { NumLineSpec, NumLineState, BalanceState, LineState } from "../model";

const SEEDS = Number(process.env.AUDIT_SEEDS ?? 500);

/** Every string she can ever see, in one list. */
function displayStrings(p: Problem): string[] {
  const out: string[] = [p.promptText, p.finalAsk];
  for (const f of p.finalAnswers) out.push(f.label);
  for (const s of p.steps) {
    out.push(s.ask, s.hint, ...s.decoyQuestions);
    if (s.choices) for (const c of s.choices) out.push(c.label);
    if (s.figState) {
      const st = s.figState as Record<string, unknown>;
      if (typeof st.caption === "string") out.push(st.caption);
      if (typeof st.done === "string") out.push(st.done);
      if (Array.isArray(st.chips))
        for (const ch of st.chips as { t: string }[]) out.push(ch.t);
      if (Array.isArray(st.left))
        for (const w of st.left as { label: string }[]) out.push(w.label);
      if (Array.isArray(st.right))
        for (const w of st.right as { label: string }[]) out.push(w.label);
      if (typeof st.ruleText === "string") out.push(st.ruleText);
    }
  }
  const fig = p.figure as Record<string, unknown> | undefined;
  if (fig) {
    if (Array.isArray(fig.parts)) out.push(...(fig.parts as string[]));
    if (typeof fig.ruleText === "string") out.push(fig.ruleText);
    const st = fig.state as Record<string, unknown> | undefined;
    if (st) {
      if (typeof st.caption === "string") out.push(st.caption);
      if (Array.isArray(st.chips)) for (const ch of st.chips as { t: string }[]) out.push(ch.t);
    }
  }
  return out;
}

function numlineStates(p: Problem): { spec: NumLineSpec; states: NumLineState[] }[] {
  if (p.figure?.kind !== "numline") return [];
  const spec = p.figure as NumLineSpec;
  const states: NumLineState[] = [spec.state];
  for (const s of p.steps) if (s.figState) states.push(s.figState as NumLineState);
  return [{ spec, states }];
}

for (const [idx, level] of LEVELS.entries()) {
  describe(`${level.id} (level ${idx + 1}) — deep audit`, () => {
    const problems: Problem[] = [];
    for (let seed = 1; seed <= SEEDS; seed++) problems.push(level.generate(makeRng(seed)));

    it("display strings contain no template accidents or ASCII minus", () => {
      for (const p of problems) {
        for (const s of displayStrings(p)) {
          expect(s, `bad string: "${s}"`).not.toMatch(/undefined|NaN|null|\[object/);
          // hyphen-before-digit must be the proper minus −; figures render raw
          expect(s, `ASCII minus leaked: "${s}"`).not.toMatch(/-\d/);
          expect(s).not.toMatch(/  /); // double spaces read as typos
        }
      }
    });

    it("step answers match their input kind", () => {
      for (const p of problems) {
        for (const s of p.steps) {
          if (s.input === "number") {
            expect(typeof s.answer, `step ${s.id}`).toBe("number");
            expect(Number.isInteger(s.answer as number)).toBe(true);
          } else {
            expect(typeof s.answer, `step ${s.id}`).toBe("string");
            expect(s.choices!.some((c) => c.value === s.answer)).toBe(true);
          }
        }
      }
    });

    it("the frog, hops and stars always stay on the drawn line", () => {
      for (const p of problems) {
        for (const { spec, states } of numlineStates(p)) {
          const inRange = (n: number) => n >= spec.min && n <= spec.max;
          for (const st of states) {
            if (st.pos !== undefined) expect(inRange(st.pos), `pos ${st.pos}`).toBe(true);
            for (const h of st.hops ?? []) {
              expect(inRange(h.from), `hop from ${h.from}`).toBe(true);
              expect(inRange(h.to), `hop to ${h.to}`).toBe(true);
            }
            for (const s2 of st.stars ?? []) expect(inRange(s2), `star ${s2}`).toBe(true);
          }
        }
      }
    });

    it("balance pans and line chips are never empty mid-problem", () => {
      for (const p of problems) {
        for (const s of p.steps) {
          const st = s.figState as (BalanceState & LineState) | undefined;
          if (!st) continue;
          if (Array.isArray(st.left)) {
            expect(st.left.length).toBeGreaterThan(0);
            expect(st.right.length).toBeGreaterThan(0);
          }
          if (Array.isArray(st.chips) && !st.done) {
            expect(st.chips.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });
}
