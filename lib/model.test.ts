import { describe, expect, it } from "vitest";
import { figureAt, fmt, par, chips } from "./model";
import type { Problem } from "./types";

describe("fmt / par", () => {
  it("renders proper minus signs", () => {
    expect(fmt(-3)).toBe("−3");
    expect(fmt(5)).toBe("5");
    expect(fmt(0)).toBe("0");
  });
  it("hugs negatives in brackets", () => {
    expect(par(-6)).toBe("(−6)");
    expect(par(4)).toBe("4");
  });
});

describe("chips", () => {
  it("rings an inclusive range", () => {
    const c = chips(["a", "+", "b"], [0, 1]);
    expect(c.map((x) => !!x.ring)).toEqual([true, true, false]);
  });
});

describe("figureAt", () => {
  const base: Problem = {
    promptText: "t",
    figure: { kind: "line", state: { chips: [{ t: "start" }] } },
    steps: [
      { id: "a", ask: "?", answer: 1, input: "number", hint: "", decoyQuestions: [] },
      {
        id: "b",
        ask: "?",
        answer: 2,
        input: "number",
        hint: "",
        decoyQuestions: [],
        figState: { chips: [{ t: "mid" }] },
      },
      { id: "c", ask: "?", answer: 3, input: "number", hint: "", decoyQuestions: [] },
    ],
    finalAsk: "?",
    finalAnswers: [{ label: "x", value: 1 }],
    data: {},
  };

  it("shows the base figure before any snapshot", () => {
    expect(figureAt(base, 0)).toEqual(base.figure);
    expect(figureAt(base, 1)).toEqual(base.figure); // step a has no figState
  });
  it("carries the latest snapshot forward (cumulative)", () => {
    const at2 = figureAt(base, 2)!;
    expect(at2.state).toEqual({ chips: [{ t: "mid" }] });
    const at3 = figureAt(base, 3)!;
    expect(at3.state).toEqual({ chips: [{ t: "mid" }] }); // step c inherits b's
  });
});
