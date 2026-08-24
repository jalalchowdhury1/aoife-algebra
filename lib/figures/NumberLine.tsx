import type { FigureSpec } from "../types";
import type { NumLineSpec } from "../model";
import { fmt } from "../model";

// The frog's number line. Warm hops (right) draw pink, cold hops (left) draw
// blue. Zero gets a fat tick — home. The frog and every hop only move on a
// figState, so the picture never lands anywhere she hasn't worked out.

const STEP = 44; // px between ticks in viewBox units
const PAD = 30;

export function NumberLine({ spec }: { spec: FigureSpec }) {
  const s = spec as NumLineSpec;
  const { min, max } = s;
  const { pos, hops = [], stars = [] } = s.state;
  const W = PAD * 2 + (max - min) * STEP;
  const H = 120;
  const Y = 78; // the line
  const x = (n: number) => PAD + (n - min) * STEP;

  return (
    <div className="flex justify-center mb-3">
      <div className="expr-card w-full max-w-xl overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 340 }}>
          {/* line + ticks */}
          <line x1={PAD - 14} y1={Y} x2={W - PAD + 14} y2={Y} stroke="#a855f7" strokeWidth={4} strokeLinecap="round" />
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const n = min + i;
            const zero = n === 0;
            return (
              <g key={n}>
                <line
                  x1={x(n)}
                  y1={Y - (zero ? 12 : 7)}
                  x2={x(n)}
                  y2={Y + (zero ? 12 : 7)}
                  stroke={zero ? "#7e22ce" : "#c084fc"}
                  strokeWidth={zero ? 5 : 3}
                  strokeLinecap="round"
                />
                <text
                  x={x(n)}
                  y={Y + 30}
                  textAnchor="middle"
                  fontSize={n < 0 ? 15 : 16}
                  fontWeight={zero ? 800 : 600}
                  fill={n < 0 ? "#3b82f6" : zero ? "#7e22ce" : "#9333ea"}
                >
                  {fmt(n)}
                </text>
              </g>
            );
          })}
          {/* hops as arcs */}
          {hops.map((h, i) => {
            const x1 = x(h.from);
            const x2 = x(h.to);
            const up = 34 + Math.min(14, Math.abs(h.to - h.from) * 2);
            const color = h.cold ? "#3b82f6" : "#f43f5e";
            const dir = x2 > x1 ? 1 : -1;
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${Y - 10} Q ${(x1 + x2) / 2} ${Y - up} ${x2} ${Y - 10}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={3.5}
                  strokeDasharray={h.cold ? "6 5" : undefined}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${x2} ${Y - 8} l ${-7 * dir} -8 l ${2 * dir} 8 z`}
                  fill={color}
                />
              </g>
            );
          })}
          {/* stars */}
          {stars.map((n) => (
            <text key={`s${n}`} x={x(n)} y={Y - 16} textAnchor="middle" fontSize={20}>
              ⭐
            </text>
          ))}
          {/* the frog */}
          {pos !== undefined && (
            <text x={x(pos)} y={Y - 14} textAnchor="middle" fontSize={26} className="animate-pop">
              🐸
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
