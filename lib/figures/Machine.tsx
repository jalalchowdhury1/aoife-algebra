import type { FigureSpec } from "../types";
import type { MachineSpec } from "../model";
import { fmt } from "../model";

// The number machine: a card goes in, the rule turns it into exactly one card
// out. The rule label shows "?" until she has discovered it.

export function Machine({ spec }: { spec: FigureSpec }) {
  const s = spec as MachineSpec;
  const rule = s.state.ruleText ?? s.ruleText;
  const outs = s.state.outs ?? s.ins.map(() => null);
  return (
    <div className="flex justify-center mb-3">
      <div className="expr-card">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl">📥</span>
          <div className="rounded-2xl border-4 border-purple-400 bg-purple-50 px-4 py-2 text-center">
            <div className="text-2xl leading-none">⚙️</div>
            <div className="text-lg font-bold text-purple-800">
              {rule ?? <span className="text-pink-500 text-2xl">?</span>}
            </div>
          </div>
          <span className="text-3xl">📤</span>
        </div>
        <table className="mx-auto text-center">
          <tbody>
            <tr>
              <td className="pr-3 text-sm font-bold text-purple-500 text-right">In</td>
              {s.ins.map((n, i) => (
                <td key={i} className="px-1.5">
                  <span className="inline-flex min-w-10 h-10 px-1 items-center justify-center rounded-xl border-4 border-purple-300 bg-white text-lg font-bold text-purple-800">
                    {fmt(n)}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="pr-3 pt-2 text-sm font-bold text-pink-500 text-right">Out</td>
              {s.ins.map((_, i) => (
                <td key={i} className="px-1.5 pt-2">
                  <span
                    className={`inline-flex min-w-10 h-10 px-1 items-center justify-center rounded-xl border-4 text-lg font-bold ${
                      outs[i] === null || outs[i] === undefined
                        ? "border-gray-200 bg-gray-50 text-gray-300"
                        : `border-pink-300 bg-pink-50 text-pink-600 ${s.state.glow === i ? "animate-pop" : ""}`
                    }`}
                  >
                    {outs[i] === null || outs[i] === undefined ? "?" : fmt(outs[i]!)}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
