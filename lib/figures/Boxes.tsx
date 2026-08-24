import type { FigureSpec } from "../types";
import type { BoxesSpec } from "../model";
import { fmt } from "../model";

// The mystery box: a parcel with a name sticker. The heart of the whole app —
// a variable is THIS box, nothing more mysterious. The box only ever opens
// (shows its number) on a figState, i.e. AFTER she has worked the number out.

export function BoxChip({
  letter,
  value,
  small,
}: {
  letter?: string;
  value?: number;
  small?: boolean;
}) {
  const size = small ? "w-10 h-10 text-lg" : "w-16 h-16 text-3xl";
  return (
    <span
      className={`${size} relative inline-flex items-center justify-center rounded-xl border-4 border-amber-500 bg-amber-100 font-bold text-amber-800 align-middle`}
    >
      {value !== undefined ? (
        <span className="animate-pop text-green-700">{fmt(value)}</span>
      ) : (
        <span className="text-amber-400">?</span>
      )}
      {letter && (
        <span
          className={`absolute ${small ? "-top-2" : "-top-3"} left-1/2 -translate-x-1/2 bg-white border-2 border-purple-300 rounded-md px-1 text-purple-700 font-bold ${small ? "text-[9px]" : "text-xs"} leading-tight`}
        >
          {letter}
        </span>
      )}
    </span>
  );
}

export function Boxes({ spec }: { spec: FigureSpec }) {
  const s = spec as BoxesSpec;
  return (
    <div className="flex justify-center mb-3">
      <div className="expr-card">
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {s.parts.map((p, i) =>
            p === "□" ? (
              <BoxChip key={i} letter={s.letter} value={s.state.value} />
            ) : (
              <span key={i} className="text-3xl font-bold text-purple-800">
                {p}
              </span>
            ),
          )}
        </div>
        {s.state.check && (
          <div className="text-center text-green-600 font-bold mt-2 animate-bounce-in">
            Both sides match! ✓
          </div>
        )}
      </div>
    </div>
  );
}
