import type { FigureSpec } from "../types";
import type { LineSpec } from "../model";
import { BoxChip } from "./Boxes";

// The one working line for algebra chips — ring the bit being worked, glow
// what just changed, close on the full written statement in green.

export function AlgLine({ spec }: { spec: FigureSpec }) {
  const s = spec as LineSpec;
  const { chips, caption, done } = s.state;
  return (
    <div className="flex justify-center mb-3">
      <div className="expr-card max-w-full">
        {done ? (
          <div className="text-center text-2xl font-bold text-green-600 animate-bounce-in">
            {done}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
            {chips.map((c, i) => {
              const inner = c.box ? (
                <BoxChip letter={c.t} small />
              ) : (
                <span className={`text-2xl font-bold ${c.glow ? "text-pink-600 animate-pop" : "text-purple-800"}`}>
                  {c.t}
                </span>
              );
              return c.ring ? (
                <span key={i} className="expr-ring inline-flex items-center">
                  {inner}
                </span>
              ) : (
                <span key={i} className="inline-flex items-center">
                  {inner}
                </span>
              );
            })}
          </div>
        )}
        {caption && (
          <div className="text-center text-sm font-bold text-purple-500 mt-2">{caption}</div>
        )}
      </div>
    </div>
  );
}
