import type { FigureSpec } from "../types";
import type { BalanceSpec, Weight } from "../model";
import { fmt } from "../model";
import { BoxChip } from "./Boxes";

// The balance scale. It is ALWAYS level — the whole lesson is that we only
// ever make moves that keep it level. Weights being removed appear crossed
// out for one snapshot, then vanish in the next.

function Chip({ w }: { w: Weight }) {
  if (w.box) {
    return (
      <span className={w.crossed ? "opacity-40" : ""}>
        <BoxChip letter={w.label} small />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-xl border-4 border-purple-300 bg-purple-50 text-lg font-bold text-purple-800 ${
        w.crossed ? "line-through opacity-40 border-pink-300 text-pink-500" : ""
      }`}
    >
      {w.label}
    </span>
  );
}

function Pan({ items }: { items: Weight[] }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-h-14 min-w-28 px-2 pt-3 pb-1 flex items-end justify-center gap-1.5 flex-wrap">
        {items.map((w, i) => (
          <Chip key={i} w={w} />
        ))}
      </div>
      <div className="w-32 border-t-8 border-amber-500 rounded-full" />
    </div>
  );
}

export function Balance({ spec }: { spec: FigureSpec }) {
  const s = spec as BalanceSpec;
  const { left, right, caption, done } = s.state;
  return (
    <div className="flex justify-center mb-3">
      <div className="expr-card">
        <div className="flex items-end justify-center gap-4">
          <Pan items={left} />
          <div className="flex flex-col items-center pb-1">
            <div className="w-40 sm:w-48 border-t-8 border-purple-500 rounded-full" />
            <div
              className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-purple-400"
            />
          </div>
          <Pan items={right} />
        </div>
        {caption && (
          <div className="text-center text-sm font-bold text-purple-500 mt-2">{caption}</div>
        )}
        {done !== undefined && (
          <div className="text-center text-2xl font-bold text-green-600 mt-2 animate-bounce-in">
            {s.letter} = {fmt(done)} 🎉
          </div>
        )}
      </div>
    </div>
  );
}
